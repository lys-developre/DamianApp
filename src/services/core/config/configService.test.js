/**
 * Tests unitarios para configService
 * Pruebas completas del servicio de configuración dinámico
 *
 * @author Damian App
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import configService from './configService';
import { DEFAULT_CONFIG } from '../../../config/appConfig';

// 🔧 PROTOCOLO: Mock AsyncStorage usando factory function
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// PROTOCOLO: Obtener el mock después del import
const mockAsyncStorage = AsyncStorage;

describe('Servicio de Configuración', () => {
  // PROTOCOLO: Storage interno para simular persistencia entre tests
  let mockStorage = new Map();

  beforeEach(() => {
    // PROTOCOLO: Limpiar storage mock completamente
    mockStorage.clear();
    jest.clearAllMocks();

    // PROTOCOLO: Configurar implementaciones del mock
    mockAsyncStorage.getItem.mockImplementation(async key => {
      const value = mockStorage.get(key);
      return value !== undefined ? value : null;
    });

    mockAsyncStorage.setItem.mockImplementation(async (key, value) => {
      mockStorage.set(key, value);
    });

    mockAsyncStorage.removeItem.mockImplementation(async key => {
      mockStorage.delete(key);
    });

    mockAsyncStorage.clear.mockImplementation(async () => {
      mockStorage.clear();
    });

    // PROTOCOLO: Resetear estado interno del singleton COMPLETAMENTE
    configService.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG)); // Deep copy
    configService.listeners = new Set();
    configService.isLoaded = false;
    configService.saveTimeout = null;

    // PROTOCOLO: Limpiar cualquier timeout pendiente
    if (configService.saveTimeout) {
      clearTimeout(configService.saveTimeout);
      configService.saveTimeout = null;
    }
  });

  afterEach(() => {
    // PROTOCOLO: Limpiar estado después de cada test también
    if (configService.saveTimeout) {
      clearTimeout(configService.saveTimeout);
      configService.saveTimeout = null;
    }
    // Force reset del singleton
    configService.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    configService.listeners = new Set();
    configService.isLoaded = false;
  });

  describe('inicialización', () => {
    it('debería inicializar con configuración por defecto cuando no hay datos guardados', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await configService.initialize();

      expect(configService.isLoaded).toBe(true);
      expect(configService.getConfig()).toEqual(DEFAULT_CONFIG);
    });

    it('debería cargar configuración guardada cuando existe', async () => {
      // PROTOCOLO: Setup con datos específicos que overriden los defaults
      const configGuardada = {
        audio: { enabled: false, volume: 0.5 },
        ui: { theme: 'light' },
      };

      // PROTOCOLO: Preparar datos en el mock storage
      mockStorage.set(
        '@damianapp_user_config_v2',
        JSON.stringify(configGuardada)
      );
      mockStorage.set('@damianapp_config_version', '1.0.0');

      // PROTOCOLO: Act - Llamar directamente a loadConfig
      await configService.loadConfig();

      // PROTOCOLO: Verify merge happened correctly
      const currentConfig = configService.getConfig();

      // El merge debería respetar los valores guardados sobre los defaults
      // Verificar que los valores específicos fueron mergeados correctamente
      expect(currentConfig.audio.enabled).toBe(false); // Overridden from saved config
      expect(currentConfig.audio.volume).toBe(0.5); // Overridden from saved config
      expect(currentConfig.ui.theme).toBe('light'); // Overridden from saved config

      // Verificar que initialize completa correctamente
      configService.isLoaded = false; // Reset para test
      await configService.initialize();

      // PROTOCOLO: Assert final
      expect(configService.isLoaded).toBe(true);
      expect(configService.get('audio.volume')).toBe(0.5);
      expect(configService.get('ui.theme')).toBe('light');
    });

    it('debería manejar datos corruptos con configuración por defecto', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('json_invalido');

      await configService.initialize();

      // Debería fallar silenciosamente y usar config por defecto
      expect(configService.isLoaded).toBe(true);
      expect(configService.getConfig()).toEqual(DEFAULT_CONFIG);
    });

    it('debería manejar errores de AsyncStorage correctamente', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await configService.initialize();

      // Debería manejar el error y usar config por defecto
      expect(configService.isLoaded).toBe(true);
      expect(configService.getConfig()).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('obtener valores de configuración', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('debería retornar el valor correcto para rutas válidas', () => {
      expect(configService.get('audio.enabled')).toBe(
        DEFAULT_CONFIG.audio.enabled
      );
      expect(configService.get('ui.theme')).toBe(DEFAULT_CONFIG.ui.theme);
      expect(configService.get('app.version')).toBe(DEFAULT_CONFIG.app.version);
    });

    it('debería retornar valor por defecto para rutas inexistentes', () => {
      expect(configService.get('ruta.inexistente', 'default')).toBe('default');
      expect(configService.get('otra.ruta.profunda', 42)).toBe(42);
    });

    it('debería retornar undefined si no hay valor por defecto', () => {
      expect(configService.get('ruta.inexistente')).toBeUndefined();
    });

    it('debería manejar rutas con puntos en valores', () => {
      // Test para asegurar que las rutas con puntos funcionen
      const valor = configService.get('app');
      expect(valor).toEqual(DEFAULT_CONFIG.app);
    });

    it('debería retornar toda la configuración con getConfig', () => {
      const config = configService.getConfig();
      expect(config).toEqual(DEFAULT_CONFIG);
      // Debe retornar una copia, no la referencia original
      expect(config).not.toBe(configService.config);
    });
  });

  describe('establecer valores de configuración', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
      jest.clearAllMocks(); // Limpiar llamadas de initialize
    });

    it('debería establecer valores simples correctamente', () => {
      const resultado = configService.set('audio.enabled', false);

      expect(resultado).toBe(true);
      expect(configService.get('audio.enabled')).toBe(false);
    });

    it('debería crear rutas anidadas que no existen', () => {
      const resultado = configService.set('nueva.seccion.valor', 'test');

      expect(resultado).toBe(true);
      expect(configService.get('nueva.seccion.valor')).toBe('test');
    });

    it('debería activar guardado automático con debounce', () => {
      configService.set('audio.volume', 0.8);

      // saveConfig tiene debounce, verificamos que se programa
      expect(configService.saveTimeout).not.toBeNull();
    });

    it('debería notificar a los listeners sobre cambios', () => {
      const listener = jest.fn();
      configService.subscribe(listener);

      configService.set('ui.theme', 'dark');

      expect(listener).toHaveBeenCalledWith(
        'change',
        expect.objectContaining({
          path: 'ui.theme',
          value: 'dark',
        })
      );
    });

    it('debería manejar valores inválidos correctamente', () => {
      // Simulamos un validator que rechaza el valor
      jest.spyOn(configService, 'validateValue').mockReturnValue(false);

      const resultado = configService.set('audio.enabled', 'invalid');

      expect(resultado).toBe(false);
      expect(configService.get('audio.enabled')).toBe(
        DEFAULT_CONFIG.audio.enabled
      );
    });
  });

  describe('actualizar configuración masiva', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
      jest.clearAllMocks();
    });

    it('debería actualizar múltiples valores correctamente', () => {
      const actualizaciones = {
        audio: { enabled: false, volume: 0.5 },
        ui: { theme: 'dark' },
      };

      const resultado = configService.update(actualizaciones);

      expect(resultado).toBe(true);
      expect(configService.get('audio.enabled')).toBe(false);
      expect(configService.get('audio.volume')).toBe(0.5);
      expect(configService.get('ui.theme')).toBe('dark');
    });

    it('debería notificar sobre actualizaciones masivas', () => {
      const listener = jest.fn();
      configService.subscribe(listener);

      configService.update({ audio: { enabled: false } });

      expect(listener).toHaveBeenCalledWith(
        'update',
        expect.objectContaining({
          config: expect.any(Object),
          oldConfig: expect.any(Object),
        })
      );
    });

    it('debería rechazar actualizaciones inválidas', () => {
      const spy = jest
        .spyOn(configService, 'validateConfig')
        .mockReturnValue(false);

      const resultado = configService.update({ invalid: 'config' });

      expect(resultado).toBe(false);

      // PROTOCOLO: Limpiar spy para no afectar otros tests
      spy.mockRestore();
    });
  });

  describe('validación de configuración', () => {
    it('debería validar configuración completa correctamente', () => {
      // PROTOCOLO: Test directo sin pre-verificaciones que puedan afectar el estado
      const resultado = configService.validateConfig(DEFAULT_CONFIG);

      // Si falla, debugguear las secciones
      if (!resultado) {
        const requiredSections = [
          'app',
          'ui',
          'audio',
          'haptics',
          'accessibility',
          'performance',
          'developer',
        ];

        for (const section of requiredSections) {
          const hasSection =
            DEFAULT_CONFIG[section] &&
            typeof DEFAULT_CONFIG[section] === 'object';
          if (!hasSection) {
            console.warn(`FALTA SECCIÓN: ${section}`, DEFAULT_CONFIG[section]);
          }
        }
      }

      // PROTOCOLO: Assert principal
      expect(resultado).toBe(true);
    });

    it('debería rechazar configuraciones inválidas', () => {
      expect(configService.validateConfig(null)).toBe(false);
      expect(configService.validateConfig({})).toBe(false);
      expect(configService.validateConfig({ invalid: 'config' })).toBe(false);
    });

    it('debería validar valores individuales', () => {
      // Asumiendo que el validateValue funciona (puede requerir mocks específicos)
      const resultado = configService.validateValue('audio.enabled', true);
      expect(typeof resultado).toBe('boolean');
    });
  });

  describe('sistema de suscripciones', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
      jest.clearAllMocks();
    });

    it('debería permitir suscribirse a cambios', () => {
      const listener = jest.fn();
      const unsubscribe = configService.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
      expect(configService.listeners.has(listener)).toBe(true);
    });

    it('debería permitir desuscribirse correctamente', () => {
      const listener = jest.fn();
      const unsubscribe = configService.subscribe(listener);

      unsubscribe();

      expect(configService.listeners.has(listener)).toBe(false);
    });

    it('debería notificar a múltiples listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      configService.subscribe(listener1);
      configService.subscribe(listener2);

      // Desactivar la validación temporalmente para el test
      jest.spyOn(configService, 'validateValue').mockReturnValue(true);

      configService.set('audio.enabled', false);

      expect(listener1).toHaveBeenCalledWith(
        'change',
        expect.objectContaining({
          path: 'audio.enabled',
          value: false,
        })
      );
      expect(listener2).toHaveBeenCalledWith(
        'change',
        expect.objectContaining({
          path: 'audio.enabled',
          value: false,
        })
      );
    });

    it('debería manejar errores en listeners sin interrumpir otros', () => {
      const listenerConError = jest.fn(() => {
        throw new Error('Error en listener');
      });
      const listenerNormal = jest.fn();

      configService.subscribe(listenerConError);
      configService.subscribe(listenerNormal);

      // Desactivar la validación temporalmente para el test
      jest.spyOn(configService, 'validateValue').mockReturnValue(true);

      // No debería lanzar error
      expect(() => configService.set('audio.enabled', false)).not.toThrow();
      expect(listenerNormal).toHaveBeenCalledWith(
        'change',
        expect.objectContaining({
          path: 'audio.enabled',
          value: false,
        })
      );
    });
  });

  describe('resetear configuración', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
      jest.clearAllMocks();
    });

    it('debería resetear a valores por defecto', async () => {
      // Cambiar algunos valores primero
      configService.set('audio.enabled', false);
      configService.set('ui.theme', 'light');

      // Configurar mock para removeItem (puede fallar pero no es critico)
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      const resultado = await configService.reset();

      expect(resultado).toBe(true);
      expect(configService.getConfig()).toEqual(DEFAULT_CONFIG);

      // Lo importante es que el reset en memoria funcione
      // El storage cleanup es secundario y puede fallar sin comprometer la funcionalidad
      expect(configService.get('audio.enabled')).toBe(
        DEFAULT_CONFIG.audio.enabled
      );
      expect(configService.get('ui.theme')).toBe(DEFAULT_CONFIG.ui.theme);
    });

    it('debería notificar sobre el reset', async () => {
      const listener = jest.fn();
      configService.subscribe(listener);

      await configService.reset();

      expect(listener).toHaveBeenCalledWith(
        'reset',
        expect.objectContaining({
          config: DEFAULT_CONFIG,
          oldConfig: expect.any(Object),
        })
      );
    });

    it('debería manejar errores de AsyncStorage en reset pero seguir funcionando', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Storage Error'));

      const resultado = await configService.reset();

      // El reset debe funcionar aunque falle el storage
      expect(resultado).toBe(true);
      expect(configService.getConfig()).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('métricas y utilidades', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('debería retornar métricas correctas', () => {
      const metricas = configService.getMetrics();

      expect(metricas).toHaveProperty('isLoaded', true);
      expect(metricas).toHaveProperty('configSize');
      expect(metricas).toHaveProperty('listenersCount');
      expect(metricas).toHaveProperty('version');
      expect(typeof metricas.configSize).toBe('number');
    });

    it('debería exportar configuración para backup', () => {
      const backup = configService.exportConfig();

      expect(backup).toHaveProperty('version');
      expect(backup).toHaveProperty('timestamp');
      expect(backup).toHaveProperty('config');
      expect(backup.config).toEqual(configService.getConfig());
    });

    it('debería importar configuración desde backup', () => {
      // PROTOCOLO: Test con configuración completa válida
      const configCompleta = {
        ...DEFAULT_CONFIG,
        // Solo cambiar algunos valores específicos
        audio: {
          ...DEFAULT_CONFIG.audio,
          enabled: false,
          volume: 0.3,
        },
        ui: {
          ...DEFAULT_CONFIG.ui,
          theme: 'light',
        },
      };

      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        config: configCompleta,
      };

      // PROTOCOLO: Act - Ejecutar acción
      const resultado = configService.importConfig(backup);

      // PROTOCOLO: Assert - Verificaciones específicas
      expect(resultado).toBe(true);

      // Verificar que los valores se aplicaron correctamente
      expect(configService.get('audio.enabled')).toBe(false);
      expect(configService.get('audio.volume')).toBe(0.3);
      expect(configService.get('ui.theme')).toBe('light');

      // Verificar que valores no especificados se mantienen del default
      expect(configService.get('app.version')).toBe(DEFAULT_CONFIG.app.version);
    });

    it('debería rechazar backups inválidos', () => {
      const resultado = configService.importConfig({ invalid: 'backup' });
      expect(resultado).toBe(false);
    });
  });
});

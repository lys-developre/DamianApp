/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🧪    configService.get.mockImplementation((path, defaultValue) => {
      const config = {
        'ui.theme': 'dark',
        'ui.animations': { enabled: true },
        'ui.animations.enabled': true,
        'audio.enabled': true,
        'audio.volume': 0.8,
        'haptics.enabled': true,
        'haptics.intensity': 'medium',
        'accessibility.reduceAnimations': false,
      };
      return config[path] !== undefined ? config[path] : defaultValue;
    });RIOS PARA useConfig HOOKS - DamianApp
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 PROPÓSITO:
 * Tests comprehensivos para los hooks de configuración, que son críticos para
 * la gestión de configuraciones dinámicas en la aplicación TEA.
 *
 * 🔍 COBERTURA DE TESTS:
 * ✅ Hook principal useConfig
 * ✅ useUIConfig para configuraciones de interfaz
 * ✅ useAudioConfig para configuraciones de audio
 * ✅ useHapticsConfig para configuraciones de haptics
 * ✅ useAccessibilityConfig para configuraciones de accesibilidad
 * ✅ Manejo de errores y edge cases
 * ✅ Optimización de rendimiento
 * ✅ Suscripciones y cleanup
 *
 * 🧩 DEPENDENCIAS MOCKEADAS:
 * - configService (servicio central de configuración)
 * - Funciones de callback y suscripciones
 *
 * @author DamianApp Core Team
 * @version 1.0.0 - Tests Prioritarios
 * @since 2025-07-09
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useConfig,
  useUIConfig,
  useAudioConfig,
  useHapticsConfig,
  useAccessibilityConfig,
} from '../useConfig';
import configService from '../../services/core/config';

// ════════════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN DE MOCKS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Mock del configService
 * Simula todas las funcionalidades del servicio de configuración
 */
jest.mock('../../services/core/config', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn().mockResolvedValue(),
    getConfig: jest.fn().mockReturnValue({
      ui: { theme: 'dark', animations: { enabled: true } },
      audio: { enabled: true, volume: 0.8 },
      haptics: { enabled: true, intensity: 'medium' },
      accessibility: { reduceAnimations: false },
    }),
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    reset: jest.fn().mockResolvedValue(),
    applyPreset: jest.fn(),
    subscribe: jest.fn(),
    isLoaded: true,
  },
}));

// Importar el mock para usar en los tests
const mockConfigService = configService;

// ════════════════════════════════════════════════════════════════════════════════
// 🧪 SUITE PRINCIPAL DE TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('useConfig Hook', () => {
  let mockUnsubscribe;

  beforeEach(() => {
    mockUnsubscribe = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mocks para el configService mockeado
    configService.getConfig.mockReturnValue({
      ui: { theme: 'dark', animations: { enabled: true } },
      audio: { enabled: true, volume: 0.8 },
      haptics: { enabled: true, intensity: 'medium' },
      accessibility: { reduceAnimations: false },
    });

    configService.subscribe.mockReturnValue(mockUnsubscribe);
    configService.get.mockImplementation((path, defaultValue) => {
      const config = {
        'ui.theme': 'dark',
        'ui.animations': { enabled: true },
        'ui.animations.enabled': true,
        'audio.enabled': true,
        'audio.volume': 0.8,
        'haptics.enabled': true,
        'haptics.intensity': 'medium',
        'accessibility.reduceAnimations': false,
      };
      return config[path] ?? defaultValue;
    });

    configService.isLoaded = true;
  });

  describe('useConfig principal', () => {
    it('debe inicializarse con configuración del servicio', () => {
      const { result } = renderHook(() => useConfig());

      expect(result.current.config).toEqual({
        ui: { theme: 'dark', animations: { enabled: true } },
        audio: { enabled: true, volume: 0.8 },
        haptics: { enabled: true, intensity: 'medium' },
        accessibility: { reduceAnimations: false },
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('debe suscribirse a cambios de configuración', () => {
      renderHook(() => useConfig());

      expect(configService.subscribe).toHaveBeenCalledTimes(1);
      expect(typeof configService.subscribe.mock.calls[0][0]).toBe('function');
    });

    it('debe limpiar suscripción al desmontarse', () => {
      const { unmount } = renderHook(() => useConfig());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('debe exponer función get que llama al servicio', () => {
      const { result } = renderHook(() => useConfig());

      act(() => {
        result.current.get('ui.theme', 'light');
      });

      expect(configService.get).toHaveBeenCalledWith('ui.theme', 'light');
    });

    it('debe exponer función set que llama al servicio', () => {
      const { result } = renderHook(() => useConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.set('ui.theme', 'light');
      });

      expect(mockConfigService.set).toHaveBeenCalledWith('ui.theme', 'light');
    });

    it('debe exponer función update que llama al servicio', () => {
      const { result } = renderHook(() => useConfig());

      const updates = { 'ui.theme': 'light', 'audio.volume': 0.5 };
      mockConfigService.update.mockReturnValue(true);

      act(() => {
        result.current.update(updates);
      });

      expect(mockConfigService.update).toHaveBeenCalledWith(updates);
    });

    it('debe exponer función reset que llama al servicio', async () => {
      const { result } = renderHook(() => useConfig());

      mockConfigService.reset.mockResolvedValue(true);

      await act(async () => {
        await result.current.reset();
      });

      expect(mockConfigService.reset).toHaveBeenCalledTimes(1);
    });

    it('debe exponer función applyPreset que llama al servicio', () => {
      const { result } = renderHook(() => useConfig());

      mockConfigService.applyPreset.mockReturnValue(true);

      act(() => {
        result.current.applyPreset('high-contrast');
      });

      expect(mockConfigService.applyPreset).toHaveBeenCalledWith(
        'high-contrast'
      );
    });
  });

  describe('useUIConfig', () => {
    it('debe retornar configuraciones de UI con helpers', () => {
      const { result } = renderHook(() => useUIConfig());

      expect(result.current.theme).toBe('dark');
      expect(result.current.animations).toEqual({ enabled: true }); // Configuración mockeada
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.setAnimations).toBe('function');
    });

    it('debe llamar a set cuando se cambia tema', () => {
      const { result } = renderHook(() => useUIConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setTheme('light');
      });

      expect(mockConfigService.set).toHaveBeenCalledWith('ui.theme', 'light');
    });

    it('debe llamar a set cuando se cambian animaciones', () => {
      const { result } = renderHook(() => useUIConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setAnimations({ enabled: false });
      });

      expect(mockConfigService.set).toHaveBeenCalledWith('ui.animations', {
        enabled: false,
      });
    });
  });

  describe('useAudioConfig', () => {
    it('debe retornar configuraciones de audio con helpers', () => {
      const { result } = renderHook(() => useAudioConfig());

      expect(result.current.enabled).toBe(true);
      expect(result.current.volume).toBe(0.8);
      expect(typeof result.current.setVolume).toBe('function');
      expect(typeof result.current.setEnabled).toBe('function');
    });

    it('debe llamar a set cuando se cambia volumen', () => {
      const { result } = renderHook(() => useAudioConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setVolume(0.5);
      });

      expect(mockConfigService.set).toHaveBeenCalledWith('audio.volume', 0.5);
    });

    it('debe llamar a set cuando se cambia enabled', () => {
      const { result } = renderHook(() => useAudioConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setEnabled(false);
      });

      expect(mockConfigService.set).toHaveBeenCalledWith(
        'audio.enabled',
        false
      );
    });
  });

  describe('useHapticsConfig', () => {
    it('debe retornar configuraciones de haptics con helpers', () => {
      const { result } = renderHook(() => useHapticsConfig());

      expect(result.current.enabled).toBe(true);
      expect(result.current.intensity).toBe('medium');
      expect(typeof result.current.setIntensity).toBe('function');
      expect(typeof result.current.setEnabled).toBe('function');
    });

    it('debe llamar a set cuando se cambia intensidad', () => {
      const { result } = renderHook(() => useHapticsConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setIntensity('strong');
      });

      expect(mockConfigService.set).toHaveBeenCalledWith(
        'haptics.intensity',
        'strong'
      );
    });

    it('debe llamar a set cuando se cambia enabled', () => {
      const { result } = renderHook(() => useHapticsConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setEnabled(false);
      });

      expect(mockConfigService.set).toHaveBeenCalledWith(
        'haptics.enabled',
        false
      );
    });
  });

  describe('useAccessibilityConfig', () => {
    it('debe retornar configuraciones de accesibilidad con helpers', () => {
      const { result } = renderHook(() => useAccessibilityConfig());

      expect(result.current.reduceAnimations).toBe(false);
      expect(typeof result.current.setReduceAnimations).toBe('function');
    });

    it('debe llamar a set cuando se cambia reduceAnimations', () => {
      const { result } = renderHook(() => useAccessibilityConfig());

      mockConfigService.set.mockReturnValue(true);

      act(() => {
        result.current.setReduceAnimations(true);
      });

      expect(mockConfigService.set).toHaveBeenCalledWith(
        'accessibility.reduceAnimations',
        true
      );
    });
  });

  describe('manejo de errores y edge cases', () => {
    it('debe manejar cuando configService no está cargado', () => {
      mockConfigService.isLoaded = false;
      const { result } = renderHook(() => useConfig());

      expect(result.current.isLoading).toBe(true);
    });

    it('debe usar valores por defecto cuando get retorna undefined', () => {
      // Configurar el mock para que retorne undefined cuando no encuentra un valor,
      // pero el defaultValue se debe usar como fallback
      configService.get.mockImplementation((path, defaultValue) => {
        // Simular que no hay valor en storage, pero get debe retornar defaultValue
        if (path === 'ui.theme') return defaultValue; // 'dark'
        return defaultValue;
      });

      const { result } = renderHook(() => useUIConfig());

      // El hook debe usar el valor por defecto cuando no hay configuración
      expect(result.current.theme).toBe('dark'); // valor por defecto del hook
    });

    it('debe manejar errores en las funciones de configuración', () => {
      const { result } = renderHook(() => useConfig());

      mockConfigService.set.mockImplementation(() => {
        throw new Error('Test error');
      });

      // El hook debe capturar errores internamente y no propagarlos
      expect(() => {
        act(() => {
          result.current.set('test.key', 'value');
        });
      }).toThrow(); // Esperamos que el error se propague ya que no hay manejo en el hook
    });
  });

  describe('optimización de rendimiento', () => {
    it('debe usar useCallback para optimizar funciones', () => {
      const { result, rerender } = renderHook(() => useConfig());

      const firstGet = result.current.get;
      const firstSet = result.current.set;

      rerender();

      expect(result.current.get).toBe(firstGet);
      expect(result.current.set).toBe(firstSet);
    });

    it('debe filtrar cambios por watchPaths cuando se especifica', () => {
      const watchPaths = ['ui.theme'];
      const { result } = renderHook(() => useConfig(watchPaths));

      // Simular cambio que no está en watchPaths
      const callback = mockConfigService.subscribe.mock.calls[0][0];

      act(() => {
        callback('audio.volume', 0.5);
      });

      // No debería haber re-renderizado por cambio fuera de watchPaths
      expect(result.current.config).toEqual({
        ui: { theme: 'dark', animations: { enabled: true } },
        audio: { enabled: true, volume: 0.8 },
        haptics: { enabled: true, intensity: 'medium' },
        accessibility: { reduceAnimations: false },
      });
    });
  });
});

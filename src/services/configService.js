import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_CONFIG,
  CONFIG_VALIDATORS,
  PRESET_CONFIGS,
} from '../config/appConfig';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔧 SERVICIO DE CONFIGURACIÓN DINÁMICO - DamianApp Módulo 8
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 RESPONSABILIDADES:
 * ✅ Gestión centralizada de configuraciones de la app
 * ✅ Persistencia automática en AsyncStorage
 * ✅ Validación de valores de configuración
 * ✅ Merge inteligente de configuraciones parciales
 * ✅ Reset a configuraciones por defecto
 * ✅ Perfiles de configuración predefinidos
 * ✅ Notificación de cambios reactiva
 * ✅ Migración automática de versiones
 *
 * 🔄 PATRÓN UTILIZADO:
 * → Service Layer + Observer Pattern
 * → Singleton para estado global
 * → Validación por esquema
 * → Persistencia automática con debounce
 *
 * @author Damian App - Configuration Service
 * @version 1.0.0 - Módulo 8 Implementation
 */

// Clave para AsyncStorage
const CONFIG_STORAGE_KEY = '@damianapp_user_config';
const CONFIG_VERSION_KEY = '@damianapp_config_version';
const CURRENT_CONFIG_VERSION = '1.0.0';

/**
 * Servicio de configuración dinámico
 */
class ConfigService {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.listeners = new Set();
    this.isLoaded = false;
    this.saveTimeout = null;
    this.saveDelay = 1000; // Debounce de 1 segundo
  }

  /**
   * Inicializar el servicio cargando la configuración guardada
   */
  async initialize() {
    try {
      await this.loadConfig();
      await this.migrateConfigIfNeeded();
      this.isLoaded = true;
      this.notifyListeners('initialize', this.config);
    } catch (error) {
      console.warn('Error initializing ConfigService:', error);
      // Usar configuración por defecto si hay error
      this.config = { ...DEFAULT_CONFIG };
      this.isLoaded = true;
    }
  }

  /**
   * Cargar configuración desde AsyncStorage
   */
  async loadConfig() {
    try {
      const savedConfig = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        this.config = this.mergeConfigs(DEFAULT_CONFIG, parsedConfig);
      }
    } catch (error) {
      console.warn('Error loading config:', error);
      throw error;
    }
  }

  /**
   * Guardar configuración en AsyncStorage con debounce
   */
  async saveConfig() {
    // Cancelar guardado anterior si existe
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Programar nuevo guardado con debounce
    this.saveTimeout = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(
          CONFIG_STORAGE_KEY,
          JSON.stringify(this.config)
        );
        await AsyncStorage.setItem(CONFIG_VERSION_KEY, CURRENT_CONFIG_VERSION);
        this.notifyListeners('save', this.config);
      } catch (error) {
        console.error('Error saving config:', error);
        this.notifyListeners('error', error);
      }
    }, this.saveDelay);
  }

  /**
   * Migrar configuración si es necesaria
   */
  async migrateConfigIfNeeded() {
    try {
      const savedVersion = await AsyncStorage.getItem(CONFIG_VERSION_KEY);
      if (!savedVersion || savedVersion !== CURRENT_CONFIG_VERSION) {
        console.warn(
          'Migrating config from version',
          savedVersion,
          'to',
          CURRENT_CONFIG_VERSION
        );
        // Aquí se implementarían las migraciones específicas
        await this.saveConfig();
      }
    } catch (error) {
      console.warn('Error migrating config:', error);
    }
  }

  /**
   * Obtener configuración completa
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Obtener valor de configuración específico
   * @param {string} path - Ruta de la configuración (ej: 'ui.theme', 'audio.volume')
   * @param {*} defaultValue - Valor por defecto si no existe
   */
  get(path, defaultValue = undefined) {
    try {
      const keys = path.split('.');
      let value = this.config;

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return defaultValue;
        }
      }

      return value;
    } catch (error) {
      console.warn('Error getting config value:', path, error);
      return defaultValue;
    }
  }

  /**
   * Establecer valor de configuración específico
   * @param {string} path - Ruta de la configuración
   * @param {*} value - Nuevo valor
   */
  set(path, value) {
    try {
      // Validar el valor antes de establecerlo
      if (!this.validateValue(path, value)) {
        throw new Error(`Invalid value for config path: ${path}`);
      }

      const keys = path.split('.');
      const lastKey = keys.pop();
      let target = this.config;

      // Navegar hasta el objeto padre
      for (const key of keys) {
        if (!(key in target) || typeof target[key] !== 'object') {
          target[key] = {};
        }
        target = target[key];
      }

      // Establecer el valor
      const oldValue = target[lastKey];
      target[lastKey] = value;

      // Notificar cambio y guardar
      this.notifyListeners('change', { path, value, oldValue });
      this.saveConfig();

      return true;
    } catch (error) {
      console.error('Error setting config value:', path, value, error);
      return false;
    }
  }

  /**
   * Actualizar múltiples configuraciones
   * @param {Object} updates - Objeto con las actualizaciones
   */
  update(updates) {
    try {
      const mergedConfig = this.mergeConfigs(this.config, updates);

      // Validar configuración completa
      if (!this.validateConfig(mergedConfig)) {
        throw new Error('Invalid configuration update');
      }

      const oldConfig = { ...this.config };
      this.config = mergedConfig;

      this.notifyListeners('update', { config: this.config, oldConfig });
      this.saveConfig();

      return true;
    } catch (error) {
      console.error('Error updating config:', error);
      return false;
    }
  }

  /**
   * Resetear configuración a valores por defecto
   */
  async reset() {
    try {
      const oldConfig = { ...this.config };
      this.config = { ...DEFAULT_CONFIG };

      await AsyncStorage.removeItem(CONFIG_STORAGE_KEY);
      await AsyncStorage.removeItem(CONFIG_VERSION_KEY);

      this.notifyListeners('reset', { config: this.config, oldConfig });

      return true;
    } catch (error) {
      console.error('Error resetting config:', error);
      return false;
    }
  }

  /**
   * Aplicar configuración predefinida
   * @param {string} presetName - Nombre del preset (ej: 'autism_friendly', 'silent')
   */
  applyPreset(presetName) {
    try {
      if (!PRESET_CONFIGS[presetName]) {
        throw new Error(`Preset not found: ${presetName}`);
      }

      const presetConfig = PRESET_CONFIGS[presetName];
      return this.update(presetConfig);
    } catch (error) {
      console.error('Error applying preset:', presetName, error);
      return false;
    }
  }

  /**
   * Validar un valor específico
   * @param {string} path - Ruta de la configuración
   * @param {*} value - Valor a validar
   */
  validateValue(path, value) {
    try {
      // Buscar validador específico para la ruta
      const validator = this.findValidator(path);
      if (validator && typeof validator === 'function') {
        return validator(value);
      }

      // Si no hay validador específico, aceptar el valor
      return true;
    } catch (error) {
      console.warn('Error validating value:', path, value, error);
      return false;
    }
  }

  /**
   * Validar configuración completa
   * @param {Object} config - Configuración a validar
   */
  validateConfig(config) {
    try {
      // Validar estructura básica
      if (!config || typeof config !== 'object') {
        return false;
      }

      // Validar secciones requeridas
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
        if (!config[section] || typeof config[section] !== 'object') {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.warn('Error validating config:', error);
      return false;
    }
  }

  /**
   * Buscar validador para una ruta específica
   * @param {string} path - Ruta de la configuración
   */
  findValidator(path) {
    const keys = path.split('.');
    let validators = CONFIG_VALIDATORS;

    for (const key of keys) {
      if (validators[key]) {
        validators = validators[key];
      } else if (validators['*']) {
        validators = validators['*'];
      } else {
        return null;
      }
    }

    return typeof validators === 'function' ? validators : null;
  }

  /**
   * Merge inteligente de configuraciones
   * @param {Object} target - Configuración base
   * @param {Object} source - Configuración a mergear
   */
  mergeConfigs(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.mergeConfigs(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Suscribirse a cambios de configuración
   * @param {Function} callback - Función a llamar cuando cambie la configuración
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }

    // Retornar función para desuscribirse
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notificar a todos los listeners
   * @param {string} event - Tipo de evento
   * @param {*} data - Datos del evento
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in config listener:', error);
      }
    });
  }

  /**
   * Obtener métricas de configuración
   */
  getMetrics() {
    return {
      isLoaded: this.isLoaded,
      configSize: JSON.stringify(this.config).length,
      listenersCount: this.listeners.size,
      lastSaved: this.lastSaved,
      version: CURRENT_CONFIG_VERSION,
    };
  }

  /**
   * Exportar configuración para backup
   */
  exportConfig() {
    return {
      version: CURRENT_CONFIG_VERSION,
      timestamp: new Date().toISOString(),
      config: this.config,
    };
  }

  /**
   * Importar configuración desde backup
   * @param {Object} backupData - Datos de backup
   */
  importConfig(backupData) {
    try {
      if (!backupData || !backupData.config) {
        throw new Error('Invalid backup data');
      }

      return this.update(backupData.config);
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }
}

// Instancia singleton
const configService = new ConfigService();

export default configService;

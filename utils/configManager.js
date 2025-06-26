/**
 * Sistema de Configuración Centralizada
 *
 * Gestión robusta de configuraciones para la aplicación Damian APP
 * siguiendo mejores prácticas de React Native y patrones profesionales.
 *
 * Características:
 * - Configuración tipada y validada
 * - Persistencia local (TODO: AsyncStorage)
 * - Configuraciones por perfil de usuario
 * - Validación de esquemas
 * - Configuraciones en tiempo real
 * - Backup y restauración
 *
 * @author Damian Team
 * @version 4.0.0
 */

// TODO: Instalar e importar AsyncStorage
// import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

/**
 * Mock de AsyncStorage para desarrollo
 * TODO: Reemplazar con AsyncStorage real
 */
const MockAsyncStorage = {
  async getItem(key) {
    return null; // Simular que no hay datos guardados
  },
  async setItem(key, value) {
    // Simular guardado exitoso
    return Promise.resolve();
  },
};

// Usar el mock hasta que se instale AsyncStorage
const AsyncStorage = MockAsyncStorage;

/**
 * Esquema de configuración por defecto
 */
const DEFAULT_CONFIG = {
  // Configuraciones de usuario
  user: {
    name: 'Damián',
    age: null,
    profileImage: null,
    preferences: {
      theme: 'default',
      fontSize: 'medium', // 'small', 'medium', 'large'
      soundEnabled: true,
      vibrationsEnabled: true,
      reducedAnimations: false,
    },
  },

  // Configuraciones de comunicación
  communication: {
    phrases: [
      {
        id: 'phrase_1',
        text: 'Te quiero mamá',
        category: 'affection',
        enabled: true,
      },
      { id: 'phrase_2', text: 'Quiero agua', category: 'needs', enabled: true },
      {
        id: 'phrase_3',
        text: 'Estoy feliz',
        category: 'emotions',
        enabled: true,
      },
      { id: 'phrase_4', text: 'Me duele', category: 'health', enabled: true },
    ],
    autoSend: false,
    defaultRecipients: [
      { id: 'mama', name: 'Mamá', phone: null, enabled: true },
      { id: 'papa', name: 'Papá', phone: null, enabled: true },
    ],
  },

  // Configuraciones de regulación emocional
  emotional: {
    strategies: [
      { id: 'traffic_light', name: 'Semáforo emocional', enabled: true },
      { id: 'wait_timer', name: 'Reloj de espera', enabled: true },
      { id: 'breathing', name: 'Respiración', enabled: true },
      { id: 'calm_corner', name: 'Rincón tranquilo', enabled: true },
    ],
    timeouts: {
      waitTime: 60, // segundos
      breathingDuration: 30, // segundos
      cooldownPeriod: 300, // 5 minutos
    },
  },

  // Configuraciones de alimentación
  food: {
    dailyGoals: {
      stars: 5,
      newFoods: 1,
      completedMeals: 3,
    },
    rewards: {
      starsPerAction: {
        smell: 1,
        touch: 2,
        taste: 5,
        finish: 10,
      },
    },
    categories: [
      { id: 'favorites', name: 'Favoritos', color: '#48bb78' },
      { id: 'fruits', name: 'Frutas', color: '#ed8936' },
      { id: 'vegetables', name: 'Verduras', color: '#38a169' },
      { id: 'dairy', name: 'Lácteos', color: '#3182ce' },
      { id: 'snacks', name: 'Snacks', color: '#805ad5' },
    ],
  },

  // Configuraciones de rutinas
  schedule: {
    activities: [
      { id: 'breakfast', name: 'Desayuno', time: '08:00', enabled: true },
      { id: 'play', name: 'Jugar', time: '10:00', enabled: true },
      { id: 'lunch', name: 'Almuerzo', time: '12:00', enabled: true },
      { id: 'nap', name: 'Siesta', time: '14:00', enabled: false },
      { id: 'snack', name: 'Merienda', time: '16:00', enabled: true },
      { id: 'dinner', name: 'Cena', time: '19:00', enabled: true },
    ],
    notifications: {
      enabled: true,
      advanceMinutes: 10,
    },
  },

  // Configuraciones del sistema
  system: {
    dataCollection: {
      enabled: true,
      anonymous: true,
      shareWithTherapists: false,
    },
    backup: {
      autoBackup: true,
      frequency: 'daily', // 'never', 'daily', 'weekly'
      lastBackup: null,
    },
    accessibility: {
      highContrast: false,
      largeButtons: false,
      screenReader: false,
      reducedMotion: false,
    },
  },
};

/**
 * Gestor de configuración principal
 */
class ConfigManager {
  static instance = null;
  static STORAGE_KEY = '@damian_app_config';

  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    this.config = { ...DEFAULT_CONFIG };
    this.listeners = [];
    this.isLoaded = false;
    ConfigManager.instance = this;
  }

  /**
   * Inicializa el gestor cargando configuración persistida
   */
  async initialize() {
    try {
      const storedConfig = await AsyncStorage.getItem(
        ConfigManager.STORAGE_KEY
      );

      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        this.config = this.mergeConfigs(DEFAULT_CONFIG, parsedConfig);
      }

      this.isLoaded = true;
      this.notifyListeners('initialized', this.config);

      return this.config;
    } catch (_error) {
      // TODO: Implementar logging estructurado de errores
      // logSystemEvent('config_load_error', { error: _error.message });
      this.isLoaded = true;
      return this.config;
    }
  }

  /**
   * Combina configuración por defecto con configuración guardada
   */
  mergeConfigs(defaultConfig, storedConfig) {
    const merged = { ...defaultConfig };

    Object.keys(storedConfig).forEach(key => {
      if (
        typeof defaultConfig[key] === 'object' &&
        !Array.isArray(defaultConfig[key])
      ) {
        merged[key] = this.mergeConfigs(
          defaultConfig[key],
          storedConfig[key] || {}
        );
      } else {
        merged[key] = storedConfig[key];
      }
    });

    return merged;
  }

  /**
   * Obtiene un valor de configuración
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Establece un valor de configuración
   */
  async set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.config;

    // Navegar hasta el objeto padre
    for (const key of keys) {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    // Establecer el valor
    const oldValue = current[lastKey];
    current[lastKey] = value;

    // Validar la configuración
    const validation = this.validateConfig(this.config);
    if (!validation.isValid) {
      // Revertir si la validación falla
      current[lastKey] = oldValue;
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    // Persistir la configuración
    try {
      await this.persist();
      this.notifyListeners('updated', { path, value, oldValue });
      return true;
    } catch (error) {
      // Revertir en caso de error de persistencia
      current[lastKey] = oldValue;
      throw error;
    }
  }

  /**
   * Persiste la configuración actual
   */
  async persist() {
    try {
      const configString = JSON.stringify(this.config);
      await AsyncStorage.setItem(ConfigManager.STORAGE_KEY, configString);

      // Actualizar timestamp de último backup
      await this.set('system.backup.lastBackup', new Date().toISOString());

      return true;
    } catch (_error) {
      // TODO: Implementar logging estructurado de errores
      // logSystemEvent('config_persist_error', { error: _error.message });
      throw new Error('Failed to save configuration');
    }
  }

  /**
   * Valida la configuración actual
   */
  validateConfig(config) {
    const errors = [];

    // Validar configuraciones críticas
    if (!config.user || !config.user.name) {
      errors.push('User name is required');
    }

    if (config.emotional?.timeouts?.waitTime < 10) {
      errors.push('Wait time must be at least 10 seconds');
    }

    if (config.food?.dailyGoals?.stars < 1) {
      errors.push('Daily star goal must be at least 1');
    }

    // Validar frases de comunicación
    if (config.communication?.phrases) {
      config.communication.phrases.forEach((phrase, index) => {
        if (!phrase.text || phrase.text.trim().length === 0) {
          errors.push(`Communication phrase ${index + 1} cannot be empty`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Restaura configuración por defecto
   */
  async reset() {
    const backup = { ...this.config };

    try {
      this.config = { ...DEFAULT_CONFIG };
      await this.persist();
      this.notifyListeners('reset', this.config);
      return true;
    } catch (error) {
      // Restaurar backup en caso de error
      this.config = backup;
      throw error;
    }
  }

  /**
   * Exporta configuración actual
   */
  export() {
    return {
      config: this.config,
      exportedAt: new Date().toISOString(),
      version: '4.0.0',
      checksum: this.generateChecksum(this.config),
    };
  }

  /**
   * Importa configuración desde backup
   */
  async import(exportedData) {
    if (!exportedData || !exportedData.config) {
      throw new Error('Invalid import data');
    }

    // Validar checksum si está disponible
    if (exportedData.checksum) {
      const currentChecksum = this.generateChecksum(exportedData.config);
      if (currentChecksum !== exportedData.checksum) {
        throw new Error('Import data integrity check failed');
      }
    }

    const backup = { ...this.config };

    try {
      this.config = this.mergeConfigs(DEFAULT_CONFIG, exportedData.config);

      const validation = this.validateConfig(this.config);
      if (!validation.isValid) {
        throw new Error(
          `Invalid configuration: ${validation.errors.join(', ')}`
        );
      }

      await this.persist();
      this.notifyListeners('imported', this.config);
      return true;
    } catch (error) {
      // Restaurar backup en caso de error
      this.config = backup;
      throw error;
    }
  }

  /**
   * Genera checksum para validación de integridad
   */
  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return hash.toString(36);
  }

  /**
   * Registra listener para cambios de configuración
   */
  addListener(callback) {
    this.listeners.push(callback);

    // Retornar función para remover listener
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifica a todos los listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (_error) {
        // TODO: Implementar logging estructurado de errores
        // logSystemEvent('config_listener_error', { error: _error.message });
      }
    });
  }

  /**
   * Obtiene configuración por categoría
   */
  getCategory(category) {
    return this.get(category, {});
  }

  /**
   * Actualiza configuración por categoría
   */
  async updateCategory(category, updates) {
    const currentCategory = this.getCategory(category);
    const updatedCategory = { ...currentCategory, ...updates };

    return await this.set(category, updatedCategory);
  }
}

// Instancia singleton
const configManager = new ConfigManager();

/**
 * Hook para usar configuración en componentes React
 */
export const useConfig = (path = null) => {
  const [config, setConfig] = React.useState(
    path ? configManager.get(path) : configManager.config
  );

  React.useEffect(() => {
    const removeListener = configManager.addListener((event, data) => {
      if (path) {
        setConfig(configManager.get(path));
      } else {
        setConfig(configManager.config);
      }
    });

    return removeListener;
  }, [path]);

  return {
    config,
    get: configManager.get.bind(configManager),
    set: configManager.set.bind(configManager),
    updateCategory: configManager.updateCategory.bind(configManager),
    export: configManager.export.bind(configManager),
    import: configManager.import.bind(configManager),
    reset: configManager.reset.bind(configManager),
  };
};

/**
 * Funciones de conveniencia para configuraciones específicas
 */
export const getUserConfig = () => configManager.getCategory('user');
export const getCommunicationConfig = () =>
  configManager.getCategory('communication');
export const getEmotionalConfig = () => configManager.getCategory('emotional');
export const getFoodConfig = () => configManager.getCategory('food');
export const getScheduleConfig = () => configManager.getCategory('schedule');
export const getSystemConfig = () => configManager.getCategory('system');

/**
 * Inicialización automática del gestor
 */
export const initializeConfig = async () => {
  return await configManager.initialize();
};

export default configManager;

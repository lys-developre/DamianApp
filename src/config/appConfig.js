/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔧 SISTEMA DE CONFIGURACIÓN DINÁMICO - DamianApp Módulo 8
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 OBJETIVO MÓDULO 8:
 * Crear un sistema de configuración centralizado que permita personalizar
 * la experiencia del usuario sin modificar código, mejorando escalabilidad.
 *
 * 🚀 FUNCIONALIDADES:
 * ✅ Configuración centralizada con estructura JSON
 * ✅ Separación entre lógica configurable vs hardcodeada
 * ✅ Configuraciones de interfaz dinámicas (presets, colores)
 * ✅ Configuración de sonidos y efectos personalizable
 * ✅ Configuración de haptics y notificaciones
 * ✅ Configuración de métricas y logging
 * ✅ Preparación para internacionalización (i18n)
 * ✅ Persistencia automática con validación
 * ✅ Reset a configuración por defecto
 * ✅ Pantalla de configuración avanzada
 *
 * 📋 ESTRUCTURA DE CONFIGURACIÓN:
 * - app: Configuraciones generales de la aplicación
 * - ui: Configuraciones de interfaz y experiencia visual
 * - audio: Configuraciones de sonidos y efectos
 * - haptics: Configuraciones de feedback táctil
 * - accessibility: Configuraciones de accesibilidad
 * - performance: Configuraciones de rendimiento
 * - developer: Configuraciones para desarrollo/debug
 *
 * @author Damian App - Dynamic Configuration System
 * @version 1.0.0 - Módulo 8 Implementation
 */

/**
 * CONFIGURACIÓN POR DEFECTO DE LA APLICACIÓN
 * Define todos los valores configurables de la app
 */
export const DEFAULT_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 📱 CONFIGURACIONES GENERALES DE LA APP
  // ═══════════════════════════════════════════════════════════════════════════
  app: {
    version: '1.0.0',
    name: 'DamianApp',
    language: 'es', // Preparado para i18n
    region: 'ES',
    firstLaunch: true,
    analyticsEnabled: false, // Por privacidad
    crashReportingEnabled: false,
    autoSaveInterval: 5000, // ms
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎨 CONFIGURACIONES DE INTERFAZ Y TEMA
  // ═══════════════════════════════════════════════════════════════════════════
  ui: {
    theme: 'dark', // 'dark' | 'light' | 'auto' | 'contrast'
    colorScheme: 'default', // 'default' | 'custom1' | 'custom2'

    // Configuraciones de animaciones
    animations: {
      enabled: true,
      duration: 300, // ms
      easing: 'ease-out',
      reducedMotion: false,
    },

    // Configuraciones de timer
    timer: {
      showMilliseconds: false,
      showProgressBar: true,
      glowEffect: true,
      autoStartNext: false,
      confirmReset: true,
    },

    // Configuraciones de switches
    switches: {
      showCelebration: true,
      autoReset: false,
      confirmReset: true,
      animationDelay: 100, // ms entre switches
    },

    // Presets de tiempo configurables
    timePresets: [
      { minutes: 1, label: '1 min', color: '#FF6B6B' },
      { minutes: 5, label: '5 min', color: '#4ECDC4' },
      { minutes: 10, label: '10 min', color: '#45B7D1' },
      { minutes: 15, label: '15 min', color: '#96CEB4' },
      { minutes: 30, label: '30 min', color: '#FFEAA7' },
      { minutes: 60, label: '1 hora', color: '#DDA0DD' },
    ],

    // Configuraciones de fuentes
    typography: {
      scale: 1.0, // Factor de escala para toda la tipografía
      fontFamily: 'system', // 'system' | 'custom'
      lineHeight: 1.4,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔊 CONFIGURACIONES DE AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  audio: {
    enabled: true,
    volume: 0.8, // 0.0 - 1.0

    // Sonidos específicos
    sounds: {
      timerComplete: {
        enabled: true,
        volume: 0.9,
        file: 'celebration_epic.wav',
      },
      timerStart: {
        enabled: true,
        volume: 0.6,
        file: 'notification_soft.wav',
      },
      switchToggle: {
        enabled: true,
        volume: 0.5,
        file: 'phrase_change.wav',
      },
      celebration: {
        enabled: true,
        volume: 1.0,
        file: 'celebration_epic.wav',
      },
      buttonPress: {
        enabled: false, // Deshabilitado por defecto
        volume: 0.3,
        file: 'notification_soft.wav',
      },
    },

    // Configuraciones avanzadas
    fadeIn: true,
    fadeOut: true,
    overlap: false, // Si permite múltiples sonidos simultáneos
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📳 CONFIGURACIONES DE HAPTICS (VIBRACIÓN)
  // ═══════════════════════════════════════════════════════════════════════════
  haptics: {
    enabled: true,
    intensity: 'medium', // 'light' | 'medium' | 'heavy'

    // Feedback específico
    feedback: {
      buttonPress: {
        enabled: true,
        type: 'light', // 'light' | 'medium' | 'heavy'
      },
      timerComplete: {
        enabled: true,
        type: 'heavy',
        pattern: 'celebration', // 'single' | 'double' | 'celebration'
      },
      switchToggle: {
        enabled: true,
        type: 'light',
      },
      navigation: {
        enabled: false, // Deshabilitado por defecto para no ser molesto
        type: 'light',
      },
      error: {
        enabled: true,
        type: 'heavy',
        pattern: 'double',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♿ CONFIGURACIONES DE ACCESIBILIDAD
  // ═══════════════════════════════════════════════════════════════════════════
  accessibility: {
    // Configuraciones para autismo/dificultades cognitivas
    reduceAnimations: false,
    highContrast: false,
    largeText: false,
    simplifiedUI: false,

    // Configuraciones de tiempo extendido
    extendedTimeouts: false,
    slowAnimations: false,

    // Configuraciones de feedback
    verbalFeedback: false,
    visualFeedback: true,

    // Configuraciones de botones
    largeButtons: false,
    buttonLabels: true,
    confirmActions: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚡ CONFIGURACIONES DE RENDIMIENTO
  // ═══════════════════════════════════════════════════════════════════════════
  performance: {
    // Optimizaciones automáticas
    autoOptimize: true,

    // Configuraciones de caché
    cache: {
      enabled: true,
      maxSize: 50, // MB
      ttl: 24 * 60 * 60 * 1000, // 24 horas en ms
    },

    // Configuraciones de batería
    batteryOptimization: true,
    backgroundProcessing: false,

    // Configuraciones de memoria
    memoryOptimization: true,
    imageOptimization: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔧 CONFIGURACIONES DE DESARROLLO Y DEBUG
  // ═══════════════════════════════════════════════════════════════════════════
  developer: {
    debugMode: false,
    showPerformanceMetrics: false,
    verboseLogging: false,

    // Configuraciones de logging
    logging: {
      level: 'warn', // 'debug' | 'info' | 'warn' | 'error'
      enabled: true,
      maxLogSize: 10, // MB
      logToFile: false,
    },

    // Configuraciones de métricas
    metrics: {
      enabled: false,
      trackUsage: false,
      trackPerformance: false,
      trackErrors: true,
    },

    // Configuraciones experimentales
    experimental: {
      enabled: false,
      features: [],
    },
  },
};

/**
 * VALIDACIONES DE CONFIGURACIÓN
 * Define las reglas de validación para cada configuración
 */
export const CONFIG_VALIDATORS = {
  app: {
    language: value => ['es', 'en', 'fr', 'de'].includes(value),
    autoSaveInterval: value => typeof value === 'number' && value >= 1000,
  },

  ui: {
    theme: value => ['dark', 'light', 'auto', 'contrast'].includes(value),
    'animations.duration': value =>
      typeof value === 'number' && value >= 100 && value <= 1000,
    'typography.scale': value =>
      typeof value === 'number' && value >= 0.5 && value <= 2.0,
  },

  audio: {
    volume: value => typeof value === 'number' && value >= 0 && value <= 1,
    'sounds.*.volume': value =>
      typeof value === 'number' && value >= 0 && value <= 1,
  },

  haptics: {
    intensity: value => ['light', 'medium', 'heavy'].includes(value),
    'feedback.*.type': value => ['light', 'medium', 'heavy'].includes(value),
  },
};

/**
 * CONFIGURACIONES PREDEFINIDAS
 * Perfiles de configuración para diferentes tipos de usuario
 */
export const PRESET_CONFIGS = {
  // Configuración por defecto (actual)
  default: DEFAULT_CONFIG,

  // Configuración para usuarios con autismo/dificultades cognitivas
  autism_friendly: {
    ...DEFAULT_CONFIG,
    ui: {
      ...DEFAULT_CONFIG.ui,
      animations: {
        ...DEFAULT_CONFIG.ui.animations,
        enabled: false,
        reducedMotion: true,
      },
      timer: {
        ...DEFAULT_CONFIG.ui.timer,
        glowEffect: false,
        confirmReset: true,
      },
    },
    audio: {
      ...DEFAULT_CONFIG.audio,
      volume: 0.5,
      sounds: {
        ...DEFAULT_CONFIG.audio.sounds,
        buttonPress: {
          ...DEFAULT_CONFIG.audio.sounds.buttonPress,
          enabled: false,
        },
      },
    },
    haptics: {
      ...DEFAULT_CONFIG.haptics,
      intensity: 'light',
      feedback: {
        ...DEFAULT_CONFIG.haptics.feedback,
        navigation: {
          ...DEFAULT_CONFIG.haptics.feedback.navigation,
          enabled: false,
        },
      },
    },
    accessibility: {
      ...DEFAULT_CONFIG.accessibility,
      reduceAnimations: true,
      simplifiedUI: true,
      extendedTimeouts: true,
      confirmActions: true,
    },
  },

  // Configuración silenciosa
  silent: {
    ...DEFAULT_CONFIG,
    audio: {
      ...DEFAULT_CONFIG.audio,
      enabled: false,
    },
    haptics: {
      ...DEFAULT_CONFIG.haptics,
      enabled: false,
    },
  },

  // Configuración de alto rendimiento
  performance: {
    ...DEFAULT_CONFIG,
    ui: {
      ...DEFAULT_CONFIG.ui,
      animations: {
        ...DEFAULT_CONFIG.ui.animations,
        duration: 150,
      },
    },
    performance: {
      ...DEFAULT_CONFIG.performance,
      autoOptimize: true,
      batteryOptimization: true,
      memoryOptimization: true,
    },
  },
};

export default DEFAULT_CONFIG;

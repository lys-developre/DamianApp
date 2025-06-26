/**
 * Utilidades para manejo de datos y logging
 *
 * Sistema centralizado de registro de eventos y análisis de datos
 * diseñado para cumplir con mejores prácticas de React Native y
 * estándares de calidad profesional.
 *
 * Características:
 * - Logging estructurado para análisis
 * - Validación de tipos TypeScript-ready
 * - Manejo de errores robusto
 * - Configuración de ambiente flexible
 * - Compatibilidad con sistemas de analytics
 *
 * @author Damian Team
 * @version 4.0.0
 */

/**
 * Configuración del sistema de logging
 */
const LOGGING_CONFIG = {
  enabled: __DEV__, // Solo en desarrollo por defecto
  level: 'info', // 'debug', 'info', 'warn', 'error'
  persistence: false, // TODO: Implementar persistencia local
  analytics: false, // TODO: Integrar con servicio de analytics
};

/**
 * Tipos de eventos del sistema
 */
export const EVENT_TYPES = {
  // Eventos de comunicación
  COMMUNICATION: {
    PHRASE_SELECTED: 'communication.phrase_selected',
    MESSAGE_SENT: 'communication.message_sent',
    NEW_PHRASE_ADDED: 'communication.new_phrase_added',
  },

  // Eventos emocionales
  EMOTIONAL: {
    EMOTION_SELECTED: 'emotional.emotion_selected',
    STRATEGY_INITIATED: 'emotional.strategy_initiated',
    REGULATION_COMPLETED: 'emotional.regulation_completed',
    CRISIS_AVOIDED: 'emotional.crisis_avoided',
  },

  // Eventos alimentarios
  FOOD: {
    FOOD_INTERACTION: 'food.interaction',
    NEW_FOOD_TRIED: 'food.new_food_tried',
    GOAL_COMPLETED: 'food.goal_completed',
    PREFERENCE_UPDATED: 'food.preference_updated',
  },

  // Eventos de rutinas
  SCHEDULE: {
    ACTIVITY_STARTED: 'schedule.activity_started',
    ACTIVITY_COMPLETED: 'schedule.activity_completed',
    ROUTINE_UPDATED: 'schedule.routine_updated',
  },

  // Eventos de sistema
  SYSTEM: {
    SESSION_STARTED: 'system.session_started',
    SESSION_ENDED: 'system.session_ended',
    ERROR_OCCURRED: 'system.error_occurred',
    CONFIG_CHANGED: 'system.config_changed',
  },
};

/**
 * Estructura base para eventos del sistema
 */
class BaseEvent {
  constructor(type, data = {}) {
    this.id = this.generateId();
    this.type = type;
    this.timestamp = new Date().toISOString();
    this.sessionId = this.getSessionId();
    this.userId = 'damian'; // TODO: Implementar sistema de usuarios
    this.data = data;
    this.metadata = {
      platform: 'react-native',
      version: '4.0.0',
      environment: __DEV__ ? 'development' : 'production',
    };
  }

  generateId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    // TODO: Implementar gestión de sesiones
    return `session_${Date.now()}`;
  }
}

/**
 * Logger principal del sistema
 */
class Logger {
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.events = [];
    this.listeners = [];
    Logger.instance = this;
  }

  /**
   * Registra un evento en el sistema
   */
  logEvent(type, data = {}) {
    if (!LOGGING_CONFIG.enabled) return;

    try {
      const event = new BaseEvent(type, data);
      this.events.push(event);

      // Notificar a listeners registrados
      this.notifyListeners(event);

      // Log condicional para desarrollo
      if (__DEV__ && LOGGING_CONFIG.level === 'debug') {
        this.debugLog(event);
      }

      // TODO: Persistir eventos localmente
      // TODO: Enviar a servicio de analytics si está configurado

      return event.id;
    } catch (error) {
      this.handleLoggingError(error);
    }
  }

  /**
   * Log de depuración para desarrollo
   */
  debugLog(event) {
    if (!__DEV__) return;

    // TODO: Implementar logger visual para desarrollo
    // En producción, esto se reemplazaría por un sistema de logging robusto

    // Logging estructurado para desarrollo
    // En el futuro, aquí se podría usar un servicio de logging específico
    // const logData = {
    //   event: event.type,
    //   id: event.id,
    //   timestamp: new Date(event.timestamp).toLocaleTimeString(),
    //   data: event.data,
    //   metadata: event.metadata,
    // };
    // logToDevService(logData);
  }

  /**
   * Maneja errores del sistema de logging
   */
  handleLoggingError(_error) {
    // TODO: Implementar sistema robusto de logging de errores
    // En producción, esto se enviaría a un servicio de monitoreo
    // crashlyticsLog('logging_error', { error: _error.message });
  }

  /**
   * Registra un listener para eventos
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifica a todos los listeners
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.handleLoggingError(error);
      }
    });
  }

  /**
   * Obtiene eventos filtrados
   */
  getEvents(filter = {}) {
    let filteredEvents = [...this.events];

    if (filter.type) {
      filteredEvents = filteredEvents.filter(event =>
        event.type.startsWith(filter.type)
      );
    }

    if (filter.startDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.timestamp) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.timestamp) <= new Date(filter.endDate)
      );
    }

    return filteredEvents;
  }

  /**
   * Genera estadísticas básicas
   */
  getStats(timeframe = '24h') {
    const now = new Date();
    const timeframeMs = this.parseTimeframe(timeframe);
    const startTime = new Date(now.getTime() - timeframeMs);

    const recentEvents = this.events.filter(
      event => new Date(event.timestamp) >= startTime
    );

    const stats = {
      totalEvents: recentEvents.length,
      byType: {},
      timeframe,
      generatedAt: now.toISOString(),
    };

    // Contar eventos por tipo
    recentEvents.forEach(event => {
      const category = event.type.split('.')[0];
      stats.byType[category] = (stats.byType[category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Convierte timeframe string a milisegundos
   */
  parseTimeframe(timeframe) {
    const units = {
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
    };

    const match = timeframe.match(/^(\d+)([hdw])$/);
    if (!match) return 24 * 60 * 60 * 1000; // Default 24h

    const [, amount, unit] = match;
    return parseInt(amount) * units[unit];
  }

  /**
   * Exporta eventos en formato JSON
   */
  exportEvents(format = 'json') {
    const exportData = {
      events: this.events,
      stats: this.getStats(),
      exportedAt: new Date().toISOString(),
      version: '4.0.0',
    };

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        return this.convertToCSV(exportData.events);
      default:
        return exportData;
    }
  }

  /**
   * Convierte eventos a formato CSV
   */
  convertToCSV(events) {
    if (events.length === 0) return '';

    const headers = ['id', 'type', 'timestamp', 'userId', 'data'];
    const csvRows = [headers.join(',')];

    events.forEach(event => {
      const row = [
        event.id,
        event.type,
        event.timestamp,
        event.userId,
        JSON.stringify(event.data).replace(/"/g, '""'), // Escape quotes
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}

// Instancia singleton del logger
const logger = new Logger();

/**
 * Funciones de conveniencia para logging específico
 */

/**
 * Registra eventos de comunicación
 */
export const logCommunicationEvent = (subtype, data) => {
  return logger.logEvent(`communication.${subtype}`, data);
};

/**
 * Registra eventos emocionales
 */
export const logEmotionalEvent = (subtype, data) => {
  return logger.logEvent(`emotional.${subtype}`, data);
};

/**
 * Registra eventos alimentarios
 */
export const logFoodEvent = (subtype, data) => {
  return logger.logEvent(`food.${subtype}`, data);
};

/**
 * Registra eventos de rutinas
 */
export const logScheduleEvent = (subtype, data) => {
  return logger.logEvent(`schedule.${subtype}`, data);
};

/**
 * Registra eventos del sistema
 */
export const logSystemEvent = (subtype, data) => {
  return logger.logEvent(`system.${subtype}`, data);
};

/**
 * Exporta el logger para uso avanzado
 */
export { logger };

/**
 * Configuración del logger
 */
export const configureLogger = config => {
  Object.assign(LOGGING_CONFIG, config);
};

/**
 * Hook personalizado para analytics en componentes React
 */
export const useAnalytics = () => {
  return {
    trackEvent: logger.logEvent.bind(logger),
    trackCommunication: logCommunicationEvent,
    trackEmotional: logEmotionalEvent,
    trackFood: logFoodEvent,
    trackSchedule: logScheduleEvent,
    trackSystem: logSystemEvent,
    getStats: logger.getStats.bind(logger),
    exportData: logger.exportEvents.bind(logger),
  };
};

/**
 * Validadores de datos para garantizar calidad
 */
export const validators = {
  /**
   * Valida estructura de evento de comunicación
   */
  validateCommunicationEvent(data) {
    const required = ['phrase', 'recipient'];
    return this.validateRequired(data, required);
  },

  /**
   * Valida estructura de evento emocional
   */
  validateEmotionalEvent(data) {
    const required = ['emotion', 'strategy'];
    return this.validateRequired(data, required);
  },

  /**
   * Valida estructura de evento alimentario
   */
  validateFoodEvent(data) {
    const required = ['food', 'action'];
    return this.validateRequired(data, required);
  },

  /**
   * Validador genérico de campos requeridos
   */
  validateRequired(data, required) {
    const missing = required.filter(field => !data[field]);
    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  },
};

export default logger;

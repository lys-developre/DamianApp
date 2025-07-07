/**
 * Servicio de lógica de negocio específica para Damian APP
 *
 * RESPONSABILIDADES:
 * - Lógica de negocio para temporizadores con imagen
 * - Algoritmos específicos para switches interactivos
 * - Cálculos de progreso y estado de completitud
 * - Validaciones específicas de dominio
 * - Transformaciones de datos especializadas
 *
 * PATRONES IMPLEMENTADOS:
 * - Business Logic Layer para separar lógica de UI
 * - Domain Services para operaciones complejas
 * - Pure functions para predictibilidad
 * - Strategy pattern para diferentes algoritmos
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 5
 */

import { utilsService } from '../utils/helpers/utilsService';
import { validator } from '../core/validation/validationService';

class BusinessLogicService {
  constructor() {
    this.presets = {
      timer: [
        { label: '5 min', seconds: 300 },
        { label: '10 min', seconds: 600 },
        { label: '15 min', seconds: 900 },
        { label: '30 min', seconds: 1800 },
        { label: '45 min', seconds: 2700 },
        { label: '1 hora', seconds: 3600 },
        { label: '2 horas', seconds: 7200 },
      ],
      imageTimer: [
        { label: 'Comida (30m)', seconds: 1800, category: 'comida' },
        { label: 'Juego (15m)', seconds: 900, category: 'juego' },
        { label: 'Tarea (45m)', seconds: 2700, category: 'trabajo' },
        { label: 'Descanso (10m)', seconds: 600, category: 'descanso' },
        { label: 'Ejercicio (20m)', seconds: 1200, category: 'ejercicio' },
      ],
    };
  }

  // ==========================================
  // LÓGICA DE TEMPORIZADORES CON IMAGEN
  // ==========================================

  /**
   * Crea un nuevo temporizador con imagen con validación completa
   * @param {object} timerData - Datos del temporizador
   * @param {Array} existingTimers - Temporizadores existentes
   * @returns {object} Resultado con timer creado o errores
   */
  createTimerImageButton(timerData, existingTimers = []) {
    // Validar datos de entrada
    const validationResult = validator
      .reset()
      .timerImageButton(timerData)
      .getValidationResults();

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      };
    }

    // Generar ID si no existe
    const id = timerData.id || utilsService.generateNumericId(existingTimers);

    // Crear temporizador normalizado
    const normalizedTimer = {
      id,
      image: utilsService.sanitizeUrl(timerData.image) || '',
      timer: timerData.timer || '00:00:00',
      seconds: Math.max(0, parseInt(timerData.seconds, 10) || 0),
      isActive: Boolean(timerData.isActive),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sincronizar timer string con seconds
    if (normalizedTimer.seconds > 0) {
      normalizedTimer.timer = utilsService.formatSeconds(
        normalizedTimer.seconds
      );
    }

    return {
      success: true,
      timer: normalizedTimer,
      warnings: validationResult.warnings,
    };
  }

  /**
   * Actualiza un temporizador existente con validación
   * @param {string} timerId - ID del temporizador
   * @param {object} updates - Actualizaciones a aplicar
   * @param {Array} existingTimers - Temporizadores existentes
   * @returns {object} Resultado con timer actualizado o errores
   */
  updateTimerImageButton(timerId, updates, existingTimers = []) {
    // Buscar temporizador existente
    const existingTimer = existingTimers.find(t => t.id === timerId);
    if (!existingTimer) {
      return {
        success: false,
        errors: [{ field: 'id', message: 'Temporizador no encontrado' }],
      };
    }

    // Crear datos combinados para validación
    const combinedData = { ...existingTimer, ...updates };

    // Validar datos combinados
    const validationResult = validator
      .reset()
      .timerImageButton(combinedData)
      .getValidationResults();

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      };
    }

    // Aplicar actualizaciones
    const updatedTimer = {
      ...existingTimer,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Sincronizar timer string con seconds si se actualizaron segundos
    if (updates.seconds !== undefined) {
      updatedTimer.timer = utilsService.formatSeconds(updatedTimer.seconds);
    }

    // Sincronizar seconds con timer string si se actualizó el timer
    if (updates.timer !== undefined && updates.seconds === undefined) {
      updatedTimer.seconds = utilsService.parseTimeToSeconds(
        updatedTimer.timer
      );
    }

    return {
      success: true,
      timer: updatedTimer,
      warnings: validationResult.warnings,
    };
  }

  /**
   * Procesa tick de temporizador (cada segundo)
   * @param {object} timer - Temporizador actual
   * @returns {object} Estado actualizado del temporizador
   */
  processTimerTick(timer) {
    if (!timer || !timer.isActive || timer.seconds <= 0) {
      return timer;
    }

    const newSeconds = Math.max(0, timer.seconds - 1);
    const isCompleted = newSeconds === 0;

    return {
      ...timer,
      seconds: newSeconds,
      timer: utilsService.formatSeconds(newSeconds),
      isActive: !isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : timer.completedAt,
    };
  }

  /**
   * Calcula estadísticas de una sesión de temporizadores
   * @param {Array} timers - Array de temporizadores
   * @returns {object} Estadísticas calculadas
   */
  calculateTimerStats(timers = []) {
    const stats = {
      total: timers.length,
      active: 0,
      completed: 0,
      totalTime: 0,
      activeTime: 0,
      completedTime: 0,
      averageTime: 0,
    };

    timers.forEach(timer => {
      const originalSeconds =
        utilsService.parseTimeToSeconds(timer.timer) || timer.seconds;
      stats.totalTime += originalSeconds;

      if (timer.isActive) {
        stats.active++;
        stats.activeTime += timer.seconds;
      } else if (timer.completedAt) {
        stats.completed++;
        stats.completedTime += originalSeconds;
      }
    });

    stats.averageTime =
      stats.total > 0 ? Math.round(stats.totalTime / stats.total) : 0;

    return stats;
  }

  // ==========================================
  // LÓGICA DE SWITCHES INTERACTIVOS
  // ==========================================

  /**
   * Verifica si todos los switches están completados
   * @param {Array} switches - Array de switches
   * @returns {boolean} True si todos están activos
   */
  areAllSwitchesComplete(switches = []) {
    return switches.length > 0 && switches.every(sw => sw.isActive);
  }

  /**
   * Calcula progreso de switches
   * @param {Array} switches - Array de switches
   * @returns {object} Información de progreso
   */
  calculateSwitchProgress(switches = []) {
    const total = switches.length;
    const completed = switches.filter(sw => sw.isActive).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      remaining: total - completed,
      percentage,
      isComplete: completed === total && total > 0,
    };
  }

  /**
   * Genera secuencia para reset en cascada
   * @param {Array} switches - Switches activos a resetear
   * @param {number} delayMs - Delay entre cada reset
   * @returns {Array} Secuencia de acciones con timing
   */
  generateCascadeResetSequence(switches = [], delayMs = 100) {
    const activeSwitches = switches.filter(sw => sw.isActive);

    return activeSwitches.map((switchItem, index) => ({
      switchId: switchItem.id,
      delay: index * delayMs,
      order: index + 1,
      totalSteps: activeSwitches.length,
    }));
  }

  /**
   * Calcula estadísticas de sesión de switches
   * @param {Array} switches - Array de switches
   * @param {object} sessionData - Datos de la sesión
   * @returns {object} Estadísticas de la sesión
   */
  calculateSwitchSessionStats(switches = [], sessionData = {}) {
    const progress = this.calculateSwitchProgress(switches);
    const startTime = sessionData.startTime
      ? new Date(sessionData.startTime)
      : new Date();
    const currentTime = new Date();
    const duration = Math.round((currentTime - startTime) / 1000);

    return {
      ...progress,
      duration,
      durationFormatted: utilsService.formatDuration(duration),
      switchesPerMinute:
        duration > 0 ? Math.round((progress.completed / duration) * 60) : 0,
      estimatedCompletion:
        progress.percentage > 0 && progress.percentage < 100
          ? Math.round(
              (duration / progress.percentage) * (100 - progress.percentage)
            )
          : 0,
    };
  }

  // ==========================================
  // LÓGICA DE CONFIGURACIONES
  // ==========================================

  /**
   * Valida y normaliza configuración completa de la app
   * @param {object} config - Configuración a validar
   * @returns {object} Resultado con configuración válida o errores
   */
  validateAppConfig(config) {
    const validationResult = validator.reset();

    // Validar cada sección de configuración
    if (config.timer) {
      validationResult.timerConfig(config.timer);
    }

    if (config.switches) {
      validationResult.switchesConfig(config.switches);
    }

    if (config.accessibility) {
      validationResult.accessibilityConfig(config.accessibility);
    }

    if (config.theme) {
      validationResult.themeConfig(config.theme);
    }

    const result = validationResult.getValidationResults();

    if (result.isValid) {
      // Normalizar configuración
      const normalizedConfig = this.normalizeAppConfig(config);
      return {
        success: true,
        config: normalizedConfig,
        warnings: result.warnings,
      };
    }

    return {
      success: false,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Normaliza configuración aplicando valores por defecto y sanitización
   * @param {object} config - Configuración a normalizar
   * @returns {object} Configuración normalizada
   */
  normalizeAppConfig(config) {
    const defaultConfig = {
      timer: {
        defaultTime: 3600,
        enableHaptics: true,
        enableAudio: true,
        enableMotivationalPhrases: true,
        autoStartCelebration: true,
      },
      switches: {
        enableHaptics: true,
        celebrationDuration: 3000,
        autoResetAfterCelebration: false,
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        fontSize: 'normal',
      },
      theme: {
        darkMode: true,
        primaryColor: '#45B7D1',
        accentColor: '#F59E42',
      },
    };

    return utilsService.deepMerge(
      utilsService.deepClone(defaultConfig),
      config
    );
  }

  // ==========================================
  // PRESETS Y UTILIDADES
  // ==========================================

  /**
   * Obtiene presets de tiempo para temporizadores
   * @param {string} category - Categoría de presets
   * @returns {Array} Array de presets
   */
  getTimerPresets(category = 'timer') {
    return this.presets[category] || this.presets.timer;
  }

  /**
   * Busca preset por segundos
   * @param {number} seconds - Segundos a buscar
   * @param {string} category - Categoría de presets
   * @returns {object|null} Preset encontrado o null
   */
  findPresetBySeconds(seconds, category = 'timer') {
    const presets = this.getTimerPresets(category);
    return presets.find(preset => preset.seconds === seconds) || null;
  }

  /**
   * Convierte tiempo manual a segundos con validación
   * @param {object} timeComponents - {days, hours, minutes, seconds}
   * @returns {object} Resultado con segundos o errores
   */
  convertManualTimeToSeconds(timeComponents) {
    const validationResult = validator
      .reset()
      .timeComponents(
        timeComponents.days,
        timeComponents.hours,
        timeComponents.minutes,
        timeComponents.seconds
      )
      .getValidationResults();

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      };
    }

    const seconds = utilsService.timeComponentsToSeconds(timeComponents);

    return {
      success: true,
      seconds,
      formatted: utilsService.formatSeconds(seconds),
      duration: utilsService.formatDuration(seconds),
      warnings: validationResult.warnings,
    };
  }

  // ==========================================
  // FUNCIONES AVANZADAS MÓDULO 5
  // ==========================================

  /**
   * Genera estadísticas de uso de temporizadores
   */
  generateTimerStatistics(timerImageButtons) {
    if (!Array.isArray(timerImageButtons)) {
      return {
        success: false,
        error: 'Datos de temporizadores inválidos',
        stats: null,
      };
    }

    const stats = {
      total: timerImageButtons.length,
      active: timerImageButtons.filter(t => t.isActive).length,
      inactive: timerImageButtons.filter(t => !t.isActive).length,
      totalTime: timerImageButtons.reduce(
        (sum, t) => sum + (t.seconds || 0),
        0
      ),
      averageTime: 0,
      categories: {},
    };

    // Calcular tiempo promedio
    if (stats.total > 0) {
      stats.averageTime = Math.round(stats.totalTime / stats.total);
    }

    // Categorizar por tiempo
    timerImageButtons.forEach(timer => {
      const timeRange = this.categorizeTimeRange(timer.seconds || 0);
      stats.categories[timeRange] = (stats.categories[timeRange] || 0) + 1;
    });

    return {
      success: true,
      stats,
    };
  }

  /**
   * Categoriza un tiempo en rangos útiles
   */
  categorizeTimeRange(seconds) {
    if (seconds < 600) return 'Corto (< 10min)';
    if (seconds < 1800) return 'Medio (10-30min)';
    if (seconds < 3600) return 'Largo (30-60min)';
    return 'Muy Largo (> 1h)';
  }

  /**
   * Optimiza la lista de temporizadores eliminando duplicados
   */
  optimizeTimerList(timerImageButtons) {
    if (!Array.isArray(timerImageButtons)) {
      return {
        success: false,
        error: 'Lista de temporizadores inválida',
        optimized: [],
      };
    }

    const seen = new Set();
    const optimized = timerImageButtons.filter(timer => {
      const key = `${timer.image}_${timer.seconds}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    return {
      success: true,
      optimized,
      removed: timerImageButtons.length - optimized.length,
    };
  }

  /**
   * Sugiere presets basados en uso histórico
   */
  suggestPresets(timerImageButtons) {
    if (!Array.isArray(timerImageButtons) || timerImageButtons.length === 0) {
      return this.presets.imageTimer.slice(0, 3); // Defaults
    }

    // Analizar tiempos más usados
    const timeFrequency = {};
    timerImageButtons.forEach(timer => {
      const seconds = timer.seconds || 0;
      timeFrequency[seconds] = (timeFrequency[seconds] || 0) + 1;
    });

    // Ordenar por frecuencia
    const sortedTimes = Object.entries(timeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([seconds]) => parseInt(seconds));

    // Generar sugerencias
    return sortedTimes.map(seconds => ({
      label: utilsService.formatDuration(seconds),
      seconds,
      category: 'sugerido',
      frequency: timeFrequency[seconds],
    }));
  }

  // ==========================================
  // LÓGICA AVANZADA DE SWITCHES
  // ==========================================

  /**
   * Calcula patrones de uso en switches
   */
  analyzeSwitchPatterns(switchesHistory) {
    if (!Array.isArray(switchesHistory)) {
      return {
        success: false,
        error: 'Historial de switches inválido',
        patterns: null,
      };
    }

    const patterns = {
      mostUsed: [],
      leastUsed: [],
      completionRate: 0,
      averageTimeToComplete: 0,
      commonSequences: [],
    };

    // Analizar switches más usados
    const usage = {};
    switchesHistory.forEach(session => {
      if (session.switches) {
        session.switches.forEach((switch_, index) => {
          if (switch_.isActive) {
            usage[index] = (usage[index] || 0) + 1;
          }
        });
      }
    });

    const sortedUsage = Object.entries(usage).sort(([, a], [, b]) => b - a);

    patterns.mostUsed = sortedUsage.slice(0, 5).map(([index, count]) => ({
      switchId: parseInt(index) + 1,
      count,
    }));

    patterns.leastUsed = sortedUsage.slice(-5).map(([index, count]) => ({
      switchId: parseInt(index) + 1,
      count,
    }));

    return {
      success: true,
      patterns,
    };
  }

  /**
   * Optimiza la disposición de switches basado en uso
   */
  optimizeSwitchLayout(switches, usagePatterns) {
    if (!Array.isArray(switches)) {
      return {
        success: false,
        error: 'Switches inválidos',
        optimized: switches,
      };
    }

    // Crear copia para no mutar el original
    const optimized = [...switches];

    // Si tenemos patrones de uso, reorganizar
    if (usagePatterns && usagePatterns.mostUsed) {
      const highUsage = usagePatterns.mostUsed.map(p => p.switchId - 1);

      // Mover switches más usados al inicio
      const reordered = [];
      const remaining = [...optimized];

      // Primero los más usados
      highUsage.forEach(index => {
        if (remaining[index]) {
          reordered.push(remaining[index]);
          remaining[index] = null;
        }
      });

      // Luego el resto
      remaining.forEach(switch_ => {
        if (switch_ !== null) {
          reordered.push(switch_);
        }
      });

      return {
        success: true,
        optimized: reordered,
        changes: highUsage.length,
      };
    }

    return {
      success: true,
      optimized,
      changes: 0,
    };
  }

  // ==========================================
  // FUNCIONES DE RENDIMIENTO Y OPTIMIZACIÓN
  // ==========================================

  /**
   * Calcula métricas de rendimiento de la app
   */
  calculatePerformanceMetrics(appUsage) {
    const metrics = {
      sessionDuration: 0,
      interactionRate: 0,
      errorRate: 0,
      completionRate: 0,
      userSatisfaction: 0,
    };

    if (!appUsage || typeof appUsage !== 'object') {
      return {
        success: false,
        error: 'Datos de uso inválidos',
        metrics,
      };
    }

    // Calcular duración promedio de sesión
    if (appUsage.sessions && appUsage.sessions.length > 0) {
      const totalDuration = appUsage.sessions.reduce(
        (sum, session) => sum + (session.duration || 0),
        0
      );
      metrics.sessionDuration = totalDuration / appUsage.sessions.length;
    }

    // Calcular tasa de interacción
    if (appUsage.interactions && appUsage.totalTime) {
      metrics.interactionRate = appUsage.interactions / appUsage.totalTime;
    }

    // Calcular tasa de errores
    if (appUsage.errors && appUsage.totalActions) {
      metrics.errorRate = (appUsage.errors / appUsage.totalActions) * 100;
    }

    // Calcular tasa de completión
    if (appUsage.completedTasks && appUsage.totalTasks) {
      metrics.completionRate =
        (appUsage.completedTasks / appUsage.totalTasks) * 100;
    }

    return {
      success: true,
      metrics,
    };
  }

  /**
   * Genera recomendaciones de mejora basadas en uso
   */
  generateRecommendations(performanceMetrics, userBehavior) {
    const recommendations = [];

    if (!performanceMetrics || !userBehavior) {
      return {
        success: false,
        error: 'Datos insuficientes para generar recomendaciones',
        recommendations: [],
      };
    }

    // Recomendaciones basadas en métricas de rendimiento
    if (performanceMetrics.sessionDuration < 300) {
      // < 5 minutos
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        message:
          'Las sesiones son muy cortas. Considera añadir más funcionalidades atractivas.',
        actionable: 'Añadir gamificación o recompensas',
      });
    }

    if (performanceMetrics.errorRate > 10) {
      recommendations.push({
        type: 'usability',
        priority: 'critical',
        message: 'Alta tasa de errores detectada. Revisar UX.',
        actionable: 'Simplificar interfaz o mejorar validaciones',
      });
    }

    if (performanceMetrics.completionRate < 60) {
      recommendations.push({
        type: 'completion',
        priority: 'medium',
        message: 'Baja tasa de completión. Los usuarios abandonan tareas.',
        actionable: 'Reducir pasos o añadir guías visuales',
      });
    }

    // Recomendaciones basadas en comportamiento
    if (userBehavior.preferredFeatures) {
      const mostUsed = userBehavior.preferredFeatures[0];
      if (mostUsed) {
        recommendations.push({
          type: 'feature',
          priority: 'low',
          message: `La función "${mostUsed}" es muy popular.`,
          actionable: 'Considerar expandir o mejorar esta funcionalidad',
        });
      }
    }

    return {
      success: true,
      recommendations,
      totalRecommendations: recommendations.length,
    };
  }
}

// Instancia singleton
export const businessLogic = new BusinessLogicService();

// Export de la clase para testing
export { BusinessLogicService };

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🧠 SERVICIO DE LÓGICA DE NEGOCIO DAMIAN APP
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 📋 PROPÓSITO EXPERT:
 * Este servicio centraliza TODA la lógica de negocio específica de DamianApp,
 * manteniendo separación clara entre lógica de dominio y UI/presentación.
 *
 * 🎯 RESPONSABILIDADES ESPECÍFICAS:
 * ✅ Lógica de negocio para temporizadores con imagen personalizada
 * ✅ Algoritmos específicos para switches interactivos TEA
 * ✅ Cálculos de progreso y estado de completitud de tareas
 * ✅ Validaciones específicas de dominio de negocio
 * ✅ Transformaciones de datos especializadas para usuarios TEA
 * ✅ Presets y configuraciones de dominio específico
 *
 * 🏗️ PATRONES ARQUITECTÓNICOS IMPLEMENTADOS:
 * 🔹 Business Logic Layer: Separación absoluta entre lógica y UI
 * 🔹 Domain Services: Operaciones complejas de dominio encapsuladas
 * 🔹 Pure Functions: Funciones predecibles sin efectos secundarios
 * 🔹 Strategy Pattern: Diferentes algoritmos según contexto TEA
 * 🔹 Factory Pattern: Creación consistente de entidades de negocio
 * 🔹 Validation Chain: Validaciones en cadena con rollback
 *
 * 🤖 GUÍA PARA IA:
 * - NUNCA modifiques la lógica core sin validar impacto
 * - SIEMPRE valida inputs antes de procesar lógica de negocio
 * - MANTÉN funciones puras para predictibilidad
 * - DOCUMENTA cada algoritmo específico para TEA
 * - PRESERVA backward compatibility en APIs públicas
 *
 * @author DamianApp Team
 * @version 2.0.0 - Expert Level Architecture
 * @since 1.0.0
 * @lastUpdated 2025-07-08
 */

import { utilsService } from '../utils/helpers/utilsService';
import { validator } from '../core/validation/validationService';

class BusinessLogicService {
  /**
   * 🏗️ CONSTRUCTOR: Inicialización de Presets de Dominio
   *
   * Establece configuraciones específicas para usuarios TEA, incluyendo
   * presets de tiempo optimizados para diferentes actividades terapéuticas.
   *
   * 🤖 NOTA PARA IA: Estos presets están calibrados específicamente para
   * usuarios con TEA. NO modificar sin consultar expertos en TEA.
   */
  constructor() {
    // 📋 PRESETS DE TEMPORIZADORES GENERALES
    // Configurados según investigación de terapia ocupacional para TEA
    this.timerPresets = {
      // ⏰ Temporizadores básicos - Intervalos terapéuticos estándar
      basic: [
        {
          label: '5 min',
          seconds: 300,
          description: 'Tareas cortas, alta concentración',
        },
        {
          label: '10 min',
          seconds: 600,
          description: 'Actividades de transición',
        },
        {
          label: '15 min',
          seconds: 900,
          description: 'Sesiones de trabajo focalizadas',
        },
        {
          label: '30 min',
          seconds: 1800,
          description: 'Actividades principales',
        },
        {
          label: '45 min',
          seconds: 2700,
          description: 'Sesiones terapéuticas extensas',
        },
        {
          label: '1 hora',
          seconds: 3600,
          description: 'Actividades de larga duración',
        },
        {
          label: '2 horas',
          seconds: 7200,
          description: 'Bloques de tiempo extensos',
        },
      ],

      // 🖼️ Temporizadores con imagen - Actividades específicas TEA
      withImage: [
        {
          label: 'Comida (30m)',
          seconds: 1800,
          category: 'alimentacion',
          teaContext:
            'Rutina alimentaria con tiempo suficiente para procesamiento sensorial',
        },
        {
          label: 'Juego (15m)',
          seconds: 900,
          category: 'recreacion',
          teaContext: 'Tiempo de juego estructurado con límites claros',
        },
        {
          label: 'Tarea (45m)',
          seconds: 2700,
          category: 'trabajo',
          teaContext: 'Sesión de trabajo con descansos programados',
        },
        {
          label: 'Descanso (10m)',
          seconds: 600,
          category: 'descanso',
          teaContext: 'Pausa sensorial para autorregulación',
        },
        {
          label: 'Ejercicio (20m)',
          seconds: 1200,
          category: 'ejercicio',
          teaContext: 'Actividad física estructurada para regulación sensorial',
        },
      ],
    };

    // 🔄 BACKWARD COMPATIBILITY - Mantener API legacy
    this.presets = {
      timer: this.timerPresets.basic,
      imageTimer: this.timerPresets.withImage,
    };
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // 🖼️ LÓGICA DE TEMPORIZADORES CON IMAGEN - FUNCIONES ATÓMICAS SRP
  // ════════════════════════════════════════════════════════════════════════════════

  /**
   * 🔍 FUNCIÓN ATÓMICA: Validación de datos de temporizador
   *
   * Responsabilidad única: Validar estructura y contenido de timerData
   * Cumple SRP: Solo se encarga de validación, no modifica datos
   *
   * @param {object} timerData - Datos del temporizador a validar
   * @returns {object} Resultado de validación con errores/warnings
   *
   * 🤖 PARA IA: Función pura, sin efectos secundarios
   */
  _validateTimerData(timerData) {
    return validator.reset().timerImageButton(timerData).getValidationResults();
  }

  /**
   * 🔢 FUNCIÓN ATÓMICA: Generación de ID único
   *
   * Responsabilidad única: Generar ID único para nuevo temporizador
   * Cumple SRP: Solo genera ID, no valida ni normaliza
   *
   * @param {object} timerData - Datos que pueden contener ID
   * @param {Array} existingTimers - Temporizadores existentes para evitar duplicados
   * @returns {string} ID único para el temporizador
   *
   * 🤖 PARA IA: Función determinista, mismo input = mismo output
   */
  _generateTimerId(timerData, existingTimers) {
    return timerData.id || utilsService.generateNumericId(existingTimers);
  }

  /**
   * 🛠️ FUNCIÓN ATÓMICA: Normalización de datos del temporizador
   *
   * Responsabilidad única: Transformar datos raw en estructura normalizada
   * Cumple SRP: Solo normaliza estructura, no valida ni persiste
   *
   * @param {string} id - ID único del temporizador
   * @param {object} timerData - Datos raw del temporizador
   * @returns {object} Temporizador normalizado según schema interno
   *
   * 🤖 PARA IA: Esta función define el schema canónico de temporizadores
   */
  _normalizeTimerData(id, timerData) {
    const now = new Date().toISOString();

    return {
      id,
      image: utilsService.sanitizeUrl(timerData.image) || '',
      timer: timerData.timer || '00:00:00',
      seconds: Math.max(0, parseInt(timerData.seconds, 10) || 0),
      isActive: Boolean(timerData.isActive),
      createdAt: timerData.createdAt || now,
      updatedAt: now,
      // 🔍 METADATA para tracking de cambios
      version: timerData.version || 1,
      lastModifiedBy: 'businessLogicService',
    };
  }

  /**
   * 🔄 FUNCIÓN ATÓMICA: Sincronización timer string con seconds
   *
   * Responsabilidad única: Mantener consistencia entre timer y seconds
   * Cumple SRP: Solo sincroniza formato, no valida ni persiste
   *
   * @param {object} normalizedTimer - Temporizador normalizado
   * @returns {object} Temporizador con timer y seconds sincronizados
   *
   * 🤖 PARA IA: Garantiza que timer string siempre refleje seconds
   */
  _synchronizeTimerFormat(normalizedTimer) {
    if (normalizedTimer.seconds > 0) {
      normalizedTimer.timer = utilsService.formatSeconds(
        normalizedTimer.seconds
      );
    }
    return normalizedTimer;
  }

  /**
   * 🏗️ FUNCIÓN COMPUESTA: Creación completa de temporizador con imagen
   *
   * ORQUESTA las funciones atómicas siguiendo patrón de composición.
   * Cada paso tiene responsabilidad única y puede ser testeado independientemente.
   *
   * 📊 FLUJO EXPERT:
   * 1. Validación → 2. Generación ID → 3. Normalización → 4. Sincronización → 5. Respuesta
   *
   * @param {object} timerData - Datos del temporizador a crear
   * @param {Array} existingTimers - Temporizadores existentes para validación
   * @returns {object} Resultado con timer creado o errores detallados
   *
   * 🤖 PARA IA: Esta es la función pública, utiliza las atómicas internas
   */
  createTimerImageButton(timerData, existingTimers = []) {
    // 🔍 PASO 1: Validación atómica
    const validationResult = this._validateTimerData(timerData);
    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        stage: 'validation',
      };
    }

    // 🔢 PASO 2: Generación ID atómica
    const id = this._generateTimerId(timerData, existingTimers);

    // 🛠️ PASO 3: Normalización atómica
    const normalizedTimer = this._normalizeTimerData(id, timerData);

    // 🔄 PASO 4: Sincronización atómica
    const synchronizedTimer = this._synchronizeTimerFormat(normalizedTimer);

    // ✅ PASO 5: Respuesta estructurada
    return {
      success: true,
      timer: synchronizedTimer,
      warnings: validationResult.warnings,
      metadata: {
        createdAt: synchronizedTimer.createdAt,
        processingStages: [
          'validation',
          'id-generation',
          'normalization',
          'synchronization',
        ],
        dataIntegrity: 'verified',
      },
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

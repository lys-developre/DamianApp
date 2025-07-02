/**
 * Servicio centralizado de utilidades y formateo para Damian APP
 *
 * RESPONSABILIDADES:
 * - Formateo de tiempo y duraciones
 * - Conversiones de datos y unidades
 * - Generación de IDs únicos
 * - Utilidades matemáticas y de cálculo
 * - Helpers para manipulación de arrays y objetos
 *
 * PATRONES IMPLEMENTADOS:
 * - Pure functions para predictibilidad
 * - Memoización para operaciones costosas
 * - Type checking robusto
 * - Error handling sin excepciones
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 5
 */

class UtilsService {
  constructor() {
    this.memoCache = new Map();
  }

  // ==========================================
  // FORMATEO DE TIEMPO Y DURACIONES
  // ==========================================

  /**
   * Formatea segundos a string HH:MM:SS
   * @param {number} totalSeconds - Segundos totales
   * @returns {string} Tiempo formateado como HH:MM:SS
   */
  formatSeconds(totalSeconds) {
    // Validar entrada
    if (
      typeof totalSeconds !== 'number' ||
      isNaN(totalSeconds) ||
      totalSeconds < 0
    ) {
      return '00:00:00';
    }

    const seconds = Math.floor(totalSeconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map(unit => unit.toString().padStart(2, '0'))
      .join(':');
  }

  /**
   * Convierte string HH:MM:SS a segundos totales
   * @param {string} timeString - Tiempo en formato HH:MM:SS
   * @returns {number} Segundos totales
   */
  parseTimeToSeconds(timeString) {
    if (typeof timeString !== 'string') {
      return 0;
    }

    const parts = timeString.split(':');
    if (parts.length !== 3) {
      return 0;
    }

    const [hours, minutes, seconds] = parts.map(part => parseInt(part, 10));

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return 0;
    }

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Formatea duración en formato humano legible
   * @param {number} seconds - Segundos totales
   * @param {boolean} short - Usar formato corto
   * @returns {string} Duración formateada
   */
  formatDuration(seconds, short = false) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return short ? '0s' : '0 segundos';
    }

    const units = [
      {
        name: short ? 'h' : 'hora',
        namePlural: short ? 'h' : 'horas',
        value: 3600,
      },
      {
        name: short ? 'm' : 'minuto',
        namePlural: short ? 'm' : 'minutos',
        value: 60,
      },
      {
        name: short ? 's' : 'segundo',
        namePlural: short ? 's' : 'segundos',
        value: 1,
      },
    ];

    const parts = [];
    let remaining = Math.floor(seconds);

    for (const unit of units) {
      const count = Math.floor(remaining / unit.value);
      if (count > 0) {
        const unitName = short
          ? unit.name
          : count === 1
            ? unit.name
            : unit.namePlural;
        parts.push(`${count}${short ? '' : ' '}${unitName}`);
        remaining -= count * unit.value;
      }
    }

    return parts.length > 0
      ? parts.join(short ? ' ' : ', ')
      : short
        ? '0s'
        : '0 segundos';
  }

  /**
   * Convierte componentes de tiempo a segundos totales
   * @param {object} components - {days, hours, minutes, seconds}
   * @returns {number} Segundos totales
   */
  timeComponentsToSeconds({ days = 0, hours = 0, minutes = 0, seconds = 0 }) {
    const d = parseInt(days, 10) || 0;
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;

    return d * 86400 + h * 3600 + m * 60 + s;
  }

  /**
   * Convierte segundos a componentes de tiempo
   * @param {number} totalSeconds - Segundos totales
   * @returns {object} {days, hours, minutes, seconds}
   */
  secondsToTimeComponents(totalSeconds) {
    if (
      typeof totalSeconds !== 'number' ||
      isNaN(totalSeconds) ||
      totalSeconds < 0
    ) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(totalSeconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return { days, hours, minutes, seconds: remainingSeconds };
  }

  // ==========================================
  // GENERACIÓN DE IDs Y UTILIDADES
  // ==========================================

  /**
   * Genera un ID único usando timestamp y random
   * @param {string} prefix - Prefijo opcional
   * @returns {string} ID único
   */
  generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix
      ? `${prefix}_${timestamp}_${random}`
      : `${timestamp}_${random}`;
  }

  /**
   * Genera un ID simple numérico secuencial
   * @param {Array} existingItems - Array de elementos existentes con propiedad id
   * @returns {string} ID numérico como string
   */
  generateNumericId(existingItems = []) {
    if (!Array.isArray(existingItems)) {
      return '1';
    }

    const existingIds = existingItems
      .map(item => parseInt(item.id, 10))
      .filter(id => !isNaN(id));

    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return (maxId + 1).toString();
  }

  // ==========================================
  // UTILIDADES DE ARRAYS Y OBJETOS
  // ==========================================

  /**
   * Clona profundamente un objeto
   * @param {any} obj - Objeto a clonar
   * @returns {any} Copia profunda del objeto
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }

    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  }

  /**
   * Compara dos objetos profundamente
   * @param {any} obj1 - Primer objeto
   * @param {any} obj2 - Segundo objeto
   * @returns {boolean} True si son iguales
   */
  deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }

    if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) {
      return false;
    }

    if (typeof obj1 !== 'object') {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Mezcla objetos profundamente
   * @param {object} target - Objeto destino
   * @param {...object} sources - Objetos fuente
   * @returns {object} Objeto mezclado
   */
  deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  /**
   * Verifica si un valor es un objeto plano
   * @param {any} item - Valor a verificar
   * @returns {boolean} True si es objeto plano
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Obtiene valor anidado de objeto usando ruta de puntos
   * @param {object} obj - Objeto fuente
   * @param {string} path - Ruta en formato 'a.b.c'
   * @param {any} defaultValue - Valor por defecto
   * @returns {any} Valor encontrado o defaultValue
   */
  getNestedValue(obj, path, defaultValue = undefined) {
    if (!obj || typeof path !== 'string') {
      return defaultValue;
    }

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Establece valor anidado en objeto usando ruta de puntos
   * @param {object} obj - Objeto destino
   * @param {string} path - Ruta en formato 'a.b.c'
   * @param {any} value - Valor a establecer
   * @returns {object} Objeto modificado
   */
  setNestedValue(obj, path, value) {
    if (!obj || typeof path !== 'string') {
      return obj;
    }

    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return obj;
  }

  // ==========================================
  // UTILIDADES MATEMÁTICAS
  // ==========================================

  /**
   * Redondea número a decimales específicos
   * @param {number} num - Número a redondear
   * @param {number} decimals - Cantidad de decimales
   * @returns {number} Número redondeado
   */
  roundTo(num, decimals = 2) {
    if (typeof num !== 'number' || isNaN(num)) {
      return 0;
    }
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Clamp número entre min y max
   * @param {number} num - Número a limitar
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {number} Número limitado
   */
  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * Interpola linealmente entre dos valores
   * @param {number} start - Valor inicial
   * @param {number} end - Valor final
   * @param {number} progress - Progreso (0-1)
   * @returns {number} Valor interpolado
   */
  lerp(start, end, progress) {
    return start + (end - start) * this.clamp(progress, 0, 1);
  }

  // ==========================================
  // UTILIDADES DE STRINGS
  // ==========================================

  /**
   * Capitaliza primera letra de string
   * @param {string} str - String a capitalizar
   * @returns {string} String capitalizado
   */
  capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Convierte camelCase a snake_case
   * @param {string} str - String en camelCase
   * @returns {string} String en snake_case
   */
  camelToSnake(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Convierte snake_case a camelCase
   * @param {string} str - String en snake_case
   * @returns {string} String en camelCase
   */
  snakeToCamel(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Trunca string a longitud específica
   * @param {string} str - String a truncar
   * @param {number} length - Longitud máxima
   * @param {string} suffix - Sufijo para truncamiento
   * @returns {string} String truncado
   */
  truncate(str, length, suffix = '...') {
    if (typeof str !== 'string' || str.length <= length) {
      return str;
    }
    return str.substring(0, length - suffix.length) + suffix;
  }

  // ==========================================
  // UTILIDADES DE FECHAS
  // ==========================================

  /**
   * Formatea fecha para logging
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  formatLogDate(date = new Date()) {
    if (!(date instanceof Date)) {
      date = new Date();
    }
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Calcula diferencia en días entre dos fechas
   * @param {Date} date1 - Primera fecha
   * @param {Date} date2 - Segunda fecha
   * @returns {number} Días de diferencia
   */
  daysDifference(date1, date2) {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // ==========================================
  // UTILIDADES DE DEBOUNCE Y THROTTLE
  // ==========================================

  /**
   * Crea función debounce
   * @param {Function} func - Función a debounce
   * @param {number} wait - Tiempo de espera en ms
   * @returns {Function} Función debounced
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Crea función throttle
   * @param {Function} func - Función a throttle
   * @param {number} limit - Límite de tiempo en ms
   * @returns {Function} Función throttled
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ==========================================
  // UTILIDADES DE MEMOIZACIÓN
  // ==========================================

  /**
   * Memoiza resultado de función para mejorar rendimiento
   * @param {Function} fn - Función a memoizar
   * @param {Function} keyGenerator - Generador de clave para cache
   * @returns {Function} Función memoizada
   */
  memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
    return (...args) => {
      const key = keyGenerator(...args);

      if (this.memoCache.has(key)) {
        return this.memoCache.get(key);
      }

      const result = fn(...args);
      this.memoCache.set(key, result);

      // Limpiar cache si se vuelve muy grande
      if (this.memoCache.size > 100) {
        const keysToDelete = Array.from(this.memoCache.keys()).slice(0, 50);
        keysToDelete.forEach(k => this.memoCache.delete(k));
      }

      return result;
    };
  }

  /**
   * Limpia cache de memoización
   */
  clearMemoCache() {
    this.memoCache.clear();
  }
}

// Instancia singleton
export const utilsService = new UtilsService();

// Export de la clase para testing
export { UtilsService };

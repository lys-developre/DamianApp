/**
 * Servicio centralizado de validación para DamianApp.
 *
 * RESPONSABILIDADES:
 * - Validación de datos de entrada en formularios y configuraciones.
 * - Validación de formato de tiempo, duraciones, archivos y URLs.
 * - Sanitización de datos para seguridad.
 *
 * PATRONES IMPLEMENTADOS:
 * - Validator Pattern con fluent API.
 * - Mensajes de error localizados y descriptivos.
 * - Validación asíncrona y schema validation para objetos complejos.
 *
 * @author DamianApp Team
 * @version 1.0.0 - Módulo 5
 */

class ValidationService {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Limpia errores y warnings acumulados
   */
  reset() {
    this.errors = [];
    this.warnings = [];
    return this;
  }

  /**
   * Agrega un error de validación
   */
  addError(field, message) {
    this.errors.push({ field, message, type: 'error' });
    return this;
  }

  /**
   * Agrega un warning de validación
   */
  addWarning(field, message) {
    this.warnings.push({ field, message, type: 'warning' });
    return this;
  }

  /**
   * Verifica si hay errores
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Verifica si hay warnings
   */
  hasWarnings() {
    return this.warnings.length > 0;
  }

  /**
   * Obtiene todos los errores y warnings
   */
  getValidationResults() {
    return {
      isValid: !this.hasErrors(),
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
      },
    };
  }

  // ==========================================
  // VALIDACIONES BÁSICAS
  // ==========================================

  /**
   * Valida que un campo no esté vacío
   */
  required(value, fieldName = 'Campo') {
    if (value === null || value === undefined || value === '') {
      this.addError(fieldName, `${fieldName} es requerido`);
    }
    return this;
  }

  /**
   * Valida longitud mínima de string
   */
  minLength(value, min, fieldName = 'Campo') {
    if (typeof value === 'string' && value.length < min) {
      this.addError(
        fieldName,
        `${fieldName} debe tener al menos ${min} caracteres`
      );
    }
    return this;
  }

  /**
   * Valida longitud máxima de string
   */
  maxLength(value, max, fieldName = 'Campo') {
    if (typeof value === 'string' && value.length > max) {
      this.addError(
        fieldName,
        `${fieldName} no puede tener más de ${max} caracteres`
      );
    }
    return this;
  }

  /**
   * Valida que sea un número válido
   */
  isNumber(value, fieldName = 'Campo') {
    if (isNaN(Number(value))) {
      this.addError(fieldName, `${fieldName} debe ser un número válido`);
    }
    return this;
  }

  /**
   * Valida rango numérico
   */
  numberRange(value, min, max, fieldName = 'Campo') {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num < min || num > max) {
        this.addError(
          fieldName,
          `${fieldName} debe estar entre ${min} y ${max}`
        );
      }
    }
    return this;
  }

  // ==========================================
  // VALIDACIONES ESPECÍFICAS PARA TIMERS
  // ==========================================

  /**
   * Valida formato de tiempo (HH:MM:SS)
   */
  timeFormat(timeString, fieldName = 'Tiempo') {
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/;

    if (!timeRegex.test(timeString)) {
      this.addError(fieldName, `${fieldName} debe tener formato HH:MM:SS`);
      return this;
    }

    const [, hours] = timeString.match(timeRegex);

    // Validar límites razonables
    if (parseInt(hours) > 23) {
      this.addError(fieldName, 'Las horas no pueden ser mayores a 23');
    }

    return this;
  }

  /**
   * Valida duración total de timer (en segundos)
   */
  timerDuration(seconds, fieldName = 'Duración') {
    const num = Number(seconds);

    if (isNaN(num) || num < 0) {
      this.addError(fieldName, `${fieldName} debe ser un número positivo`);
      return this;
    }

    // Máximo 24 horas (86400 segundos)
    if (num > 86400) {
      this.addError(fieldName, `${fieldName} no puede ser mayor a 24 horas`);
    }

    // Warning para duraciones muy cortas
    if (num > 0 && num < 10) {
      this.addWarning(
        fieldName,
        `${fieldName} es muy corta (menos de 10 segundos)`
      );
    }

    // Warning para duraciones muy largas
    if (num > 7200) {
      // 2 horas
      this.addWarning(fieldName, `${fieldName} es muy larga (más de 2 horas)`);
    }

    return this;
  }

  /**
   * Valida componentes individuales de tiempo manual
   */
  timeComponents(days, hours, minutes, seconds) {
    // Validar días
    this.numberRange(days || 0, 0, 365, 'Días');

    // Validar horas
    this.numberRange(hours || 0, 0, 23, 'Horas');

    // Validar minutos
    this.numberRange(minutes || 0, 0, 59, 'Minutos');

    // Validar segundos
    this.numberRange(seconds || 0, 0, 59, 'Segundos');

    // Validar que al menos uno sea mayor a 0
    const totalSeconds =
      (days || 0) * 86400 +
      (hours || 0) * 3600 +
      (minutes || 0) * 60 +
      (seconds || 0);

    if (totalSeconds === 0) {
      this.addError(
        'Tiempo',
        'Debe especificar al menos un valor de tiempo mayor a 0'
      );
    }

    return this;
  }

  // ==========================================
  // VALIDACIONES PARA URLs E IMÁGENES
  // ==========================================

  /**
   * Valida URL básica
   */
  url(urlString, fieldName = 'URL') {
    try {
      new URL(urlString);
    } catch {
      this.addError(fieldName, `${fieldName} no es una URL válida`);
    }
    return this;
  }

  /**
   * Valida URL de imagen
   */
  imageUrl(urlString, fieldName = 'URL de imagen') {
    // Primero validar que sea URL válida
    this.url(urlString, fieldName);

    // Validar extensión de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = imageExtensions.some(ext =>
      urlString.toLowerCase().includes(ext)
    );

    if (!hasValidExtension) {
      this.addWarning(fieldName, 'La URL no parece ser una imagen válida');
    }

    return this;
  }

  // ==========================================
  // VALIDACIONES PARA CONFIGURACIONES
  // ==========================================

  /**
   * Valida configuración de switches
   */
  switchesConfig(config) {
    if (!config || typeof config !== 'object') {
      this.addError('Configuración', 'Configuración de switches inválida');
      return this;
    }

    // Validar habilitación de haptics
    if (typeof config.enableHaptics !== 'boolean') {
      this.addError(
        'enableHaptics',
        'enableHaptics debe ser verdadero o falso'
      );
    }

    // Validar duración de celebración
    if (config.celebrationDuration !== undefined) {
      this.numberRange(
        config.celebrationDuration,
        1000,
        10000,
        'Duración de celebración'
      );
    }

    return this;
  }

  /**
   * Valida configuración de temporizador
   */
  timerConfig(config) {
    if (!config || typeof config !== 'object') {
      this.addError('Configuración', 'Configuración de temporizador inválida');
      return this;
    }

    // Validar tiempo por defecto
    if (config.defaultTime !== undefined) {
      this.timerDuration(config.defaultTime, 'Tiempo por defecto');
    }

    // Validar booleanos
    [
      'enableHaptics',
      'enableAudio',
      'enableMotivationalPhrases',
      'autoStartCelebration',
    ].forEach(key => {
      if (config[key] !== undefined && typeof config[key] !== 'boolean') {
        this.addError(key, `${key} debe ser verdadero o falso`);
      }
    });

    return this;
  }

  /**
   * Valida configuración de accesibilidad
   */
  accessibilityConfig(config) {
    if (!config || typeof config !== 'object') {
      this.addError('Configuración', 'Configuración de accesibilidad inválida');
      return this;
    }

    // Validar booleanos
    ['reduceMotion', 'highContrast'].forEach(key => {
      if (config[key] !== undefined && typeof config[key] !== 'boolean') {
        this.addError(key, `${key} debe ser verdadero o falso`);
      }
    });

    // Validar tamaño de fuente
    if (config.fontSize !== undefined) {
      const validSizes = ['small', 'normal', 'large'];
      if (!validSizes.includes(config.fontSize)) {
        this.addError(
          'fontSize',
          `fontSize debe ser uno de: ${validSizes.join(', ')}`
        );
      }
    }

    return this;
  }

  /**
   * Valida configuración de tema
   */
  themeConfig(config) {
    if (!config || typeof config !== 'object') {
      this.addError('Configuración', 'Configuración de tema inválida');
      return this;
    }

    // Validar modo oscuro
    if (config.darkMode !== undefined && typeof config.darkMode !== 'boolean') {
      this.addError('darkMode', 'darkMode debe ser verdadero o falso');
    }

    // Validar colores (formato hex)
    ['primaryColor', 'accentColor'].forEach(colorKey => {
      if (config[colorKey] !== undefined) {
        this.hexColor(config[colorKey], colorKey);
      }
    });

    return this;
  }

  /**
   * Valida color hexadecimal
   */
  hexColor(color, fieldName = 'Color') {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!hexRegex.test(color)) {
      this.addError(
        fieldName,
        `${fieldName} debe ser un color hexadecimal válido (ej: #FF0000)`
      );
    }

    return this;
  }

  // ==========================================
  // VALIDACIONES PARA DATOS DE TEMPORIZADOR
  // ==========================================

  /**
   * Valida objeto completo de temporizador con imagen
   */
  timerImageButton(timerData) {
    if (!timerData || typeof timerData !== 'object') {
      this.addError('Timer', 'Datos de temporizador inválidos');
      return this;
    }

    // Validar ID
    this.required(timerData.id, 'ID del temporizador');

    // Validar imagen
    if (timerData.image) {
      this.imageUrl(timerData.image, 'Imagen del temporizador');
    }

    // Validar timer string
    if (timerData.timer) {
      this.timeFormat(timerData.timer, 'Formato del temporizador');
    }

    // Validar segundos
    if (timerData.seconds !== undefined) {
      this.timerDuration(timerData.seconds, 'Duración en segundos');
    }

    // Validar estado activo
    if (
      timerData.isActive !== undefined &&
      typeof timerData.isActive !== 'boolean'
    ) {
      this.addError('isActive', 'isActive debe ser verdadero o falso');
    }

    return this;
  }

  // ==========================================
  // UTILIDADES DE SANITIZACIÓN
  // ==========================================

  /**
   * Sanitiza string removiendo caracteres peligrosos
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';

    return str
      .trim()
      .replace(/[<>]/g, '') // Remover caracteres HTML básicos
      .substring(0, 1000); // Limitar longitud máxima
  }

  /**
   * Sanitiza URL removiendo parámetros peligrosos
   */
  static sanitizeUrl(url) {
    try {
      const urlObj = new URL(url);
      // Permitir solo HTTP y HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitiza número asegurando que esté en rango válido
   */
  static sanitizeNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = Number(value);
    if (isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  }
}

// Factory function para crear nueva instancia
export const createValidator = () => new ValidationService();

// Instancia singleton para uso global
export const validator = new ValidationService();

// Export de la clase para testing
export { ValidationService };

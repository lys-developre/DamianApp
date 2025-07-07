/**
 * Punto de exportación centralizado para todos los servicios de Damian APP
 *
 * PROPÓSITO: Simplificar imports y centralizar acceso a servicios
 * ESCALABILIDAD: Fácil agregar nuevos servicios y mantener consistencia
 *
 * NUEVA ESTRUCTURA MODULAR:
 * - core/: Servicios fundamentales (config, storage, validation)
 * - media/: Servicios de multimedia (audio, haptics)
 * - business/: Lógica de negocio específica
 * - utils/: Utilidades y helpers
 *
 * @author Damian App
 * @version 2.0.0 - Refactorización Modular
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ SERVICIOS CORE (Fundamentales)
// ═══════════════════════════════════════════════════════════════════════════
export { default as configService } from './core/config';
export { default as storageService } from './core/storage';
export { default as validationService } from './core/validation';

// ═══════════════════════════════════════════════════════════════════════════
// 🎵 SERVICIOS MEDIA (Multimedia)
// ═══════════════════════════════════════════════════════════════════════════
export { default as audioService } from './media/audio';
export { default as hapticsService } from './media/haptics';

// ═══════════════════════════════════════════════════════════════════════════
// 🏢 SERVICIOS BUSINESS (Lógica de Negocio)
// ═══════════════════════════════════════════════════════════════════════════
export { default as businessLogicService } from './business/businessLogicService';

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ SERVICIOS UTILS (Utilidades)
// ═══════════════════════════════════════════════════════════════════════════
export { default as dynamicImportService } from './utils/import/dynamicImportService';
export { default as utilsService } from './utils/helpers/utilsService';

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 BACKWARD COMPATIBILITY (Deprecated - Remover en v3.0.0)
// ═══════════════════════════════════════════════════════════════════════════
// Re-exports para mantener compatibilidad
export { storageService as StorageService } from './core/storage';
export {
  validationService as validator,
  validationService as createValidator,
  validationService as ValidationService,
} from './core/validation';
export { utilsService as UtilsService } from './utils/helpers/utilsService';
export {
  businessLogicService as businessLogic,
  businessLogicService as BusinessLogicService,
} from './business/businessLogicService';

// Re-export de utilidades de formateo para backward compatibility
export { formatSeconds } from '../utils/formatters';

/**
 * Inicializa todos los servicios que requieren inicialización
 */
export const initializeServices = async () => {
  try {
    // Importar dinámicamente para evitar referencias circulares
    const { storageService } = await import('./storageService');
    await storageService.initialize();

    // Importar servicios de feedback dinámicamente para evitar errores en web
    try {
      const { hapticsService: haptics } = await import('./hapticsService');
      await haptics.initialize();
    } catch (error) {
      console.warn('Haptics service no disponible:', error);
    }

    try {
      const { audioService: audio } = await import('./audioService');
      await audio.initialize();
    } catch (error) {
      console.warn('Audio service no disponible:', error);
    }

    if (__DEV__) {
      console.warn('🚀 Todos los servicios inicializados correctamente');
    }

    return true;
  } catch (error) {
    console.error('❌ Error inicializando servicios:', error);
    return false;
  }
};

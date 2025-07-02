/**
 * Punto de exportación centralizado para todos los servicios de Damian APP
 *
 * PROPÓSITO: Simplificar imports y centralizar acceso a servicios
 * ESCALABILIDAD: Fácil agregar nuevos servicios y mantener consistencia
 *
 * SERVICIOS DISPONIBLES:
 * - storageService: Persistencia con AsyncStorage
 * - validationService: Validación de datos y formularios
 * - utilsService: Utilidades y formateo
 * - businessLogic: Lógica de negocio específica
 * - hapticsService: Feedback táctil
 * - audioService: Reproducción de sonidos
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 5
 */

// Servicios principales
export { storageService, StorageService } from './storageService';
export {
  validator,
  createValidator,
  ValidationService,
} from './validationService';
export { utilsService, UtilsService } from './utilsService';
export { businessLogic, BusinessLogicService } from './businessLogicService';

// Servicios de feedback
export { hapticsService } from './hapticsService';
export { audioService } from './audioService';

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

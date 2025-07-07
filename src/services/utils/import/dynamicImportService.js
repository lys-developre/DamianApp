/**
 * Servicio de imports dinámicos para evitar errores de módulos
 *
 * Este servicio centraliza todos los imports dinámicos y maneja
 * los errores de carga de módulos de forma robusta.
 *
 * @author Damian App
 * @version 1.0.0
 */

/**
 * @class DynamicImportService
 * @classdesc Servicio singleton para importar módulos de haptics y audio de forma segura y desacoplada.
 */
class DynamicImportService {
  /**
   * Inicializa el cache interno de módulos importados.
   * @constructor
   */
  constructor() {
    /** @type {Map<string, any>} */
    this.cache = new Map();
  }

  /**
   * Importa el servicio de haptics de forma segura.
   * Si falla, retorna un mock seguro.
   * @returns {Promise<Object>} Servicio de haptics real o mock.
   */
  async getHapticsService() {
    if (this.cache.has('hapticsService')) {
      return this.cache.get('hapticsService');
    }
    try {
      const module = await import('../../media/haptics/hapticsService');
      const { hapticsService } = module;
      if (!hapticsService) {
        throw new Error('hapticsService no está exportado correctamente');
      }
      this.cache.set('hapticsService', hapticsService);
      return hapticsService;
    } catch (error) {
      // PROTOCOLO: Manejo profesional de errores
      console.warn('Error importando hapticsService:', error);
      return this.getMockHapticsService();
    }
  }

  /**
   * Importa el servicio de audio de forma segura.
   * Si falla, retorna un mock seguro.
   * @returns {Promise<Object>} Servicio de audio real o mock.
   */
  async getAudioService() {
    if (this.cache.has('audioService')) {
      return this.cache.get('audioService');
    }
    try {
      const module = await import('../../media/audio/audioService');
      const { audioService } = module;
      if (!audioService) {
        throw new Error('audioService no está exportado correctamente');
      }
      this.cache.set('audioService', audioService);
      return audioService;
    } catch (error) {
      // PROTOCOLO: Manejo profesional de errores
      console.warn('Error importando audioService:', error);
      return this.getMockAudioService();
    }
  }

  /**
   * Mock service para haptics cuando el import falla.
   * @returns {Object} Mock seguro de haptics.
   */
  getMockHapticsService() {
    return {
      tick: async () => {},
      light: async () => {},
      medium: async () => {},
      heavy: async () => {},
      success: async () => {},
      celebration: async () => {},
      initialize: async () => {},
    };
  }

  /**
   * Mock service para audio cuando el import falla.
   * @returns {Object} Mock seguro de audio.
   */
  getMockAudioService() {
    return {
      soft: async () => {},
      phraseChange: async () => {},
      almostDone: async () => {},
      epicCelebration: async () => {},
      initialize: async () => {},
      cleanup: async () => {},
    };
  }

  /**
   * Limpia el cache (útil para testing o reinicialización).
   * @void
   */
  clearCache() {
    this.cache.clear();
  }
}

// Exportar instancia singleton
/**
 * Instancia única de DynamicImportService para toda la app.
 * @type {DynamicImportService}
 */
export const dynamicImportService = new DynamicImportService();

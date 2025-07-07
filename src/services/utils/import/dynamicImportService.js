/**
 * Servicio de imports dinámicos para evitar errores de módulos
 *
 * Este servicio centraliza todos los imports dinámicos y maneja
 * los errores de carga de módulos de forma robusta.
 *
 * @author Damian App
 * @version 1.0.0
 */

class DynamicImportService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Importa el servicio de haptics de forma segura
   */
  async getHapticsService() {
    if (this.cache.has('hapticsService')) {
      return this.cache.get('hapticsService');
    }

    try {
      const module = await import('./hapticsService');
      const { hapticsService } = module;

      if (!hapticsService) {
        throw new Error('hapticsService no está exportado correctamente');
      }

      this.cache.set('hapticsService', hapticsService);
      return hapticsService;
    } catch (error) {
      console.warn('Error importando hapticsService:', error);
      // Retornar un mock service que no haga nada
      return this.getMockHapticsService();
    }
  }

  /**
   * Importa el servicio de audio de forma segura
   */
  async getAudioService() {
    if (this.cache.has('audioService')) {
      return this.cache.get('audioService');
    }

    try {
      const module = await import('./audioService');
      const { audioService } = module;

      if (!audioService) {
        throw new Error('audioService no está exportado correctamente');
      }

      this.cache.set('audioService', audioService);
      return audioService;
    } catch (error) {
      console.warn('Error importando audioService:', error);
      // Retornar un mock service que no haga nada
      return this.getMockAudioService();
    }
  }

  /**
   * Mock service para haptics cuando el import falla
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
   * Mock service para audio cuando el import falla
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
   * Limpia el cache (útil para testing o reinicialización)
   */
  clearCache() {
    this.cache.clear();
  }
}

// Exportar instancia singleton
export const dynamicImportService = new DynamicImportService();

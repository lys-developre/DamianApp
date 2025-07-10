/* eslint-disable no-console */
// Nota: Los console.log están condicionados con __DEV__ para debugging en desarrollo

// Servicio de audio multiplataforma preparado para integración con archivos mp3 seleccionados por el usuario
// Elimina toda lógica nativa y clases, dejando solo la interfaz

const audioService = {
  /**
   * Reproduce sonido usando archivo mp3 seleccionado por el usuario
   */
  async playSound(fileUri) {
    // Implementar lógica para reproducir sonido usando fileUri
  },

  /**
   * Métodos de conveniencia para eventos específicos
   */
  async phraseChange() {
    await this.playSound('ruta/o/uri/del/sonido/phrase-change.mp3');
  },

  async epicCelebration() {
    await this.playSound('ruta/o/uri/del/sonido/celebration.mp3');
  },

  async almostDone() {
    await this.playSound('ruta/o/uri/del/sonido/almost-done.mp3');
  },

  /**
   * Limpia recursos de audio
   */
  async cleanup() {
    try {
      // Aquí se puede implementar lógica para limpiar recursos si es necesario

      if (__DEV__) {
        console.log('🧹 Recursos de audio limpiados');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Error limpiando recursos de audio:', error);
      }
    }
  },
};

export default audioService;

/* eslint-disable no-console */
// Nota: Los console.log están condicionados con __DEV__ para debugging en desarrollo

import Sound from 'react-native-sound';
import configService from '../../core/config';

/**
 * Servicio de Audio optimizado para TEA
 *
 * CARACTERÍSTICAS:
 * - Sistema híbrido: tonos nativos + archivos personalizados
 * - Manejo robusto de errores con fallbacks
 * - Optimizado para dispositivos Android
 * - Volúmenes calibrados para usuarios TEA
 * - ✅ RESPETA CONFIGURACIONES AVANZADAS
 *
 * @author Damian App
 * @version 2.0.0 - Con configuración dinámica
 */

class AudioService {
  constructor() {
    this.isInitialized = false;
    this.customSounds = new Map(); // Cache para sonidos personalizados
  }

  /**
   * Obtiene la configuración actual de audio
   */
  getAudioConfig() {
    try {
      const enabled = configService.get('audio.enabled', true);
      const volume = configService.get('audio.volume', 0.8);
      const fadeIn = configService.get('audio.fadeIn', true);
      return { enabled, volume, fadeIn };
    } catch (_error) {
      // Fallback a valores por defecto
      return { enabled: true, volume: 0.8, fadeIn: true };
    }
  }

  /**
   * Verifica si el audio está habilitado
   */
  isEnabled() {
    const config = this.getAudioConfig();
    return config.enabled;
  }

  /**
   * Inicializa el sistema de audio de forma segura
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configuración básica de audio para React Native Sound
      Sound.setCategory('Playback');

      this.isInitialized = true;

      if (__DEV__) {
        console.log('🎵 Sistema de audio inicializado correctamente');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('⚠️ Error inicializando audio:', error);
      }
    }
  }

  /**
   * Reproduce sonido usando archivo personalizado o tono nativo
   */
  async playSound(type, options = {}) {
    // Verificar si el audio está habilitado en configuración
    if (!this.isEnabled()) {
      if (__DEV__) {
        console.log(
          `🔇 Audio ${type} omitido (deshabilitado por configuración)`
        );
      }
      return;
    }

    try {
      await this.initialize();

      // Obtener configuración de audio
      const config = this.getAudioConfig();
      const finalOptions = {
        volume: config.volume,
        fadeIn: config.fadeIn,
        ...options,
      };

      // Intentar reproducir sonido personalizado primero
      if (this.customSounds.has(type)) {
        const sound = this.customSounds.get(type);
        sound.setVolume(finalOptions.volume);
        sound.play();
        return;
      }

      // Fallback a tonos nativos del sistema
      await this.playNativeSound(type, finalOptions);
    } catch (error) {
      if (__DEV__) {
        console.warn(`Error reproduciendo sonido ${type}:`, error);
      }

      // Fallback final: solo vibración (manejado externamente)
    }
  }

  /**
   * Reproduce tonos nativos del sistema Android/iOS
   */
  async playNativeSound(type, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        let soundFile;

        // Seleccionar archivo de sonido según tipo
        switch (type) {
          case 'phrase-change':
            soundFile = 'phrase_change.wav';
            break;
          case 'celebration':
            soundFile = 'celebration_epic.wav';
            break;
          case 'almost-done':
            soundFile = 'almost_done.wav';
            break;
          default:
            soundFile = 'notification_soft.wav';
        }

        // Crear instancia de Sound
        const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
          if (error) {
            // Fallback a simulación
            this.playSimulatedSound(type).then(resolve).catch(reject);
            return;
          }

          // Configurar volumen
          const volume = options.volume || (type === 'celebration' ? 0.8 : 0.6);
          sound.setVolume(volume);

          // Reproducir sonido
          sound.play(success => {
            if (success) {
              if (__DEV__) {
                console.log(`🎵 Sonido nativo ${type} reproducido`);
              }
              resolve();
            } else {
              // Fallback a simulación
              this.playSimulatedSound(type).then(resolve).catch(reject);
            }

            // Liberar recursos
            sound.release();
          });
        });
      } catch (error) {
        if (__DEV__) {
          console.warn(`Usando simulación para ${type}:`, error.message);
        }
        // Fallback a simulación
        this.playSimulatedSound(type).then(resolve).catch(reject);
      }
    });
  }

  /**
   * Fallback: simulación temporal (sistema anterior)
   */
  async playSimulatedSound(type) {
    switch (type) {
      case 'soft':
        await new Promise(resolve => setTimeout(resolve, 100));
        if (__DEV__) {
          console.log('🎵 Simulación: Sonido suave (100ms)');
        }
        break;

      case 'phrase-change':
        if (__DEV__) {
          console.log('🎵 Simulación: Secuencia ascendente C-E-G-C');
        }
        // Simular secuencia de 4 notas ascendentes
        for (let i = 0; i < 4; i++) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        break;

      case 'celebration':
        if (__DEV__) {
          console.log('🎵 Simulación: Acorde de celebración épica');
        }

        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        break;

      default:
        await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Métodos de conveniencia para eventos específicos
   */
  async phraseChange() {
    await this.playSound('phrase-change', { volume: 0.6 });
  }

  async epicCelebration() {
    await this.playSound('celebration', { volume: 0.8 });
  }

  async almostDone() {
    await this.playSound('almost-done', { volume: 0.6 });
  }

  /**
   * Limpia recursos de audio
   */
  async cleanup() {
    try {
      // React Native Sound gestiona automáticamente la limpieza
      // cuando se llama sound.release() en cada reproducción
      this.customSounds.clear();

      if (__DEV__) {
        console.log('🧹 Recursos de audio limpiados');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Error limpiando recursos de audio:', error);
      }
    }
  }
}

// Instancia singleton del servicio
export const audioService = new AudioService();

// Export default de la instancia
export default audioService;

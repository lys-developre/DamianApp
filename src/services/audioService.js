/* eslint-disable no-console */
// Nota: Los console.log están condicionados con __DEV__ para debugging en desarrollo

import { Audio } from 'expo-av';

/**
 * Servicio de Audio optimizado para TEA
 *
 * CARACTERÍSTICAS:
 * - Sistema híbrido: tonos nativos + archivos personalizados
 * - Manejo robusto de errores con fallbacks
 * - Optimizado para dispositivos Android
 * - Volúmenes calibrados para usuarios TEA
 *
 * @author Damian App
 * @version 1.0.0
 */

class AudioService {
  constructor() {
    this.isInitialized = false;
    this.customSounds = new Map(); // Cache para sonidos personalizados
  }

  /**
   * Inicializa el sistema de audio de forma segura
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configuración básica de audio compatible con Android
      await Audio.setAudioModeAsync({
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

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
    try {
      await this.initialize();

      // Intentar reproducir sonido personalizado primero
      if (this.customSounds.has(type)) {
        const sound = this.customSounds.get(type);
        await sound.replayAsync();
        return;
      }

      // Fallback a tonos nativos del sistema
      await this.playNativeSound(type, options);
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
    try {
      // Android: Usar sonidos incluidos en assets
      switch (type) {
        case 'phrase-change':
          // Sonido suave para cambio de frase
          const phraseSound = require('../../../../assets/sounds/phrase_change.wav');
          const { sound: phrase } = await Audio.Sound.createAsync(phraseSound);
          await phrase.setVolumeAsync(options.volume || 0.6);
          await phrase.playAsync();
          break;

        case 'celebration':
          // Sonido épico de celebración
          const celebrationSound = require('../../../../assets/sounds/celebration_epic.wav');
          const { sound: celebration } =
            await Audio.Sound.createAsync(celebrationSound);
          await celebration.setVolumeAsync(options.volume || 0.8);
          await celebration.playAsync();
          break;

        case 'almost-done':
          // Sonido de "casi listo"
          const almostDoneSound = require('../../../../assets/sounds/almost_done.wav');
          const { sound: almostDone } =
            await Audio.Sound.createAsync(almostDoneSound);
          await almostDone.setVolumeAsync(options.volume || 0.6);
          await almostDone.playAsync();
          break;

        default:
          // Sonido de notificación suave por defecto
          const defaultSound = require('../../../../assets/sounds/notification_soft.wav');
          const { sound: notification } =
            await Audio.Sound.createAsync(defaultSound);
          await notification.setVolumeAsync(options.volume || 0.5);
          await notification.playAsync();
      }

      if (__DEV__) {
        console.log(`🎵 Sonido nativo ${type} reproducido`);
      }
    } catch (error) {
      // Fallback: simulación temporal (sistema anterior)
      await this.playSimulatedSound(type);

      if (__DEV__) {
        console.warn(`Usando simulación para ${type}:`, error.message);
      }
    }
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
      for (const [, sound] of this.customSounds) {
        await sound.unloadAsync();
      }
      this.customSounds.clear();
    } catch (error) {
      if (__DEV__) {
        console.warn('Error limpiando recursos de audio:', error);
      }
    }
  }
}

// Instancia singleton del servicio
export const audioService = new AudioService();

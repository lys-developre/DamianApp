/* eslint-disable no-console */
// Nota: Los console.log están condicionados con __DEV__ para debugging en desarrollo

import { Haptics } from 'expo-haptics';

/**
 * Servicio de Haptics mejorado para feedback táctil TEA
 *
 * CARACTERÍSTICAS:
 * - Manejo seguro de errores
 * - Vibraciones potentes y duraderas
 * - Patrones específicos para diferentes eventos
 * - Optimizado para usuarios con TEA
 *
 * @author Damian App
 * @version 1.0.0
 */

class HapticsService {
  /**
   * Ejecuta un haptic de forma segura con manejo de errores
   * @param {Function} hapticsFunction - Función de haptics a ejecutar
   * @param {string} type - Tipo de haptic para logging
   */
  async execute(hapticsFunction, type = 'haptic') {
    try {
      await hapticsFunction();
      if (__DEV__) {
        console.log(`✅ Haptic ${type} ejecutado correctamente`);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(`⚠️ Error ejecutando haptic ${type}:`, error);
      }
    }
  }

  /**
   * Haptic suave mejorado - múltiples pulsos para mayor duración
   */
  async light() {
    await this.execute(async () => {
      // Pulso inicial suave
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(resolve => setTimeout(resolve, 150));

      // Segundo pulso para prolongar sensación
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 'Light Enhanced');
  }

  /**
   * Haptic medio mejorado - más intenso y duradero
   */
  async medium() {
    await this.execute(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(resolve => setTimeout(resolve, 200));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 'Medium Enhanced');
  }

  /**
   * Haptic fuerte mejorado - máxima potencia y duración
   */
  async heavy() {
    await this.execute(async () => {
      for (let i = 0; i < 3; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 100));
      }
    }, 'Heavy Enhanced');
  }

  /**
   * Haptic de notificación de éxito potenciado
   */
  async success() {
    await this.execute(async () => {
      // Notificación de éxito seguida de vibración fuerte
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 300));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 'Success Enhanced');
  }

  /**
   * Celebración épica - vibración de máxima potencia para completar temporizador
   */
  async celebration() {
    await this.execute(async () => {
      // Secuencia épica para celebración
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Múltiples pulsos fuertes con ritmo acelerado
      const delays = [300, 250, 200, 150, 100];
      for (let i = 0; i < 5; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (i < delays.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
      }
    }, 'Celebration Epic');
  }
}

// Instancia singleton del servicio
export const hapticsService = new HapticsService();

/* eslint-disable no-console */
// Nota: Los console.log están condicionados con __DEV__ para debugging en desarrollo

import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  constructor() {
    this.isSupported = true;
    this.initialize();
  }

  /**
   * Verifica si haptics está habilitado en la configuración
   * Lee directamente desde AsyncStorage para evitar dependencias circulares
   */
  async isHapticsEnabled() {
    try {
      const configStr = await AsyncStorage.getItem('@damianapp_user_config');
      if (!configStr) return true; // Por defecto habilitado

      const config = JSON.parse(configStr);
      return config.haptics?.enabled !== false;
    } catch (_error) {
      // Si hay error leyendo la config, asumir habilitado
      return true;
    }
  }

  /**
   * Inicializa el servicio y verifica soporte de haptics
   */
  async initialize() {
    try {
      // Verificar si Haptics está disponible
      if (!Haptics || !Haptics.impactAsync) {
        this.isSupported = false;
        if (__DEV__) {
          console.warn(
            '⚠️ Haptics no disponible - probablemente ejecutándose en simulador'
          );
        }
        return;
      }

      // Hacer una prueba silenciosa
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      this.isSupported = true;

      if (__DEV__) {
        console.log('✅ HapticsService inicializado correctamente');
      }
    } catch (error) {
      this.isSupported = false;
      if (__DEV__) {
        console.warn(
          '⚠️ Haptics no soportado (normal en simulador):',
          error.message
        );
      }
    }
  }

  /**
   * Ejecuta un haptic de forma segura con manejo de errores
   * @param {Function} hapticsFunction - Función de haptics a ejecutar
   * @param {string} type - Tipo de haptic para logging
   */
  async execute(hapticsFunction, type = 'haptic') {
    // Verificar si los haptics están habilitados en la configuración
    const isEnabled = await this.isHapticsEnabled();
    if (!isEnabled) {
      if (__DEV__) {
        console.log(`🔇 Haptic ${type} deshabilitado por configuración`);
      }
      return;
    }

    // Si no hay soporte, salir silenciosamente
    if (!this.isSupported) {
      return;
    }

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
   * Haptic suave para cada segundo del temporizador
   * Optimizado para feedback constante sin ser molesto
   */
  async tick() {
    await this.execute(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 'Tick Segundo');
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

import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { motivationalPhrases } from '../constants/motivationalPhrases';
import { getCurrentPhrase } from '../utils/timerUtils';
import {
  useUIConfig,
  useAccessibilityConfig,
  useHapticsConfig,
} from '../../../hooks/useConfig';

/**
 * Hook personalizado para manejar animaciones del temporizador TEA
 *
 * FUNCIONALIDADES:
 * - Animaciones de frases motivacionales (respeta configuración)
 * - Animaciones de progreso (pulsación y brillo) (respeta configuración)
 * - Animaciones de celebración (respeta configuración)
 * - Feedback visual cada segundo (pulso de vida) (respeta configuración)
 *
 * @author Damian App
 * @version 2.0.0 - Con configuración avanzada
 */

export const useTimerAnimations = ({
  time,
  isRunning,
  initialTime,
  getProgress,
}) => {
  // Configuraciones
  const uiConfig = useUIConfig();
  const accessibilityConfig = useAccessibilityConfig();
  const hapticsConfig = useHapticsConfig();

  // Verificar si las animaciones están habilitadas
  const animationsEnabled =
    uiConfig.animations?.enabled !== false &&
    !accessibilityConfig.reduceAnimations;
  // Referencias de animaciones para frases
  const textOpacity = useRef(new Animated.Value(1)).current;
  const phraseScale = useRef(new Animated.Value(1)).current;
  const phraseTranslateY = useRef(new Animated.Value(0)).current;
  const previousPhrase = useRef('Tenemos que esperar un poquito');

  // Animaciones para progreso
  const progressPulse = useRef(new Animated.Value(1)).current;
  const progressGlow = useRef(new Animated.Value(0)).current;

  // Animaciones para "pulso de vida"
  const heartbeatScale = useRef(new Animated.Value(1)).current;
  const sparkleOpacity = useRef(new Animated.Value(0.3)).current;
  const secondTickOpacity = useRef(new Animated.Value(0)).current;

  // Animaciones para celebración
  const trophyScale = useRef(new Animated.Value(0)).current;
  const medallRotation = useRef(new Animated.Value(0)).current;
  const confettiScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Función que ejecuta animaciones de "pulso de vida" cada segundo
   */
  const triggerSecondTick = useCallback(async () => {
    // Solo ejecutar animaciones si están habilitadas
    if (!animationsEnabled) {
      // Mantener solo el haptic si las animaciones están deshabilitadas pero haptics habilitados
      if (hapticsConfig.enabled) {
        try {
          const { hapticsService } = await import(
            '../../../services/hapticsService'
          );
          await hapticsService.light();
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }
      }
      return;
    }

    // 1. Heartbeat del número del temporizador
    Animated.sequence([
      Animated.timing(heartbeatScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(heartbeatScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Destello de partículas
    Animated.sequence([
      Animated.timing(sparkleOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(sparkleOpacity, {
        toValue: 0.3,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // 3. Indicador visual de "tick" cada segundo
    Animated.sequence([
      Animated.timing(secondTickOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(secondTickOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Vibración suave para feedback táctil solo si está habilitada
    if (hapticsConfig.enabled) {
      try {
        const { hapticsService } = await import(
          '../../../services/hapticsService'
        );
        await hapticsService.light();
      } catch (error) {
        console.warn('Haptics no disponible:', error);
      }
    }
  }, [
    heartbeatScale,
    sparkleOpacity,
    secondTickOpacity,
    animationsEnabled,
    hapticsConfig.enabled,
  ]);

  /**
   * Inicia las animaciones de celebración
   */
  const startCelebrationAnimations = useCallback(() => {
    // Si las animaciones están deshabilitadas, solo mostrar el modal sin animaciones
    if (!animationsEnabled) {
      modalOpacity.setValue(1);
      trophyScale.setValue(1);
      confettiScale.setValue(1);
      return;
    }

    // Secuencia de animaciones
    Animated.sequence([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(trophyScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: false,
      }),
      Animated.timing(medallRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.spring(confettiScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();

    // Rotación continua de medallas (solo si animaciones habilitadas)
    const rotateAnimation = () => {
      medallRotation.setValue(0);
      Animated.loop(
        Animated.timing(medallRotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        })
      ).start();
    };

    setTimeout(rotateAnimation, 1000);
  }, [
    modalOpacity,
    trophyScale,
    medallRotation,
    confettiScale,
    animationsEnabled,
  ]);

  /**
   * Cierra las animaciones de celebración
   */
  const closeCelebrationAnimations = useCallback(() => {
    return new Promise(resolve => {
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Reset de todas las animaciones
        trophyScale.setValue(0);
        medallRotation.setValue(0);
        confettiScale.setValue(0);
        modalOpacity.setValue(0);
        resolve();
      });
    });
  }, [modalOpacity, trophyScale, medallRotation, confettiScale]);

  // Efecto para animar la barra de progreso
  useEffect(() => {
    if (isRunning && time > 0 && animationsEnabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressPulse, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(progressPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressGlow, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(progressGlow, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    } else {
      progressPulse.setValue(1);
      progressGlow.setValue(0);
    }
  }, [isRunning, time, progressPulse, progressGlow, animationsEnabled]);

  // Efecto para animar el cambio de frases motivacionales
  useEffect(() => {
    const progress = getProgress();
    const currentPhrase = getCurrentPhrase(
      motivationalPhrases,
      progress,
      isRunning
    );

    if (previousPhrase.current !== currentPhrase) {
      // Haptics para cambio de frase solo si está habilitado
      if (hapticsConfig.enabled) {
        (async () => {
          try {
            const { hapticsService } = await import(
              '../../../services/hapticsService'
            );
            await hapticsService.light();
          } catch (error) {
            console.warn('Haptics no disponible:', error);
          }
        })();
      }

      // Solo animar si las animaciones están habilitadas
      if (animationsEnabled) {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(textOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(phraseScale, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(phraseTranslateY, {
              toValue: -20,
              duration: 300,
              useNativeDriver: false,
            }),
          ]),
          Animated.parallel([
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.spring(phraseScale, {
              toValue: 1,
              tension: 80,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.spring(phraseTranslateY, {
              toValue: 0,
              tension: 80,
              friction: 8,
              useNativeDriver: false,
            }),
          ]),
        ]).start();
      } else {
        // Si no hay animaciones, simplemente resetear valores
        textOpacity.setValue(1);
        phraseScale.setValue(1);
        phraseTranslateY.setValue(0);
      }

      previousPhrase.current = currentPhrase;
    }
  }, [
    time,
    isRunning,
    textOpacity,
    phraseScale,
    phraseTranslateY,
    getProgress,
    animationsEnabled,
    hapticsConfig.enabled,
  ]);

  return {
    // Valores animados para frases
    textOpacity,
    phraseScale,
    phraseTranslateY,

    // Valores animados para progreso
    progressPulse,
    progressGlow,

    // Valores animados para pulso de vida
    heartbeatScale,
    sparkleOpacity,
    secondTickOpacity,

    // Valores animados para celebración
    trophyScale,
    medallRotation,
    confettiScale,
    modalOpacity,

    // Funciones de animación
    triggerSecondTick,
    startCelebrationAnimations,
    closeCelebrationAnimations,
  };
};

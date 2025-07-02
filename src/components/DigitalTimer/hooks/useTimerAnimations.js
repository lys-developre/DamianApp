import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';
import { hapticsService } from '../services/hapticsService';
import { motivationalPhrases } from '../constants/motivationalPhrases';
import { getCurrentPhrase } from '../utils/timerUtils';

/**
 * Hook personalizado para manejar animaciones del temporizador TEA
 *
 * FUNCIONALIDADES:
 * - Animaciones de frases motivacionales
 * - Animaciones de progreso (pulsación y brillo)
 * - Animaciones de celebración
 * - Feedback visual cada segundo (pulso de vida)
 *
 * @author Damian App
 * @version 1.0.0
 */

export const useTimerAnimations = ({
  time,
  isRunning,
  initialTime,
  getProgress,
}) => {
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
  const triggerSecondTick = useCallback(() => {
    // 1. Heartbeat del número del temporizador
    Animated.sequence([
      Animated.timing(heartbeatScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartbeatScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Destello de partículas
    Animated.sequence([
      Animated.timing(sparkleOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sparkleOpacity, {
        toValue: 0.3,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Indicador visual de "tick" cada segundo
    Animated.sequence([
      Animated.timing(secondTickOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(secondTickOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Vibración suave para feedback táctil
    hapticsService.light();
  }, [heartbeatScale, sparkleOpacity, secondTickOpacity]);

  /**
   * Inicia las animaciones de celebración
   */
  const startCelebrationAnimations = useCallback(() => {
    // Secuencia de animaciones
    Animated.sequence([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(trophyScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(medallRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(confettiScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotación continua de medallas
    const rotateAnimation = () => {
      medallRotation.setValue(0);
      Animated.loop(
        Animated.timing(medallRotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };

    setTimeout(rotateAnimation, 1000);
  }, [modalOpacity, trophyScale, medallRotation, confettiScale]);

  /**
   * Cierra las animaciones de celebración
   */
  const closeCelebrationAnimations = useCallback(() => {
    return new Promise(resolve => {
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
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
    if (isRunning && time > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressPulse, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(progressPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressGlow, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(progressGlow, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
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
  }, [isRunning, time, progressPulse, progressGlow]);

  // Efecto para animar el cambio de frases motivacionales
  useEffect(() => {
    const progress = getProgress();
    const currentPhrase = getCurrentPhrase(
      motivationalPhrases,
      progress,
      isRunning
    );

    if (previousPhrase.current !== currentPhrase) {
      hapticsService.light();

      Animated.sequence([
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(phraseScale, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(phraseTranslateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(phraseScale, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(phraseTranslateY, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      previousPhrase.current = currentPhrase;
    }
  }, [
    time,
    isRunning,
    textOpacity,
    phraseScale,
    phraseTranslateY,
    getProgress,
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

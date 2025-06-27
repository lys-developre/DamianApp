import { useState, useRef, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { hapticsService } from '../services/hapticsService';
import { audioService } from '../services/audioService';

/**
 * Hook personalizado para manejar la lógica del temporizador TEA
 *
 * FUNCIONALIDADES:
 * - Estado del temporizador (tiempo, ejecución, presets)
 * - Control de inicio/pausa/reset
 * - Efectos especiales (95% progreso, celebración)
 * - Integración con servicios de audio/haptics
 *
 * @author Damian App
 * @version 1.0.0
 */

export const useTimer = () => {
  // Estados principales
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [activePresetIndex, setActivePresetIndex] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Referencias
  const intervalRef = useRef(null);
  const hasTriggeredAlmostDone = useRef(false);

  /**
   * Calcula el progreso actual del temporizador
   */
  const getProgress = useCallback(() => {
    if (initialTime === 0) return 0;
    if (time === 0) return 100;

    const progress = ((initialTime - time) / initialTime) * 100;
    return Math.min(Math.round(progress * 100) / 100, 100);
  }, [initialTime, time]);

  /**
   * Inicia la celebración cuando se completa el temporizador
   */
  const startCelebration = useCallback(() => {
    setShowCelebration(true);
    hapticsService.celebration();
    audioService.epicCelebration();
  }, []);

  /**
   * Efecto especial cuando se alcanza el 95% del progreso
   */
  const triggerAlmostDoneEffect = useCallback(() => {
    if (hasTriggeredAlmostDone.current) return;

    hasTriggeredAlmostDone.current = true;
    hapticsService.heavy();
    audioService.almostDone();

    setTimeout(() => {
      hapticsService.medium();
    }, 400);
  }, []);

  /**
   * Alterna entre iniciar y pausar el temporizador
   */
  const toggleTimer = useCallback(() => {
    if (time === 0 && !isRunning) {
      Alert.alert(
        'Sin tiempo configurado',
        'Por favor, selecciona un tiempo para el temporizador.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setIsRunning(!isRunning);
  }, [time, isRunning]);

  /**
   * Reinicia el temporizador a su estado inicial
   */
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
    setActivePresetIndex(null);
    hasTriggeredAlmostDone.current = false;
  }, [initialTime]);

  /**
   * Configura un nuevo tiempo usando un preset predefinido
   */
  const setPresetTime = useCallback((seconds, index) => {
    setIsRunning(false);
    setTime(seconds);
    setInitialTime(seconds);
    setActivePresetIndex(index);
    hasTriggeredAlmostDone.current = false;
  }, []);

  /**
   * Cierra el modal de celebración y reinicia
   */
  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setTime(initialTime);
    setIsRunning(false);
    setActivePresetIndex(null);
    hasTriggeredAlmostDone.current = false;
  }, [initialTime]);

  // Efecto principal del countdown
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            startCelebration();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, startCelebration]);

  // Efecto para detectar 95% de progreso
  useEffect(() => {
    const progress = getProgress();
    if (progress >= 95 && progress < 100 && isRunning) {
      triggerAlmostDoneEffect();
    }
  }, [getProgress, isRunning, triggerAlmostDoneEffect]);

  // Inicializar servicios de audio al montar
  useEffect(() => {
    audioService.initialize();
    return () => {
      audioService.cleanup();
    };
  }, []);

  return {
    // Estados
    time,
    isRunning,
    initialTime,
    activePresetIndex,
    showCelebration,

    // Funciones de control
    toggleTimer,
    resetTimer,
    setPresetTime,
    closeCelebration,

    // Utilidades
    getProgress,
  };
};

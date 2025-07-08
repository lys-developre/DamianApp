import { useState, useRef, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useHapticsConfig, useAudioConfig } from '../../../hooks/useConfig';

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
  // Hooks de configuración
  const hapticsConfig = useHapticsConfig();
  const audioConfig = useAudioConfig();

  // Estados principales - Configuración por defecto: 1 hora
  const [time, setTime] = useState(3600); // 1 hora = 3600 segundos
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(3600); // 1 hora por defecto
  const [activePresetIndex, setActivePresetIndex] = useState(6); // Índice de "1 hora" en timePresets
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
  }, [initialTime, time]); /**
   * Inicia la celebración cuando se completa el temporizador
   */
  const startCelebration = useCallback(async () => {
    setShowCelebration(true);

    // Ejecutar haptics solo si está habilitado
    if (hapticsConfig.enabled) {
      try {
        const { hapticsService } = await import(
          '../../../services/media/haptics'
        );
        await hapticsService.celebration();
      } catch (error) {
        console.warn('Haptics no disponible:', error);
      }
    }

    // Ejecutar audio solo si está habilitado
    if (audioConfig.enabled) {
      try {
        const { audioService } = await import('../../../services/media/audio');
        await audioService.epicCelebration();
      } catch (error) {
        console.warn('Audio no disponible:', error);
      }
    }
  }, [hapticsConfig.enabled, audioConfig.enabled]);

  /**
   * Efecto especial cuando se alcanza el 95% del progreso
   */
  const triggerAlmostDoneEffect = useCallback(async () => {
    if (hasTriggeredAlmostDone.current) return;

    hasTriggeredAlmostDone.current = true;

    // Ejecutar haptics solo si está habilitado
    if (hapticsConfig.enabled) {
      try {
        const { hapticsService } = await import(
          '../../../services/media/haptics'
        );
        await hapticsService.heavy();
        setTimeout(async () => {
          await hapticsService.medium();
        }, 400);
      } catch (error) {
        console.warn('Haptics no disponible:', error);
      }
    }

    // Ejecutar audio solo si está habilitado
    if (audioConfig.enabled) {
      try {
        const { audioService } = await import('../../../services/media/audio');
        await audioService.almostDone();
      } catch (error) {
        console.warn('Audio no disponible:', error);
      }
    }
  }, [hapticsConfig.enabled, audioConfig.enabled]);

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
   * Mantiene el preset activo para facilitar repetir la misma duración
   */
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
    // Mantener activePresetIndex para que siga mostrando el preset seleccionado
    hasTriggeredAlmostDone.current = false;
  }, [initialTime]);

  /**
   * Configura un nuevo tiempo usando un preset predefinido
   * Permite cambiar entre presets en cualquier momento
   */
  const setPresetTime = useCallback((seconds, index) => {
    // Detener temporizador si está corriendo
    setIsRunning(false);

    // Configurar nuevo tiempo
    setTime(seconds);
    setInitialTime(seconds);
    setActivePresetIndex(index);

    // Reset de estados auxiliares
    hasTriggeredAlmostDone.current = false;
  }, []);

  /**
   * Cierra el modal de celebración y reinicia
   * Mantiene el preset activo para facilitar repetir la misma sesión
   */
  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setTime(initialTime);
    setIsRunning(false);
    // Mantener activePresetIndex para facilitar repetir la misma duración
    hasTriggeredAlmostDone.current = false;
  }, [initialTime]);

  // Efecto principal del countdown
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;

          // Solo iniciar celebración cuando llegue exactamente a 0
          if (newTime <= 0) {
            setIsRunning(false);
            startCelebration();
            return 0;
          }

          return newTime;
        });

        // Vibración cada segundo para feedback constante (solo si está habilitado)
        if (hapticsConfig.enabled) {
          (async () => {
            try {
              const { hapticsService } = await import(
                '../../../services/media/haptics'
              );
              await hapticsService.tick();
            } catch (error) {
              console.warn('Haptics no disponible:', error);
            }
          })();
        }
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
  }, [isRunning, time, startCelebration, hapticsConfig.enabled]);

  // Efecto para detectar 95% de progreso
  useEffect(() => {
    const progress = getProgress();
    if (progress >= 95 && progress < 100 && isRunning) {
      triggerAlmostDoneEffect();
    }
  }, [getProgress, isRunning, triggerAlmostDoneEffect]);

  // Inicializar servicios de audio y haptics al montar
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const { audioService } = await import('../../../services/media/audio');
        await audioService.initialize();
      } catch (error) {
        console.warn('Audio service no disponible:', error);
      }

      try {
        const { hapticsService } = await import(
          '../../../services/media/haptics'
        );
        await hapticsService.initialize();
      } catch (error) {
        console.warn('Haptics service no disponible:', error);
      }
    };

    initializeServices();

    return () => {
      // Cleanup
      (async () => {
        try {
          const { audioService } = await import(
            '../../../services/media/audio'
          );
          await audioService.cleanup();
        } catch (error) {
          console.warn('Error en cleanup de audio:', error);
        }
      })();
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

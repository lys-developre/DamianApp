import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';

// Hooks personalizados
import { useTimer } from './hooks/useTimer';
import { useTimerAnimations } from './hooks/useTimerAnimations';

// Componentes
import TimeDisplay from './components/TimeDisplay';
import ControlButtons from './components/ControlButtons';
import TimePresets from './components/TimePresets';
import MotivationalHeader from './components/MotivationalHeader';
import CelebrationModal from './components/CelebrationModal';

// Constantes y utilidades
import { timePresets } from './constants/timePresets';
import { calculateProgress } from './utils/timerUtils';

// Estilos
import { timerStyles } from './styles/timerStyles';

/**
 * DigitalTimer - Temporizador refactorizado para terapia TEA
 *
 * ARQUITECTURA MODULAR:
 * - Hooks personalizados para lógica de negocio
 * - Componentes individuales para UI
 * - Servicios separados para audio/haptics
 * - Utilidades y constantes organizadas
 *
 * @author Damian App
 * @version 2.0.0 (Refactorizado)
 */

const DigitalTimer = () => {
  // Hook principal del temporizador
  const {
    time,
    isRunning,
    initialTime,
    activePresetIndex,
    showCelebration,
    toggleTimer,
    resetTimer,
    setPresetTime,
    closeCelebration,
    getProgress,
  } = useTimer();

  // Hook de animaciones
  const {
    textOpacity,
    phraseScale,
    phraseTranslateY,
    progressPulse,
    progressGlow,
    heartbeatScale,
    sparkleOpacity,
    secondTickOpacity,
    trophyScale,
    medallRotation,
    confettiScale,
    modalOpacity,
    triggerSecondTick,
    startCelebrationAnimations,
    closeCelebrationAnimations,
  } = useTimerAnimations({ time, isRunning, initialTime, getProgress });

  // Efectos adicionales del timer principal
  useEffect(() => {
    if (isRunning && time > 0) {
      const interval = setInterval(triggerSecondTick, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, time, triggerSecondTick]);

  // Efecto para iniciar animaciones de celebración
  useEffect(() => {
    if (showCelebration) {
      startCelebrationAnimations();
    }
  }, [showCelebration, startCelebrationAnimations]);

  // Función para cerrar celebración con animaciones
  const handleCloseCelebration = async () => {
    await closeCelebrationAnimations();
    closeCelebration();
  };

  // Cálculos para el progreso
  const progress = calculateProgress(initialTime, time);

  return (
    <View style={timerStyles.container}>
      {/* FONDO DE PROGRESO VISUAL MEJORADO */}
      <Animated.View
        style={[
          timerStyles.progressBackground,
          {
            height: `${progress}%`,
            transform: [{ scale: progressPulse }],
            opacity: progressGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0.9],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            timerStyles.progressGlow,
            {
              opacity: progressGlow,
            },
          ]}
        />
      </Animated.View>

      {/* HEADER CON MENSAJE MOTIVACIONAL */}
      <MotivationalHeader
        time={time}
        isRunning={isRunning}
        getProgress={getProgress}
        textOpacity={textOpacity}
        phraseScale={phraseScale}
        phraseTranslateY={phraseTranslateY}
        styles={timerStyles}
      />

      {/* DISPLAY PRINCIPAL DEL TIEMPO */}
      <TimeDisplay
        time={time}
        isRunning={isRunning}
        heartbeatScale={heartbeatScale}
        sparkleOpacity={sparkleOpacity}
        secondTickOpacity={secondTickOpacity}
        styles={timerStyles}
      />

      {/* BOTONES DE CONTROL */}
      <ControlButtons
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        styles={timerStyles}
      />

      {/* PRESETS DE TIEMPO */}
      <TimePresets
        timePresets={timePresets}
        activePresetIndex={activePresetIndex}
        setPresetTime={setPresetTime}
        styles={timerStyles}
      />

      {/* MODAL DE CELEBRACIÓN */}
      <CelebrationModal
        showCelebration={showCelebration}
        modalOpacity={modalOpacity}
        trophyScale={trophyScale}
        medallRotation={medallRotation}
        confettiScale={confettiScale}
        closeCelebration={handleCloseCelebration}
        styles={timerStyles}
      />
    </View>
  );
};

export default DigitalTimer;

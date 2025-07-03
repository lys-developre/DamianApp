import React, { useEffect } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../theme';
import { useUIConfig } from '../../hooks/useConfig';

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
import { digitalTimerPresets as timePresets } from '../../utils';
import { calculateProgress, getProgressColor } from './utils/timerUtils';

// Estilos
import { timerStyles } from './styles/timerStyles';

/**
 * DigitalTimer - Temporizador refactorizado para terapia TEA - Módulo 7
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Colores dinámicos para modo oscuro/claro
 * - ✅ Estilos responsivos con tema
 * - ✅ Preparado para toggle de modo
 *
 * ARQUITECTURA MODULAR:
 * - Hooks personalizados para lógica de negocio
 * - Componentes individuales para UI
 * - Servicios separados para audio/haptics
 * - Utilidades y constantes organizadas
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.hideMotivationalHeader - Si true, oculta el header motivacional
 * @param {Function} props.onClose - Función callback para cerrar el timer (opcional)
 * @author Damian App
 * @version 3.0.0 - Theme System Módulo 7
 */

const DigitalTimer = ({ hideMotivationalHeader = false, onClose = null }) => {
  // Hook del tema para colores centralizados
  const { colors } = useTheme();

  // Hook de configuración UI
  const uiConfig = useUIConfig();

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

  // Estilos dinámicos con theme
  const dynamicStyles = {
    container: [
      timerStyles.container,
      {
        backgroundColor: colors.GLASS_LIGHT,
        borderColor: colors.BORDER_PRIMARY,
      },
    ],
    closeButton: [
      timerStyles.closeButton,
      {
        backgroundColor: colors.DANGER,
      },
    ],
    closeButtonText: [
      timerStyles.closeButtonText,
      {
        color: colors.TEXT_PRIMARY,
      },
    ],
  };

  // Cálculos para el progreso
  const progress = calculateProgress(initialTime, time);

  return (
    <View style={dynamicStyles.container}>
      {/* CAPAS DEL EFECTO GLASS */}
      <View style={timerStyles.glassOverlay} />
      <View style={timerStyles.innerGlassBorder} />

      {/* FONDO DE PROGRESO VISUAL MEJORADO */}
      <Animated.View
        style={[
          timerStyles.progressBackground,
          {
            height: `${progress}%`,
            backgroundColor: getProgressColor(progress), // Color dinámico basado en progreso
            transform: [{ scale: progressPulse }],
            opacity: progressGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.0], // Más opaco para mayor visibilidad
            }),
          },
        ]}
      >
        {/* Efecto de brillo adicional (configurable) */}
        {uiConfig.timer?.glowEffect !== false && (
          <Animated.View
            style={[
              timerStyles.progressGlow,
              {
                opacity: progressGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                backgroundColor: getProgressColor(Math.min(progress + 10, 100)), // Color ligeramente más intenso
              },
            ]}
          />
        )}
      </Animated.View>

      {/* HEADER CON MENSAJE MOTIVACIONAL */}
      {!hideMotivationalHeader && (
        <MotivationalHeader
          time={time}
          isRunning={isRunning}
          initialTime={initialTime}
          getProgress={getProgress}
          textOpacity={textOpacity}
          phraseScale={phraseScale}
          phraseTranslateY={phraseTranslateY}
          styles={timerStyles}
        />
      )}

      {/* BOTÓN DE CERRAR (solo si se proporciona onClose) */}
      {onClose && (
        <TouchableOpacity
          style={dynamicStyles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={dynamicStyles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}

      {/* DISPLAY PRINCIPAL DEL TIEMPO */}
      <TimeDisplay
        time={time}
        isRunning={isRunning}
        heartbeatScale={heartbeatScale}
        sparkleOpacity={sparkleOpacity}
        secondTickOpacity={secondTickOpacity}
        styles={timerStyles}
        colors={colors}
        showMilliseconds={uiConfig.timer?.showMilliseconds || false}
      />

      {/* BOTONES DE CONTROL */}
      <ControlButtons
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        styles={timerStyles}
        colors={colors}
      />

      {/* PRESETS DE TIEMPO */}
      <TimePresets
        timePresets={timePresets}
        activePresetIndex={activePresetIndex}
        setPresetTime={setPresetTime}
        styles={timerStyles}
        colors={colors}
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

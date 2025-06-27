import React from 'react';
import { View, Animated } from 'react-native';
import { motivationalPhrases } from '../constants/motivationalPhrases';
import { getCurrentPhrase, getProgressColor } from '../utils/timerUtils';

/**
 * Componente para el header con mensaje motivacional dinámico - DISEÑO MODERNO
 *
 * CARACTERÍSTICAS:
 * - Diseño limpio y minimalista
 * - Animaciones suaves y elegantes
 * - Indicador visual de progreso sutil
 * - Tipografía clara y legible
 *
 * @author Damian App
 * @version 2.0.0 (Rediseñado)
 */

const MotivationalHeader = React.memo(
  ({
    time,
    isRunning,
    initialTime,
    getProgress,
    textOpacity,
    phraseScale,
    phraseTranslateY,
    styles,
  }) => {
    const progress = getProgress();
    const currentPhrase = getCurrentPhrase(
      motivationalPhrases,
      progress,
      isRunning,
      initialTime
    );
    const progressColor = getProgressColor(progress);

    return (
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.motivationalFrame,
            {
              transform: [{ scale: phraseScale }],
              opacity: textOpacity,
            },
          ]}
        >
          {/* Indicador sutil de progreso con efecto glass */}
          <View
            style={[
              styles.motivationalFrameGlow,
              {
                backgroundColor: progressColor,
                opacity: 0.08 + (progress / 100) * 0.12, // Opacidad muy sutil para glass
              },
            ]}
          />

          {/* Borde interno glass sutil */}
          <View style={styles.motivationalFrameInnerBorder} />

          {/* Overlay glass adicional para profundidad */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              zIndex: 2,
            }}
          />

          {/* Texto principal con colores dinámicos tipo semáforo */}
          <Animated.Text
            style={[
              styles.headerTitle,
              // Sistema de colores semáforo basado en progreso
              isRunning && progress < 35 && styles.headerTitleInitial, // Rojo: 0-35%
              isRunning &&
                progress >= 35 &&
                progress < 70 &&
                styles.headerTitleActive, // Amarillo: 35-70%
              isRunning && progress >= 70 && styles.headerTitleAdvanced, // Verde: 70-100%
              {
                transform: [{ translateY: phraseTranslateY }],
                zIndex: 10,
              },
            ]}
          >
            {currentPhrase}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  }
);

MotivationalHeader.displayName = 'MotivationalHeader';

export default MotivationalHeader;

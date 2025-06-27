import React from 'react';
import { View, Animated } from 'react-native';
import { motivationalPhrases } from '../constants/motivationalPhrases';
import { getCurrentPhrase, getProgressColor } from '../utils/timerUtils';

/**
 * Componente para el header con mensaje motivacional dinámico
 *
 * @author Damian App
 * @version 1.0.0
 */

const MotivationalHeader = React.memo(
  ({
    time,
    isRunning,
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
      isRunning
    );
    const progressColor = getProgressColor(progress);

    return (
      <View style={styles.header}>
        <View style={styles.motivationalFrame}>
          {/* Efecto de brillo interno dinámico */}
          <View
            style={[
              styles.motivationalFrameGlow,
              {
                backgroundColor: progressColor,
              },
            ]}
          />

          {/* Borde interno brillante */}
          <View style={styles.motivationalFrameInnerBorder} />

          {/* Fondo con gradiente para el texto */}
          <View style={styles.headerTitleBackground} />

          <Animated.Text
            style={[
              styles.headerTitle,
              {
                opacity: textOpacity,
                transform: [
                  { scale: phraseScale },
                  { translateY: phraseTranslateY },
                ],
                zIndex: 10,
                position: 'relative',
              },
            ]}
          >
            {currentPhrase}
          </Animated.Text>
        </View>
      </View>
    );
  }
);

MotivationalHeader.displayName = 'MotivationalHeader';

export default MotivationalHeader;

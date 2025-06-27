import React from 'react';
import { View, Text, Animated } from 'react-native';
import { formatTime } from '../utils/timerUtils';

/**
 * Componente optimizado para el display del tiempo
 * Separado para evitar re-renders innecesarios
 *
 * @author Damian App
 * @version 1.0.0
 */

const TimeDisplay = React.memo(
  ({
    time,
    isRunning,
    heartbeatScale,
    sparkleOpacity,
    secondTickOpacity,
    styles,
  }) => (
    <View style={styles.displayContainer}>
      {/* Display principal del tiempo con heartbeat */}
      <Animated.View
        style={[
          styles.timeContainer,
          {
            transform: [{ scale: heartbeatScale }],
          },
        ]}
      >
        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>
      </Animated.View>

      {/* Partículas de vida que destellan */}
      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            opacity: sparkleOpacity,
          },
        ]}
      >
        <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
        <Text style={[styles.sparkle, styles.sparkle2]}>💫</Text>
        <Text style={[styles.sparkle, styles.sparkle3]}>🌟</Text>
        <Text style={[styles.sparkle, styles.sparkle4]}>⭐</Text>
      </Animated.View>

      {/* Indicador de tick cada segundo */}
      <Animated.View
        style={[
          styles.secondTick,
          {
            opacity: secondTickOpacity,
          },
        ]}
      >
        <Text style={styles.tickIcon}>🔹</Text>
      </Animated.View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isRunning ? '#00C853' : '#E91E63' },
          ]}
        />
        <Text style={styles.statusText}>
          {isRunning ? 'Esperando...' : time > 0 ? 'Pausado' : 'Detenido'}
        </Text>
      </View>
    </View>
  )
);

TimeDisplay.displayName = 'TimeDisplay';

export default TimeDisplay;

import React from 'react';
import { View, Text, Animated } from 'react-native';
import { formatTime } from '../utils/timerUtils';

/**
 * Componente optimizado para el display del tiempo - Módulo 7
 * Separado para evitar re-renders innecesarios
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Uso de colores dinámicos desde props
 *
 * @author Damian App
 * @version 2.0.0 - Theme System
 */

const TimeDisplay = React.memo(
  ({
    time,
    isRunning,
    heartbeatScale,
    sparkleOpacity,
    secondTickOpacity,
    styles,
    colors,
    showMilliseconds = false,
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
        <Text
          style={[styles.timeDisplay, { color: colors.TIMER_DISPLAY_WHITE }]}
        >
          {formatTime(time, showMilliseconds)}
        </Text>
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
            {
              backgroundColor: isRunning
                ? '#00C853' // Verde cuando está corriendo
                : time > 0
                  ? '#2196F3' // Azul cuando está listo
                  : '#E91E63', // Rosa/rojo cuando está detenido
            },
          ]}
        />
        <Text style={styles.statusText}>
          {isRunning
            ? 'Esperando...'
            : time > 0
              ? 'Listo para iniciar'
              : 'Detenido'}
        </Text>
      </View>
    </View>
  )
);

TimeDisplay.displayName = 'TimeDisplay';

export default TimeDisplay;

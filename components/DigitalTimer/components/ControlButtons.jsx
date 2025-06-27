import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente optimizado para botones de control
 * Evita re-renders cuando solo cambia el tiempo
 *
 * @author Damian App
 * @version 1.0.0
 */

const ControlButtons = React.memo(
  ({ isRunning, toggleTimer, resetTimer, styles }) => (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={[styles.controlButton, styles.playPauseButton]}
        onPress={toggleTimer}
        activeOpacity={0.8}
        accessibilityLabel={
          isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'
        }
      >
        <MaterialIcons
          name={isRunning ? 'pause' : 'play-arrow'}
          size={32}
          color="#ffffff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, styles.resetButton]}
        onPress={resetTimer}
        activeOpacity={0.8}
        accessibilityLabel="Reiniciar temporizador"
      >
        <MaterialIcons name="stop" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  )
);

ControlButtons.displayName = 'ControlButtons';

export default ControlButtons;

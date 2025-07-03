import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente optimizado para botones de control - Módulo 7
 * Evita re-renders cuando solo cambia el tiempo
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Colores dinámicos desde theme
 *
 * @author Damian App
 * @version 2.0.0 - Theme System
 */

const ControlButtons = React.memo(
  ({ isRunning, toggleTimer, resetTimer, styles, colors }) => (
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
          color={colors.CONTROL_ICON}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, styles.resetButton]}
        onPress={resetTimer}
        activeOpacity={0.8}
        accessibilityLabel="Reiniciar temporizador"
      >
        <MaterialIcons name="stop" size={32} color={colors.CONTROL_ICON} />
      </TouchableOpacity>
    </View>
  )
);

ControlButtons.displayName = 'ControlButtons';

export default ControlButtons;

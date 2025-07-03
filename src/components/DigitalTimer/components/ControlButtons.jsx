import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useHapticsConfig } from '../../../hooks/useConfig';

/**
 * Componente optimizado para botones de control - Módulo 7
 * Evita re-renders cuando solo cambia el tiempo
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Colores dinámicos desde theme
 * - ✅ Integración con haptics configurables
 *
 * @author Damian App
 * @version 2.1.0 - Theme System + Haptics configurables
 */

const ControlButtons = React.memo(
  ({ isRunning, toggleTimer, resetTimer, styles, colors }) => {
    // Hook de configuración para haptics
    const hapticsConfig = useHapticsConfig();

    // Función para manejar el toggle con haptics
    const handleTogglePress = async () => {
      // Solo ejecutar haptics si está habilitado
      if (hapticsConfig.enabled) {
        try {
          const { hapticsService } = await import('../services/hapticsService');
          await hapticsService.medium(); // Feedback medio para acción importante
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }
      }
      toggleTimer();
    };

    // Función para manejar el reset con haptics
    const handleResetPress = async () => {
      if (hapticsConfig.enabled) {
        try {
          const { hapticsService } = await import('../services/hapticsService');
          await hapticsService.light(); // Feedback ligero para reset
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }
      }
      resetTimer();
    };

    return (
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playPauseButton]}
          onPress={handleTogglePress}
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
          onPress={handleResetPress}
          activeOpacity={0.8}
          accessibilityLabel="Reiniciar temporizador"
        >
          <MaterialIcons name="stop" size={32} color={colors.CONTROL_ICON} />
        </TouchableOpacity>
      </View>
    );
  }
);

ControlButtons.displayName = 'ControlButtons';

export default ControlButtons;

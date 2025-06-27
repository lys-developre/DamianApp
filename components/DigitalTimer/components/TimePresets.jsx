import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { parsePresetLabel } from '../utils/timerUtils';

/**
 * Componente optimizado para presets de tiempo
 * Se renderiza solo cuando cambia el preset activo
 *
 * @author Damian App
 * @version 1.0.0
 */

const TimePresets = React.memo(
  ({ timePresets, activePresetIndex, setPresetTime, styles }) => {
    /**
     * Renderiza el texto de preset con formato especializado
     */
    const renderPresetText = (label, isActive, isDisabled) => {
      const { number, unit } = parsePresetLabel(label);

      return (
        <View style={styles.presetTextContainer}>
          <Text
            style={[
              styles.presetButtonNumber,
              isActive && styles.presetButtonNumberActive,
              isDisabled && styles.presetButtonNumberDisabled,
            ]}
          >
            {number}
          </Text>
          <Text
            style={[
              styles.presetButtonUnit,
              isActive && styles.presetButtonUnitActive,
              isDisabled && styles.presetButtonUnitDisabled,
            ]}
          >
            {unit}
          </Text>
        </View>
      );
    };

    return (
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Cuánto esperar:</Text>
        <View style={styles.presetsGrid}>
          {timePresets.map((preset, index) => {
            const isActive = activePresetIndex === index;
            // Permitir cambio entre presets en cualquier momento
            const isDisabled = false; // Siempre permitir selección
            const noActivePreset = activePresetIndex === null;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  noActivePreset && styles.presetButtonNormal, // Tamaño normal si no hay activo
                  isActive && styles.presetButtonActive,
                  isDisabled && styles.presetButtonDisabled,
                ]}
                onPress={() => setPresetTime(preset.seconds, index)}
                activeOpacity={0.8}
                disabled={isDisabled}
                accessibilityLabel={`Configurar temporizador a ${preset.label}`}
              >
                {renderPresetText(preset.label, isActive, isDisabled)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

TimePresets.displayName = 'TimePresets';

export default TimePresets;

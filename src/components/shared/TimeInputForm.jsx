import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

/**
 * Componente reutilizable para formularios de configuración de tiempo
 *
 * BENEFICIOS:
 * - ✅ Reutilizable entre TimerImageButtons y DigitalTimer
 * - ✅ Validación centralizada
 * - ✅ UI consistente para inputs de tiempo
 * - ✅ Lógica de conversión encapsulada
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.days - Valor del input de días
 * @param {string} props.hours - Valor del input de horas
 * @param {string} props.minutes - Valor del input de minutos
 * @param {string} props.seconds - Valor del input de segundos
 * @param {Function} props.onDaysChange - Handler para cambio de días
 * @param {Function} props.onHoursChange - Handler para cambio de horas
 * @param {Function} props.onMinutesChange - Handler para cambio de minutos
 * @param {Function} props.onSecondsChange - Handler para cambio de segundos
 * @param {Function} props.onTimeUpdate - Callback cuando cambia el tiempo total
 * @param {Array} props.presets - Array de presets de tiempo disponibles
 * @param {Function} props.onPresetPress - Handler para selección de preset
 * @param {object} props.styles - Estilos del componente padre
 *
 * @author Damian App
 * @version 1.0.0
 */
const TimeInputForm = React.memo(
  ({
    days,
    hours,
    minutes,
    seconds,
    onDaysChange,
    onHoursChange,
    onMinutesChange,
    onSecondsChange,
    onTimeUpdate,
    presets = [],
    onPresetPress,
    styles,
  }) => {
    /**
     * Calcula el tiempo total en segundos
     */
    const calculateTotalSeconds = () => {
      const d = parseInt(days) || 0;
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;

      return d * 86400 + h * 3600 + m * 60 + s;
    };

    /**
     * Handler para cuando se pierde el foco de un input
     */
    const handleBlur = () => {
      const totalSeconds = calculateTotalSeconds();
      onTimeUpdate?.(totalSeconds);
    };

    return (
      <View>
        {/* Presets de tiempo rápido */}
        {presets.length > 0 && (
          <View style={styles.presetsContainer}>
            <Text style={styles.presetsLabel}>Tiempos rápidos:</Text>
            <View style={styles.presetsRow}>
              {presets.map((preset, index) => (
                <TouchableOpacity
                  key={`${preset.label}-${index}`}
                  style={styles.presetBtn}
                  onPress={() => onPresetPress?.(preset.seconds)}
                >
                  <Text style={styles.presetBtnText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Inputs manuales de tiempo */}
        <View style={styles.manualTimeRow}>
          <TextInput
            style={styles.manualInput}
            placeholder="días"
            keyboardType="numeric"
            value={days}
            onChangeText={onDaysChange}
            onBlur={handleBlur}
            placeholderTextColor="#aaa"
            maxLength={2}
          />
          <TextInput
            style={styles.manualInput}
            placeholder="horas"
            keyboardType="numeric"
            value={hours}
            onChangeText={onHoursChange}
            onBlur={handleBlur}
            placeholderTextColor="#aaa"
            maxLength={2}
          />
          <TextInput
            style={styles.manualInput}
            placeholder="min"
            keyboardType="numeric"
            value={minutes}
            onChangeText={onMinutesChange}
            onBlur={handleBlur}
            placeholderTextColor="#aaa"
            maxLength={2}
          />
          <TextInput
            style={styles.manualInput}
            placeholder="seg"
            keyboardType="numeric"
            value={seconds}
            onChangeText={onSecondsChange}
            onBlur={handleBlur}
            placeholderTextColor="#aaa"
            maxLength={2}
          />
        </View>
      </View>
    );
  }
);

TimeInputForm.displayName = 'TimeInputForm';

export default TimeInputForm;

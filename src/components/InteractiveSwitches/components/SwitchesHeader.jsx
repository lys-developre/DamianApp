import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente del botón de reset en la parte inferior - Verde y ancho completo - Módulo 7
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Color dinámico desde theme para iconos
 *
 * @author Damian App
 * @version 4.0.0 - Theme System
 */

const SwitchesHeader = React.memo(({ onReset, styles, colors }) => (
  <View style={styles.resetButtonContainer}>
    <TouchableOpacity
      style={styles.resetButton}
      onPress={onReset}
      activeOpacity={0.8}
    >
      <MaterialIcons name="refresh" size={24} color={colors.TEXT_PRIMARY} />
      <Text style={styles.resetButtonText}>Reiniciar</Text>
    </TouchableOpacity>
  </View>
));

SwitchesHeader.displayName = 'SwitchesHeader';

export default SwitchesHeader;

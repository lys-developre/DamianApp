import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente del botón de reset en la parte inferior - Verde y ancho completo
 *
 * @author Damian App
 * @version 3.0.0
 */

const SwitchesHeader = React.memo(({ onReset, styles }) => (
  <View style={styles.resetButtonContainer}>
    <TouchableOpacity
      style={styles.resetButton}
      onPress={onReset}
      activeOpacity={0.8}
    >
      <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
      <Text style={styles.resetButtonText}>Reiniciar</Text>
    </TouchableOpacity>
  </View>
));

SwitchesHeader.displayName = 'SwitchesHeader';

export default SwitchesHeader;

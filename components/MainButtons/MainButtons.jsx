import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente reutilizable para el grid de botones principales
 * @param {Array} buttons - Array de objetos { key, icon, title, description, onPress, style, accessibilityLabel, accessibilityHint }
 * @param {object} styles - Objeto de estilos para los botones
 */
export default function MainButtons({ buttons, styles }) {
  return (
    <View style={styles.modulesGrid}>
      {buttons.map(btn => (
        <TouchableOpacity
          key={btn.key}
          style={[styles.moduleCard, btn.style]}
          onPress={btn.onPress}
          activeOpacity={0.8}
          accessibilityLabel={btn.accessibilityLabel}
          accessibilityHint={btn.accessibilityHint}
        >
          <MaterialIcons name={btn.icon} size={55} color="#ffffff" />
          <Text style={styles.moduleTitle}>{btn.title}</Text>
          <Text style={styles.moduleDescription}>{btn.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

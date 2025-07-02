import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Botón principal individual configurable y optimizado
 *
 * MEJORAS MÓDULO 2:
 * - ✅ React.memo para optimización de rendimiento
 * - ✅ Props completamente tipadas y documentadas
 * - ✅ Responsabilidad única: renderizar botón
 *
 * @param {object} props - Props individuales del botón
 * @author Damian App
 * @version 2.0.0 - Optimizado
 */
const MainButton = React.memo(
  ({
    icon = 'settings',
    title = '',
    description = '',
    onPress = () => {},
    style = {},
    styles,
    accessibilityLabel,
    accessibilityHint,
    iconColor = '#ffffff',
    iconSize = 55,
    ...rest
  }) => {
    return (
      <TouchableOpacity
        style={[styles.moduleCard, style]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...rest}
      >
        <MaterialIcons name={icon} size={iconSize} color={iconColor} />
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleDescription}>{description}</Text>
      </TouchableOpacity>
    );
  }
);

MainButton.displayName = 'MainButton';

export default MainButton;

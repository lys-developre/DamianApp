import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useHapticsConfig } from '../../hooks/useConfig';

/**
 * Botón principal individual configurable y optimizado
 *
 * MEJORAS MÓDULO 2:
 * - ✅ React.memo para optimización de rendimiento
 * - ✅ Props completamente tipadas y documentadas
 * - ✅ Responsabilidad única: renderizar botón
 * - ✅ Integración con haptics configurables
 *
 * @param {object} props - Props individuales del botón
 * @author Damian App
 * @version 2.1.0 - Optimizado + Haptics configurables
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
    // Hook de configuración para haptics
    const hapticsConfig = useHapticsConfig();

    // Función para manejar el press con haptics
    const handlePress = async () => {
      // Solo ejecutar haptics si está habilitado en la configuración
      if (hapticsConfig.enabled) {
        try {
          const { hapticsService } = await import(
            '../../services/media/haptics'
          );
          await hapticsService.light(); // Feedback ligero para navegación
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }
      }
      onPress();
    };

    return (
      <TouchableOpacity
        style={[styles.moduleCard, style]}
        onPress={handlePress}
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

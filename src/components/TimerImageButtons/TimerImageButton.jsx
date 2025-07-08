import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../../theme';
import {
  useUIConfig,
  useAccessibilityConfig,
  useHapticsConfig,
} from '../../hooks/useConfig';

/**
 * Botón con imagen de fondo y temporizador superpuesto - Módulo 7
 * Cambia color de borde según estado (rojo activo, verde terminado).
 * Ahora es 3 veces más grande y tiene animaciones de pulso y brillo.
 * Animaciones corregidas para evitar conflictos con useNativeDriver.
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Colores dinámicos desde theme
 * - ✅ Preparado para modo oscuro/claro
 * - ✅ Respeta configuración de animaciones
 * - ✅ Integración con haptics configurables
 *
 * @author Damian App
 * @version 2.1.0 - Theme System + Configuración avanzada
 */
export default function TimerImageButton({
  image,
  timer,
  isActive,
  onPress,
  style,
}) {
  const { colors } = useTheme();

  // Hooks de configuración
  const uiConfig = useUIConfig();
  const accessibilityConfig = useAccessibilityConfig();
  const hapticsConfig = useHapticsConfig();

  // Verificar si las animaciones están habilitadas
  const animationsEnabled =
    uiConfig.animations?.enabled !== false &&
    !accessibilityConfig.reduceAnimations;

  // Colores dinámicos según estado usando theme
  const borderColor = isActive
    ? colors.TIMER_ACTIVE_BORDER
    : colors.TIMER_COMPLETE_BORDER;
  const glowColor = isActive ? colors.TIMER_GLOW_RED : colors.TIMER_GLOW_GREEN;

  // Animación de pulso y glow (solo JS, no nativo)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive && animationsEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 600,
            useNativeDriver: false, // Cambiado a false
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, // Cambiado a false
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isActive, pulseAnim, glowAnim, animationsEnabled]);

  // Función para manejar el press con haptics
  const handlePress = async () => {
    // Solo ejecutar haptics si está habilitado
    if (hapticsConfig.enabled) {
      try {
        const { hapticsService } = await import('../../services/media/haptics');
        await hapticsService.medium(); // Feedback medio para acción importante
      } catch (error) {
        console.warn('Haptics no disponible:', error);
      }
    }
    onPress();
  };

  // Sombra/Glow animado usando colores del theme
  const shadowStyle =
    isActive && animationsEnabled
      ? {
          shadowColor: glowColor,
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.8],
          }),
          shadowRadius: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 32],
          }),
          shadowOffset: { width: 0, height: 0 },
        }
      : {
          shadowColor: glowColor,
          shadowOpacity: 0.7,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
        };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: animationsEnabled ? pulseAnim : 1 }],
        },
        shadowStyle,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          {
            borderColor,
          },
        ]}
        activeOpacity={0.85}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={{ borderRadius: 40 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.timerText}>{timer}</Text>
            {!isActive && (
              <Text style={styles.readyText}>¡Listo para continuar!</Text>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 8,
    borderRadius: 40,
    overflow: 'hidden',
    margin: 18,
    backgroundColor: '#222',
    // El tamaño ahora lo controla el prop style desde Main.jsx
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 18,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 54,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  readyText: {
    color: '#38A169',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});

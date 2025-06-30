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

/**
 * Botón con imagen de fondo y temporizador superpuesto.
 * Cambia color de borde según estado (rojo activo, verde terminado).
 * Ahora es 3 veces más grande y tiene animaciones de pulso y brillo.
 * Animaciones corregidas para evitar conflictos con useNativeDriver.
 */
export default function TimerImageButton({
  image,
  timer,
  isActive,
  onPress,
  style,
}) {
  const borderColor = isActive ? '#E53E3E' : '#38A169'; // rojo o verde

  // Animación de pulso y glow (solo JS, no nativo)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
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
  }, [isActive, pulseAnim, glowAnim]);

  // Sombra/Glow animado
  const shadowStyle = isActive
    ? {
        shadowColor: '#E53E3E',
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
        shadowColor: '#38A169',
        shadowOpacity: 0.7,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
      };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
        },
        shadowStyle,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
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

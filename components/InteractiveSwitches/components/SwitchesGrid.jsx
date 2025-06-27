import React from 'react';
import { View, TouchableOpacity, Animated, Text } from 'react-native';

/**
 * Componente del grid de switches interactivos - Estilo Android
 *
 * @author Damian App
 * @version 2.0.0
 */

const SwitchesGrid = React.memo(({ switches, onToggle, styles }) => {
  const renderSwitch = switchItem => {
    const animatedValue = new Animated.Value(switchItem.isActive ? 1 : 0);
    const pulseValue = new Animated.Value(1);
    const glowValue = new Animated.Value(0);

    const handlePress = () => {
      onToggle(switchItem.id);

      // Animación de pulso al presionar
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación de brillo al activar
      if (!switchItem.isActive) {
        Animated.sequence([
          Animated.timing(glowValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(glowValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }

      // Animación suave de toggle con efecto elástico
      Animated.spring(animatedValue, {
        toValue: switchItem.isActive ? 0 : 1,
        friction: 7,
        tension: 120,
        useNativeDriver: false,
      }).start();
    };

    // Valores de animación para diseño exacto como en la imagen con texto
    const thumbTranslateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 30], // Movimiento más amplio para el track más grande
    });

    // Estados visuales exactos como en la imagen
    const trackBackgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '#E0E0E0', // Gris claro desactivado exacto como en la imagen
        '#4CAF50', // Verde exacto como en la imagen (más oscuro que el anterior)
      ],
    });

    // Colores del thumb exactos como en la imagen
    const thumbBackgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '#FFFFFF', // Blanco puro en ambos estados como en la imagen
        '#FFFFFF', // Blanco puro en ambos estados como en la imagen
      ],
    });

    // Animación de escala sutil como en la imagen
    const thumbScale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05], // Escala muy sutil para mantener la elegancia
    });

    // Efecto de brillo muy sutil
    const trackGlowOpacity = glowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.1], // Brillo mínimo para mantener la elegancia
    });

    // Sombra consistente como en la imagen
    const thumbShadowOpacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.2], // Sombra consistente en ambos estados
    });

    return (
      <Animated.View
        key={switchItem.id}
        style={[
          styles.switchContainer,
          {
            transform: [{ scale: pulseValue }],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {/* Container para el switch exacto como en la imagen */}
          <View style={{ position: 'relative', width: '100%', height: 36 }}>
            {/* Track principal exacto como en la imagen */}
            <Animated.View
              style={[
                styles.switchTrack,
                {
                  backgroundColor: trackBackgroundColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                },
              ]}
            >
              {/* Texto OFF - lado izquierdo */}
              <Animated.View
                style={[
                  styles.switchText,
                  styles.switchTextOff,
                  {
                    opacity: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0], // Visible cuando está OFF
                    }),
                  },
                ]}
              >
                <Text style={[styles.switchText, { color: '#757575' }]}>
                  OFF
                </Text>
              </Animated.View>

              {/* Texto ON - lado derecho */}
              <Animated.View
                style={[
                  styles.switchText,
                  styles.switchTextOn,
                  {
                    opacity: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1], // Visible cuando está ON
                    }),
                  },
                ]}
              >
                <Text style={[styles.switchText, { color: '#FFFFFF' }]}>
                  ON
                </Text>
              </Animated.View>

              {/* Efecto de brillo muy sutil */}
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#4CAF50', // Verde exacto como en la imagen
                    opacity: trackGlowOpacity,
                    borderRadius: 16, // Radio exacto para forma ovalada
                  },
                ]}
              />
            </Animated.View>

            {/* Thumb exacto como en la imagen */}
            <Animated.View
              style={[
                styles.switchThumb,
                {
                  left: thumbTranslateX,
                  transform: [{ scale: thumbScale }],
                  backgroundColor: thumbBackgroundColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: thumbShadowOpacity,
                  shadowRadius: 4,
                  elevation: 4,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return <View style={styles.gridContainer}>{switches.map(renderSwitch)}</View>;
});

SwitchesGrid.displayName = 'SwitchesGrid';

export default SwitchesGrid;

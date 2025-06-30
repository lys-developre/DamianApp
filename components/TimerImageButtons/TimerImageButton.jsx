import React from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  View,
  Text,
  StyleSheet,
} from 'react-native';

/**
 * Botón con imagen de fondo y temporizador superpuesto.
 * Cambia color de borde según estado (rojo activo, verde terminado).
 */
export default function TimerImageButton({ image, timer, isActive, onPress }) {
  const borderColor = isActive ? '#E53E3E' : '#38A169'; // rojo o verde

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { borderColor }]}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.timerText}>{timer}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 4,
    borderRadius: 20,
    overflow: 'hidden',
    width: 140,
    height: 140,
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

import React, { useEffect, useCallback } from 'react';
import { View, Animated, Image } from 'react-native';
import audioService from '@services/media/audio';

/**
 * Componente modular para mostrar pictogramas con texto y sonido
 *
 * CARACTERÍSTICAS:
 * - Visualización de pictograma + texto sincronizado
 * - Reproducción de audio asociado al pictograma
 * - Reutilizable para diferentes pictogramas/frases
 * - Gestión automática de memoria de audio
 * - Estilos consistentes con el theme del timer
 *
 * @author Damian App
 * @version 1.0.0 - Componente modular
 */

const PictogramDisplay = React.memo(
  ({
    pictogramSource,
    audioSource,
    text,
    textColor = '#64B5F6',
    shouldPlayAudio = false,
    styles,
    textOpacity,
    phraseScale,
    phraseTranslateY,
  }) => {
    // Función para reproducir el sonido del pictograma usando audioService
    const playPictogramSound = useCallback(async () => {
      if (!audioSource || !shouldPlayAudio) return;
      try {
        // audioSource puede ser un nombre de archivo o un identificador
        await audioService.playSound(audioSource);
      } catch (error) {
        console.error('❌ Error reproduciendo sonido del pictograma:', error);
      }
    }, [audioSource, shouldPlayAudio]);

    // Efecto para reproducir sonido cuando sea necesario
    useEffect(() => {
      if (shouldPlayAudio) {
        playPictogramSound();
      }
    }, [shouldPlayAudio, playPictogramSound]);

    return (
      <Animated.View
        style={[
          styles.pictogramFrame,
          {
            transform: [{ scale: phraseScale }],
            opacity: textOpacity,
          },
        ]}
      >
        {/* Fondo glass para pictograma */}
        <View style={styles.pictogramFrameGlow} />

        {/* Contenedor del pictograma que ocupa todo el espacio */}
        <View style={styles.pictogramCompactContainer}>
          {/* Imagen como fondo completo */}
          {pictogramSource && (
            <Image
              source={pictogramSource}
              style={styles.pictogramCompactImage}
              resizeMode="contain" // Contain para mantener la imagen clara y completa
            />
          )}

          {/* Texto superpuesto en la parte inferior */}
          <Animated.Text
            style={[
              styles.pictogramCompactText,
              {
                color: textColor,
                transform: [{ translateY: phraseTranslateY }],
              },
            ]}
          >
            {text}
          </Animated.Text>
        </View>
      </Animated.View>
    );
  }
);

PictogramDisplay.displayName = 'PictogramDisplay';

export default PictogramDisplay;

import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { motivationalPhrases } from '../constants/motivationalPhrases';
import { getCurrentPhrase, getProgressColor } from '../utils/timerUtils';
import PictogramDisplay from './PictogramDisplay';

/**
 * Componente para el header con mensaje motivacional dinámico - DISEÑO MODERNO
 *
 * CARACTERÍSTICAS:
 * - Diseño limpio y minimalista
 * - Animaciones suaves y elegantes
 * - Indicador visual de progreso sutil
 * - Tipografía clara y legible
 *
 * @author Damian App
 * @version 2.0.0 (Rediseñado)
 */

const MotivationalHeader = React.memo(
  ({
    time,
    isRunning,
    initialTime,
    getProgress,
    textOpacity,
    phraseScale,
    phraseTranslateY,
    styles,
  }) => {
    // Estado para mostrar el pictograma inicial
    const [showInitialPictogram, setShowInitialPictogram] = useState(true);
    // Estado para controlar si debe reproducir audio (solo al presionar PLAY)
    const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
    // Estado para trackear si ya se reprodujo audio en esta sesión
    const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

    // Efecto para manejar el cambio de estado del pictograma y audio
    useEffect(() => {
      // Si el timer está corriendo, ocultar el pictograma y mostrar frases
      if (isRunning && showInitialPictogram) {
        setShowInitialPictogram(false);
        // Marcar que ya se reprodujo audio en esta sesión
        setHasPlayedAudio(true);
      }
      // Al parar el timer (reset), volver a mostrar el pictograma
      if (!isRunning && time === initialTime) {
        setShowInitialPictogram(true);
        // NO activar audio aquí - se activará cuando se presione PLAY
        setShouldPlayAudio(false);
      }
    }, [isRunning, showInitialPictogram, time, initialTime, hasPlayedAudio]);

    // Efecto separado para manejar el audio cuando se presiona PLAY
    useEffect(() => {
      // Cuando se presiona PLAY (cambia a isRunning=true) y aún no se reprodujo audio
      if (isRunning && !hasPlayedAudio && showInitialPictogram) {
        setShouldPlayAudio(true);
        // Programar para desactivar el audio después de que se reproduzca
        setTimeout(() => {
          setShouldPlayAudio(false);
        }, 100); // Pequeño delay para asegurar que se active
      }
    }, [isRunning, hasPlayedAudio, showInitialPictogram]);

    // Efecto para resetear el estado de audio cuando se cambia de preset
    useEffect(() => {
      // Resetear cuando cambia el tiempo inicial (nuevo preset seleccionado)
      setHasPlayedAudio(false);
      setShouldPlayAudio(false);
    }, [initialTime]);

    const progress = getProgress();
    const currentPhrase = getCurrentPhrase(
      motivationalPhrases,
      progress,
      isRunning,
      initialTime
    );
    const progressColor = getProgressColor(progress);

    return (
      <View style={styles.header}>
        {/* Pictograma inicial - Ocupa el 100% del header (25% del timer) */}
        {showInitialPictogram && !isRunning && (
          <View style={styles.pictogramSection}>
            <PictogramDisplay
              pictogramSource={require('../../../assets/pictogramas/esperar/esperar.png')}
              audioSource={require('../../../assets/pictogramas/esperar/esperar.mp3')}
              text="Esperar"
              textColor="#FFFFFF"
              shouldPlayAudio={shouldPlayAudio}
              styles={styles}
              textOpacity={textOpacity}
              phraseScale={phraseScale}
              phraseTranslateY={phraseTranslateY}
            />
          </View>
        )}

        {/* Frases motivacionales - Cuando está corriendo */}
        {(!showInitialPictogram || isRunning) && (
          <Animated.View
            style={[
              styles.motivationalFrame,
              {
                transform: [{ scale: phraseScale }],
                opacity: textOpacity,
                height: '100%', // Ocupa toda la altura del header
                width: '100%', // Ocupa todo el ancho del header
                marginHorizontal: 0, // Sin margen para ocupar todo el espacio
              },
            ]}
          >
            {/* Indicador sutil de progreso con efecto glass */}
            <View
              style={[
                styles.motivationalFrameGlow,
                {
                  backgroundColor: progressColor,
                  opacity: 0.08 + (progress / 100) * 0.12, // Opacidad muy sutil para glass
                },
              ]}
            />

            {/* Borde interno glass sutil */}
            <View style={styles.motivationalFrameInnerBorder} />

            {/* Overlay glass adicional para profundidad */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                zIndex: 2,
              }}
            />

            {/* Texto principal con colores dinámicos tipo semáforo */}
            <Animated.Text
              style={[
                styles.headerTitle,
                // Sistema de colores semáforo basado en progreso
                isRunning && progress < 35 && styles.headerTitleInitial, // Rojo: 0-35%
                isRunning &&
                  progress >= 35 &&
                  progress < 70 &&
                  styles.headerTitleActive, // Amarillo: 35-70%
                isRunning && progress >= 70 && styles.headerTitleAdvanced, // Verde: 70-100%
                {
                  transform: [{ translateY: phraseTranslateY }],
                  zIndex: 10,
                },
              ]}
            >
              {currentPhrase}
            </Animated.Text>
          </Animated.View>
        )}
      </View>
    );
  }
);

MotivationalHeader.displayName = 'MotivationalHeader';

export default MotivationalHeader;

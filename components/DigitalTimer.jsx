import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente DigitalTimer - "Yo tengo paciencia"
 *
 * Temporizador personalizado con enfoque de autoafirmación:
 * - Mensaje en primera persona para empoderamiento
 * - Refuerzo positivo de la autoestima
 * - Display digital grande y claro
 * - Botones de control accesibles
 * - Presets de tiempo: "Cuánto esperar"
 * - Indicadores visuales de estado
 * - Feedback visual y sonoro
 * - Íconos de corazón para refuerzo emocional positivo
 *
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de temporizador con autoafirmación
 */
export default function DigitalTimer() {
  const [time, setTime] = useState(0); // Tiempo en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [activePresetIndex, setActivePresetIndex] = useState(null);
  const intervalRef = useRef(null);

  /**
   * Presets de tiempo comunes en segundos
   */
  const timePresets = [
    { label: '1 minuto', seconds: 60 },
    { label: '2 minutos', seconds: 120 },
    { label: '5 minutos', seconds: 300 },
    { label: '10 minutos', seconds: 600 },
    { label: '15 minutos', seconds: 900 },
    { label: '30 minutos', seconds: 1800 },
    { label: '1 hora', seconds: 3600 },
    { label: '2 horas', seconds: 7200 },
  ];

  /**
   * Efecto para manejar el countdown del temporizador
   */
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            Alert.alert(
              '¡Muy bien!',
              'Has esperado con paciencia. ¡Excelente trabajo!',
              [{ text: 'Gracias', style: 'default' }]
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  /**
   * Convierte segundos a formato HH:MM:SS
   */
  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Siempre mostrar formato HH:MM:SS para consistency
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Inicia o pausa el temporizador
   */
  const toggleTimer = () => {
    if (time === 0 && !isRunning) {
      Alert.alert(
        'Sin tiempo configurado',
        'Por favor, selecciona un tiempo para el temporizador.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setIsRunning(!isRunning);
  };

  /**
   * Detiene y reinicia el temporizador
   */
  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime);
    setActivePresetIndex(null);
  };

  /**
   * Establece un tiempo preset
   */
  const setPresetTime = (seconds, index) => {
    setIsRunning(false);
    setTime(seconds);
    setInitialTime(seconds);
    setActivePresetIndex(index);
  };

  /**
   * Calcula el porcentaje de progreso
   */
  const getProgress = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  /**
   * Renderiza el texto del preset con el número destacado
   */
  const renderPresetText = (label, isActive, isDisabled) => {
    const parts = label.split(' ');
    const number = parts[0];
    const unit = parts.slice(1).join(' ');

    return (
      <View style={styles.presetTextContainer}>
        <Text
          style={[
            styles.presetButtonNumber,
            isActive && styles.presetButtonNumberActive,
            isDisabled && styles.presetButtonNumberDisabled,
          ]}
        >
          {number}
        </Text>
        <Text
          style={[
            styles.presetButtonUnit,
            isActive && styles.presetButtonUnitActive,
            isDisabled && styles.presetButtonUnitDisabled,
          ]}
        >
          {unit}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fondo de progreso que llena de abajo hacia arriba */}
      <View
        style={[styles.progressBackground, { height: `${getProgress()}%` }]}
      />

      {/* Header del temporizador */}
      <View style={styles.header}>
        <MaterialIcons name="favorite" size={32} color="#FFD700" />
        <Text style={styles.headerTitle}>Yo tengo paciencia</Text>
        <MaterialIcons name="favorite" size={32} color="#FFD700" />
      </View>

      {/* Display principal del tiempo con progreso de fondo */}
      <View style={styles.displayContainer}>
        {/* Fondo de progreso que se llena de abajo hacia arriba */}
        {initialTime > 0 && (
          <View style={styles.progressBackgroundContainer}>
            <View
              style={[
                styles.progressBackground,
                { height: `${getProgress()}%` },
              ]}
            />
          </View>
        )}

        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>

        {/* Indicador de estado */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isRunning ? '#48bb78' : '#e53e3e' },
            ]}
          />
          <Text style={styles.statusText}>
            {isRunning ? 'Esperando...' : time > 0 ? 'Pausado' : 'Detenido'}
          </Text>
        </View>
      </View>

      {/* Botones de control principal */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playPauseButton]}
          onPress={toggleTimer}
          activeOpacity={0.8}
          accessibilityLabel={
            isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'
          }
        >
          <MaterialIcons
            name={isRunning ? 'pause' : 'play-arrow'}
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
          activeOpacity={0.8}
          accessibilityLabel="Reiniciar temporizador"
        >
          <MaterialIcons name="stop" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Presets de tiempo */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Cuánto esperar:</Text>
        <View style={styles.presetsGrid}>
          {timePresets.map((preset, index) => {
            const isActive = activePresetIndex === index;
            const isDisabled =
              activePresetIndex !== null && activePresetIndex !== index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  isActive && styles.presetButtonActive,
                  isDisabled && styles.presetButtonDisabled,
                ]}
                onPress={() => setPresetTime(preset.seconds, index)}
                activeOpacity={isDisabled ? 1 : 0.8}
                disabled={isDisabled}
                accessibilityLabel={`Configurar temporizador a ${preset.label}`}
              >
                {renderPresetText(preset.label, isActive, isDisabled)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/**
 * Estilos del componente DigitalTimer
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#764BA2',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative', // Para permitir el posicionamiento absoluto del progreso
    overflow: 'hidden', // Para que el progreso no se salga del contenedor
  },

  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.3)', // Verde translúcido
    borderRadius: 20,
    zIndex: 0, // Detrás de todo el contenido
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
    gap: 12,
    zIndex: 1, // Por encima del fondo de progreso
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    flexShrink: 1,
  },

  displayContainer: {
    alignItems: 'center',
    marginBottom: 25,
    zIndex: 1, // Por encima del fondo de progreso
  },

  timeDisplay: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 15,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 3,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  statusText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    gap: 20,
    zIndex: 1, // Por encima del fondo de progreso
  },

  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  playPauseButton: {
    backgroundColor: '#48bb78',
  },

  resetButton: {
    backgroundColor: '#e53e3e',
  },

  presetsContainer: {
    alignItems: 'center',
    zIndex: 1, // Por encima del fondo de progreso
  },

  presetsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: '100%',
  },

  presetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  presetButtonActive: {
    backgroundColor: '#81C784', // Verde claro
    borderColor: '#66BB6A',
    transform: [{ scale: 1.1 }], // Aumenta el tamaño
    shadowOpacity: 0.4,
    elevation: 6,
    minWidth: 90,
  },

  presetButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.5,
  },

  presetTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  presetButtonNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonNumberActive: {
    color: '#ffffff',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  presetButtonNumberDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'transparent',
  },

  presetButtonUnit: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 12,
    marginTop: -2,
    opacity: 0.9,
  },

  presetButtonUnitActive: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonUnitDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.6,
  },
});

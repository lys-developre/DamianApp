import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente DigitalTimer - Temporizador digital especializado
 *
 * Temporizador visual con interfaz adaptada para necesidades especiales:
 * - Display digital grande y claro
 * - Botones de control accesibles
 * - Presets de tiempo comunes
 * - Indicadores visuales de estado
 * - Feedback visual y sonoro
 *
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de temporizador digital
 */
export default function DigitalTimer() {
  const [time, setTime] = useState(0); // Tiempo en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const intervalRef = useRef(null);

  /**
   * Presets de tiempo comunes en segundos
   */
  const timePresets = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
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
              '¡Tiempo terminado!',
              'El temporizador ha llegado a cero.',
              [{ text: 'OK', style: 'default' }]
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
  };

  /**
   * Establece un tiempo preset
   */
  const setPresetTime = seconds => {
    setIsRunning(false);
    setTime(seconds);
    setInitialTime(seconds);
  };

  /**
   * Calcula el porcentaje de progreso
   */
  const getProgress = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header del temporizador */}
      <View style={styles.header}>
        <MaterialIcons name="timer" size={28} color="#ffffff" />
        <Text style={styles.headerTitle}>Cuánto Esperar</Text>
      </View>

      {/* Display principal del tiempo */}
      <View style={styles.displayContainer}>
        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>

        {/* Barra de progreso visual */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
        </View>

        {/* Indicador de estado */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isRunning ? '#48bb78' : '#e53e3e' },
            ]}
          />
          <Text style={styles.statusText}>
            {isRunning ? 'En ejecución' : time > 0 ? 'Pausado' : 'Detenido'}
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
        <Text style={styles.presetsTitle}>Tiempos rápidos:</Text>
        <View style={styles.presetsGrid}>
          {timePresets.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.presetButton,
                time === preset.seconds && styles.presetButtonActive,
              ]}
              onPress={() => setPresetTime(preset.seconds)}
              activeOpacity={0.8}
              accessibilityLabel={`Configurar temporizador a ${preset.label}`}
            >
              <Text
                style={[
                  styles.presetButtonText,
                  time === preset.seconds && styles.presetButtonTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
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
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    paddingVertical: 8,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  displayContainer: {
    alignItems: 'center',
    marginBottom: 25,
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
  },

  presetsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  presetButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    shadowOpacity: 0.3,
    elevation: 5,
  },

  presetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  presetButtonTextActive: {
    color: '#764BA2',
    fontWeight: '800',
  },
});

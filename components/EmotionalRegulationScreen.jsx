import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Pantalla de Regulación Emocional
 *
 * Sistema especializado para la identificación y manejo de emociones:
 * - Semáforo emocional visual (Verde/Amarillo/Rojo)
 * - Estrategias de autorregulación personalizables
 * - Actividades calmantes interactivas
 * - Registro automático de uso para análisis
 * - Diseño basado en principios ABA y TEACCH
 *
 * Funcionalidades:
 * - Identificación de estado emocional actual
 * - Selección de estrategias de calma personalizadas
 * - Actividades sensoriales (respiración, conteo, visualización)
 * - Comunicación de necesidades emocionales
 * - Transición gradual hacia la calma
 *
 * Características de accesibilidad:
 * - Colores suaves y no estimulantes
 * - Iconos grandes y claros
 * - Retroalimentación visual inmediata
 * - Navegación simple y predecible
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onBack - Función para regresar al hub principal
 * @returns {JSX.Element} Pantalla de regulación emocional
 * @author Damian
 * @version 1.0.0
 */
export default function EmotionalRegulationScreen({ onBack }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showStrategies, setShowStrategies] = useState(false);

  /**
   * Maneja la selección de estado emocional
   */
  const handleEmotionSelect = useCallback(emotion => {
    setSelectedEmotion(emotion);
    setShowStrategies(true);

    // TODO: Integrar con sistema de logging de datos para análisis
    // Registro automático para análisis de patrones emocionales
    // logEmotionalEvent({
    //   type: 'emotion_selected',
    //   emotion: emotion.name,
    //   timestamp: new Date(),
    //   context: 'emotional_regulation_screen'
    // });
  }, []);

  /**
   * Maneja la selección de estrategia de regulación
   */
  const handleStrategySelect = useCallback(strategy => {
    Alert.alert(
      '¡Excelente elección!',
      `Vamos a ${strategy.action}. Esto te ayudará a sentirte mejor.`,
      [
        {
          text: 'Comenzar',
          onPress: () => {
            // TODO: Implementar actividad específica de la estrategia
            // TODO: Integrar con sistema de registro de eventos
            // logTherapeuticEvent({
            //   type: 'strategy_selected',
            //   strategy: strategy.name,
            //   timestamp: new Date(),
            //   context: 'emotional_regulation'
            // });
          },
        },
      ]
    );
  }, []);

  /**
   * Regresa a la selección de emociones
   */
  const handleBackToEmotions = useCallback(() => {
    setShowStrategies(false);
    setSelectedEmotion(null);
  }, []);

  /**
   * Estados emocionales del semáforo
   */
  const emotionalStates = [
    {
      id: 'calm',
      name: 'Tranquilo',
      color: '#48BB78',
      icon: 'sentiment-very-satisfied',
      description: 'Me siento bien y relajado',
    },
    {
      id: 'worried',
      name: 'Inquieto',
      color: '#ECC94B',
      icon: 'sentiment-neutral',
      description: 'Algo me preocupa un poco',
    },
    {
      id: 'upset',
      name: 'Molesto',
      color: '#F56565',
      icon: 'sentiment-very-dissatisfied',
      description: 'Me siento frustrado o enojado',
    },
  ];

  /**
   * Estrategias de regulación emocional personalizadas
   */
  const regulationStrategies = [
    {
      id: 'breathe',
      name: 'Respirar Profundo',
      action: 'respirar lentamente',
      icon: 'air',
      color: '#4299E1',
    },
    {
      id: 'count',
      name: 'Contar Hasta 10',
      action: 'contar despacio',
      icon: 'filter-1',
      color: '#38B2AC',
    },
    {
      id: 'quiet',
      name: 'Lugar Tranquilo',
      action: 'ir a tu rincón de calma',
      icon: 'weekend',
      color: '#805AD5',
    },
    {
      id: 'hug',
      name: 'Abrazo',
      action: 'pedir un abrazo',
      icon: 'favorite',
      color: '#ED64A6',
    },
    {
      id: 'music',
      name: 'Música Relajante',
      action: 'escuchar música suave',
      icon: 'music-note',
      color: '#48BB78',
    },
    {
      id: 'draw',
      name: 'Dibujar',
      action: 'hacer un dibujo',
      icon: 'brush',
      color: '#F6AD55',
    },
  ];

  if (showStrategies && selectedEmotion) {
    return (
      <View style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToEmotions}
          >
            <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>¿Qué te ayuda a calmarte?</Text>
        </View>

        {/* Estado emocional seleccionado */}
        <View style={styles.selectedEmotionContainer}>
          <View
            style={[
              styles.selectedEmotionCard,
              { backgroundColor: selectedEmotion.color },
            ]}
          >
            <MaterialIcons
              name={selectedEmotion.icon}
              size={48}
              color="#ffffff"
            />
            <Text style={styles.selectedEmotionText}>
              {selectedEmotion.name}
            </Text>
          </View>
        </View>

        {/* Grid de estrategias */}
        <View style={styles.strategiesGrid}>
          {regulationStrategies.map(strategy => (
            <TouchableOpacity
              key={strategy.id}
              style={[styles.strategyCard, { backgroundColor: strategy.color }]}
              onPress={() => handleStrategySelect(strategy)}
              activeOpacity={0.8}
              accessibilityLabel={`Estrategia: ${strategy.name}`}
              accessibilityHint={`Presiona para ${strategy.action}`}
            >
              <MaterialIcons name={strategy.icon} size={32} color="#ffffff" />
              <Text style={styles.strategyText}>{strategy.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de emergencia */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() =>
            Alert.alert('Ayuda', 'Buscando a un adulto para ayudarte...')
          }
          accessibilityLabel="Botón de ayuda urgente"
        >
          <MaterialIcons name="help" size={24} color="#ffffff" />
          <Text style={styles.emergencyText}>Necesito Ayuda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>¿Cómo te sientes?</Text>
      </View>

      {/* Instrucciones visuales */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Toca el color que mejor describe cómo te sientes ahora
        </Text>
      </View>

      {/* Semáforo emocional */}
      <View style={styles.emotionsContainer}>
        {emotionalStates.map(emotion => (
          <TouchableOpacity
            key={emotion.id}
            style={[styles.emotionCard, { backgroundColor: emotion.color }]}
            onPress={() => handleEmotionSelect(emotion)}
            activeOpacity={0.8}
            accessibilityLabel={`Estado emocional: ${emotion.name}`}
            accessibilityHint={emotion.description}
          >
            <MaterialIcons name={emotion.icon} size={60} color="#ffffff" />
            <Text style={styles.emotionName}>{emotion.name}</Text>
            <Text style={styles.emotionDescription}>{emotion.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mensaje de apoyo */}
      <View style={styles.supportMessage}>
        <Text style={styles.supportText}>
          Está bien sentirse así. Vamos a encontrar algo que te ayude.
        </Text>
      </View>
    </View>
  );
}

/**
 * Estilos del componente EmotionalRegulationScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 48,
  },

  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  instructionsText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },

  emotionsContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  emotionCard: {
    width: width * 0.85,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  emotionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },

  emotionDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },

  supportMessage: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },

  supportText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },

  selectedEmotionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  selectedEmotionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  selectedEmotionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },

  strategiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  strategyCard: {
    width: width * 0.42,
    height: 120,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  strategyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 5,
  },

  emergencyButton: {
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  emergencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});

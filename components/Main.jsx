import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CommunicationScreen from './CommunicationScreen';

const { width } = Dimensions.get('window');

/**
 * Componente Main de la aplicación Damian APP
 *
 * Renderiza la pantalla principal con navegación simple y optimizada:
 * - Pantalla inicial con card de bienvenida
 * - Transición directa a pantalla de comunicación
 * - Diseño moderno con gradiente de fondo
 * - Compatibilidad con dispositivos modernos (notch, etc.)
 * - Funciones de navegación memoizadas para mejor rendimiento
 *
 * Estados de navegación:
 * - Pantalla principal: Card de bienvenida
 * - Pantalla de comunicación: Botones interactivos
 *
 * Optimizaciones de rendimiento:
 * - useCallback para funciones de navegación estables
 * - Renderizado condicional eficiente
 * - Estilos optimizados con StyleSheet
 *
 * @returns {JSX.Element} Componente principal con navegación simple
 * @author Damian
 * @version 3.0.0
 */
export default function Main() {
  const [showCommunication, setShowCommunication] = useState(false);

  /**
   * Maneja la navegación a la pantalla de comunicación
   * Memoizado para optimizar el rendimiento
   */
  const navigateToCommunication = useCallback(() => {
    setShowCommunication(true);
  }, []);

  /**
   * Maneja el regreso a la pantalla principal
   * Memoizado para optimizar el rendimiento
   */
  const navigateBack = useCallback(() => {
    setShowCommunication(false);
  }, []);

  // Renderizar pantalla de comunicación si está activa
  if (showCommunication) {
    return <CommunicationScreen onBack={navigateBack} />;
  }

  // Renderizar pantalla principal
  return (
    <View style={styles.container}>
      {/* Tarjeta principal con información de la app */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={navigateToCommunication}
          activeOpacity={0.9}
          accessibilityLabel="Tarjeta de bienvenida"
          accessibilityHint="Presiona para acceder a los botones de comunicación"
        >
          {/* Título principal de la aplicación */}
          <Text style={styles.title}>Damian APP</Text>

          {/* Subtítulo descriptivo */}
          <Text style={styles.subtitle}>Comunicación fácil</Text>

          {/* Badge con número de versión */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>v3.0</Text>
          </View>

          {/* Icono y texto de llamada a la acción */}
          <View style={styles.actionContainer}>
            <MaterialIcons name="touch-app" size={32} color="#667eea" />
            <Text style={styles.actionText}>Toca para comenzar</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Indicador visual en la parte inferior */}
      <View style={styles.bottomIndicator}>
        <Text style={styles.indicatorText}>
          Aplicación de comunicación para Damián
        </Text>
      </View>

      {/* Configuración de la barra de estado */}
      <StatusBar style="light" />
    </View>
  );
}

/**
 * Estilos del componente Main
 *
 * Define la apariencia visual de todos los elementos:
 * - Layout y posicionamiento
 * - Colores y gradientes
 * - Tipografía y espaciado
 * - Sombras y efectos visuales
 */
const styles = StyleSheet.create({
  /**
   * Contenedor principal de la aplicación
   */
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  /**
   * Contenedor de la tarjeta principal
   */
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Tarjeta principal con contenido
   */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    minWidth: 320,
    width: width * 0.85,
  },

  /**
   * Título principal
   */
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
    textAlign: 'center',
  },

  /**
   * Subtítulo
   */
  subtitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 20,
    textAlign: 'center',
  },

  /**
   * Badge de versión
   */
  badge: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 25,
  },

  /**
   * Texto del badge
   */
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  /**
   * Contenedor de acción
   */
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Texto de acción
   */
  actionText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  /**
   * Indicador inferior
   */
  bottomIndicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  /**
   * Texto del indicador
   */
  indicatorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
});

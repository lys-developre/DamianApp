import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import CommunicationButton from './CommunicationButton';

/**
 * Componente Main de la aplicación Damian APP
 *
 * Renderiza la pantalla principal con diseño moderno que incluye:
 * - Fondo con gradiente morado-azul
 * - Tarjeta centrada con información de la app
 * - Badge con número de versión
 * - Botones de comunicación modulares y reutilizables
 * - Compatibilidad con dispositivos modernos (notch, etc.)
 *
 * Arquitectura de componentes:
 * - Main: Componente contenedor principal
 * - CommunicationButton: Componente reutilizable para botones
 *
 * @returns {JSX.Element} Componente principal con el contenido de la aplicación
 * @author Damian
 * @version 1.0.0
 */
export default function Main() {
  /**
   * Maneja el evento de clic en los botones de comunicación
   *
   * @param {string} message - El mensaje que se ha seleccionado
   */
  const handleButtonPress = message => {
    Alert.alert('Botón Presionado', `Has seleccionado: "${message}"`, [
      { text: 'OK', style: 'default' },
    ]);
  };

  /**
   * Configuración de los botones de comunicación
   * Cada botón tiene un texto, color y función específica
   */
  const communicationButtons = [
    { text: 'MAMÁ', color: '#FF6B6B', id: 'mama' },
    { text: 'PAPÁ', color: '#4ECDC4', id: 'papa' },
    { text: 'DAMIÁN', color: '#45B7D1', id: 'damian' },
    { text: 'QUIERO', color: '#96CEB4', id: 'quiero' },
    { text: 'ME DUELE', color: '#FFEAA7', id: 'duele' },
    { text: 'NO ENTIENDO', color: '#DDA0DD', id: 'noentiendo' },
    { text: 'ESPERAR', color: '#98D8C8', id: 'esperar' },
  ];

  return (
    <View style={styles.container}>
      {/* Tarjeta principal con información de la app */}
      <View style={styles.card}>
        {/* Título principal de la aplicación */}
        <Text style={styles.title}>Damian APP</Text>

        {/* Subtítulo descriptivo */}
        <Text style={styles.subtitle}>Comunicación fácil</Text>

        {/* Badge con número de versión */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>v1.0</Text>
        </View>
      </View>

      {/* Sección de botones de comunicación */}
      <View style={styles.buttonsContainer}>
        {communicationButtons.map(button => (
          <CommunicationButton
            key={button.id}
            text={button.text}
            color={button.color}
            id={button.id}
            onPress={handleButtonPress}
          />
        ))}
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
 * - Botones de comunicación
 */
const styles = StyleSheet.create({
  /**
   * Contenedor principal de la aplicación
   *
   * Características:
   * - Ocupa toda la pantalla (flex: 1)
   * - Fondo con gradiente morado-azul
   * - Centrado vertical y horizontal
   * - Padding para separación de bordes
   */
  container: {
    flex: 1,
    backgroundColor: '#667eea', // Color base del gradiente
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradiente diagonal
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },

  /**
   * Tarjeta principal con contenido
   *
   * Características:
   * - Fondo blanco semitransparente
   * - Bordes redondeados para diseño moderno
   * - Sombra para efecto de elevación
   * - Padding interno generoso
   * - Ancho mínimo para consistencia visual
   */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20, // Bordes muy redondeados
    padding: 30, // Espaciado interno reducido
    alignItems: 'center',
    // Configuración de sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10, // Sombra proyectada hacia abajo
    },
    shadowOpacity: 0.25, // Transparencia de la sombra
    shadowRadius: 20, // Difuminado de la sombra
    elevation: 15, // Elevación para Android
    minWidth: 300, // Ancho mínimo garantizado
    marginBottom: 30, // Separación con los botones
  },

  /**
   * Estilo del título principal
   *
   * Tipografía grande y destacada para máximo impacto visual
   */
  title: {
    fontSize: 28, // Tamaño reducido
    fontWeight: 'bold', // Peso bold para destacar
    color: '#2d3748', // Gris oscuro para buena legibilidad
    marginBottom: 8, // Separación con el siguiente elemento
    textAlign: 'center', // Centrado horizontal
  },

  /**
   * Estilo del subtítulo
   *
   * Texto secundario con color más suave
   */
  subtitle: {
    fontSize: 16, // Tamaño reducido
    color: '#718096', // Gris medio para jerarquía visual
    marginBottom: 15, // Mayor separación antes del badge
    textAlign: 'center',
  },

  /**
   * Contenedor del badge de versión
   *
   * Elemento destacado con color verde para indicar estado activo
   */
  badge: {
    backgroundColor: '#48bb78', // Verde éxito
    paddingHorizontal: 12, // Padding horizontal reducido
    paddingVertical: 6, // Padding vertical reducido
    borderRadius: 12, // Bordes redondeados tipo píldora
  },

  /**
   * Texto dentro del badge
   *
   * Texto blanco contrastante sobre fondo verde
   */
  badgeText: {
    color: '#ffffff', // Blanco para contraste
    fontSize: 12, // Tamaño pequeño para badge
    fontWeight: '600', // Semi-bold para legibilidad
  },

  /**
   * Contenedor de los botones de comunicación
   *
   * Características:
   * - Flex para ocupar el espacio disponible
   * - Ancho completo para botones grandes
   * - Espaciado entre botones
   */
  buttonsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15, // Espaciado entre botones
  },
});

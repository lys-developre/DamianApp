import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * Componente de botón de comunicación reutilizable
 *
 * Renderiza un botón grande y colorido para comunicación básica:
 * - Diseño consistente con colores personalizables
 * - Texto grande para fácil lectura
 * - Efectos de sombra y elevación
 * - Respuesta táctil con opacidad
 * - Accesibilidad optimizada
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto a mostrar en el botón
 * @param {string} props.color - Color de fondo del botón
 * @param {string} props.id - Identificador único del botón
 * @param {Function} props.onPress - Función a ejecutar al presionar el botón
 * @returns {JSX.Element} Componente de botón de comunicación
 * @author Damian
 * @version 1.0.0
 */
const CommunicationButton = ({ text, color, id, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.communicationButton, { backgroundColor: color }]}
      onPress={() => onPress(text)}
      activeOpacity={0.8}
      accessibilityLabel={`Botón de comunicación: ${text}`}
      accessibilityHint={`Presiona para comunicar: ${text}`}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

/**
 * Estilos del componente CommunicationButton
 *
 * Define la apariencia visual del botón de comunicación:
 * - Layout y dimensiones
 * - Efectos visuales (sombras, bordes)
 * - Tipografía del texto
 * - Compatibilidad multiplataforma
 */
const styles = StyleSheet.create({
  /**
   * Estilo del botón de comunicación
   *
   * Características:
   * - Ancho completo con altura fija
   * - Bordes redondeados modernos
   * - Sombra para elevación visual
   * - Centrado del contenido
   * - Compatibilidad iOS/Android
   */
  communicationButton: {
    width: '100%',
    height: 60, // Altura fija para botones grandes
    borderRadius: 15, // Bordes redondeados
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevación para Android
    elevation: 8,
  },

  /**
   * Texto del botón de comunicación
   *
   * Características:
   * - Tamaño grande para fácil lectura
   * - Peso bold para destacar
   * - Color blanco para contraste
   * - Sombra de texto para mejor legibilidad
   */
  buttonText: {
    fontSize: 20, // Tamaño grande para fácil lectura
    fontWeight: 'bold', // Peso bold para destacar
    color: '#ffffff', // Color blanco para contraste
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra del texto para mejor legibilidad
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CommunicationButton;

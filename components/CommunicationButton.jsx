import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Componente de botón de comunicación reutilizable y optimizado
 *
 * Renderiza un botón grande y colorido para comunicación básica:
 * - Diseño consistente con colores personalizables
 * - Texto grande para fácil lectura
 * - Pictogramas visuales para mejor comprensión
 * - Efectos de sombra y elevación
 * - Respuesta táctil con opacidad
 * - Accesibilidad optimizada
 * - Memoizado con React.memo para prevenir renders innecesarios
 *
 * Optimizaciones de rendimiento:
 * - React.memo para evitar renders cuando las props no cambian
 * - Estilos optimizados para ambas plataformas (iOS/Android)
 * - Props validadas para mejor debugging
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto a mostrar en el botón
 * @param {string} props.color - Color de fondo del botón
 * @param {string} props.id - Identificador único del botón
 * @param {JSX.Element} props.icon - Componente de icono/pictograma a mostrar
 * @param {Function} props.onPress - Función a ejecutar al presionar el botón
 * @returns {JSX.Element} Componente de botón de comunicación
 * @author Damian
 * @version 2.0.0
 */
const CommunicationButton = React.memo(({ text, color, id, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.communicationButton, { backgroundColor: color }]}
      onPress={() => onPress(text)}
      activeOpacity={0.8}
      accessibilityLabel={`Botón de comunicación: ${text}`}
      accessibilityHint={`Presiona para comunicar: ${text}`}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

// Establecer displayName para mejor debugging
CommunicationButton.displayName = 'CommunicationButton';

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
   * Contenedor del contenido del botón
   *
   * Características:
   * - Layout horizontal para icono y texto
   * - Centrado vertical y horizontal
   * - Espaciado entre icono y texto
   */
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Espaciado entre icono y texto
  },

  /**
   * Contenedor del icono/pictograma
   *
   * Características:
   * - Tamaño fijo para consistencia visual
   * - Centrado del contenido
   */
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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

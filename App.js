import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Componente principal de la aplicación Damian APP
 *
 * Renderiza una pantalla de bienvenida con diseño moderno que incluye:
 * - Fondo con gradiente morado-azul
 * - Tarjeta centrada con información de la app
 * - Badge con número de versión
 *
 * @returns {JSX.Element} Componente principal de la aplicación
 * @author Damian
 * @version 1.0.0
 */
export default function App() {
  return (
    <View style={styles.container}>
      {/* Tarjeta principal con información de la app */}
      <View style={styles.card}>
        {/* Título principal de la aplicación */}
        <Text style={styles.title}>Damian APP</Text>

        {/* Subtítulo descriptivo */}
        <Text style={styles.subtitle}>desde Expo Go!</Text>

        {/* Badge con número de versión */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>v1.0</Text>
        </View>
      </View>

      {/* Configuración de la barra de estado */}
      <StatusBar style="light" />
    </View>
  );
}

/**
 * Estilos del componente App
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
    justifyContent: 'center',
    padding: 20,
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
    padding: 40, // Espaciado interno amplio
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
  },

  /**
   * Estilo del título principal
   *
   * Tipografía grande y destacada para máximo impacto visual
   */
  title: {
    fontSize: 32, // Tamaño grande para título
    fontWeight: 'bold', // Peso bold para destacar
    color: '#2d3748', // Gris oscuro para buena legibilidad
    marginBottom: 10, // Separación con el siguiente elemento
    textAlign: 'center', // Centrado horizontal
  },

  /**
   * Estilo del subtítulo
   *
   * Texto secundario con color más suave
   */
  subtitle: {
    fontSize: 18, // Tamaño mediano
    color: '#718096', // Gris medio para jerarquía visual
    marginBottom: 20, // Mayor separación antes del badge
    textAlign: 'center',
  },

  /**
   * Contenedor del badge de versión
   *
   * Elemento destacado con color verde para indicar estado activo
   */
  badge: {
    backgroundColor: '#48bb78', // Verde éxito
    paddingHorizontal: 16, // Padding horizontal
    paddingVertical: 8, // Padding vertical
    borderRadius: 15, // Bordes redondeados tipo píldora
  },

  /**
   * Texto dentro del badge
   *
   * Texto blanco contrastante sobre fondo verde
   */
  badgeText: {
    color: '#ffffff', // Blanco para contraste
    fontSize: 14, // Tamaño pequeño para badge
    fontWeight: '600', // Semi-bold para legibilidad
  },
});

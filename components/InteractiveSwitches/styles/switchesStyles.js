import { StyleSheet } from 'react-native';

/**
 * Estilos del componente InteractiveSwitches - 40 switches estilo iOS/Moderno
 * Diseño EXACTO basado en la imagen de referencia con texto ON/OFF
 *
 * CARACTERÍSTICAS EXACTAS DE LA IMAGEN:
 * - Track ovalado más grande (32px alto, borderRadius 16px)
 * - Thumb circular blanco más grande (28px) que se desliza suavemente
 * - Texto "OFF" lado izquierdo (gris cuando desactivado)
 * - Texto "ON" lado derecho (blanco cuando activado)
 * - Color desactivado: #E0E0E0 (gris claro)
 * - Color activado: #4CAF50 (verde Material Design)
 * - Optimizado para Android con elevación y sombras
 *
 * ESPECIFICACIONES PARA ANDROID:
 * - Forma ovalada con texto integrado
 * - Thumb con zIndex alto para estar encima del texto
 * - Sombras más pronunciadas para Android (elevation)
 * - Borde definido para mejor contraste en Android
 * - Texto con transición de opacidad animada
 * - Proporciones ajustadas (aspect ratio 2.8)
 * - Área táctil ampliada para dedos
 *
 * PRINCIPIOS UX/UI APLICADOS:
 * - Diseño familiar tipo iOS pero optimizado para Android
 * - Feedback visual claro con texto y colores
 * - Accesibilidad mejorada con texto descriptivo
 * - Transiciones suaves y naturales
 * - Consistencia visual en todos los estados
 * - Affordance clara con texto explícito
 *
 * @author Damian App
 * @version 6.0.0 - iOS Style with ON/OFF Text (Android Optimized)
 */

export const switchesStyles = StyleSheet.create({
  // ==========================================================================
  // CONTENEDOR PRINCIPAL - EFECTO GLASS MODERNO
  // ==========================================================================

  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo glass semitransparente
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Borde sutil
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
    // Exactamente iguales al DigitalTimer - sin minHeight forzada
  },

  // Capa de efecto glass adicional
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    zIndex: 0,
  },

  // Borde interno para mayor definición
  innerGlassBorder: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },

  // ==========================================================================
  // CONTENEDOR PRINCIPAL
  // ==========================================================================

  switchesContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
    minHeight: 320, // Altura mínima para distribución adecuada
  },

  // ==========================================================================
  // GRID DE SWITCHES - DISTRIBUCIÓN UX/UI OPTIMIZADA
  // ==========================================================================

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribución uniforme mejorada
    alignItems: 'flex-start',
    paddingHorizontal: 8, // Padding reducido para switches más grandes
    paddingVertical: 16,
    flex: 1,
    gap: 8, // Gap reducido para mejor distribución con texto
  },

  switchContainer: {
    width: '22%', // Switches más anchos para mejor visibilidad
    aspectRatio: 2.8, // Proporción más alargada como en la imagen
    marginBottom: 14, // Separación vertical optimizada
    justifyContent: 'center',
    alignItems: 'center',
    // Área táctil aumentada para mejor accesibilidad
    minHeight: 42, // Altura aumentada para acomodar texto
    minWidth: 60, // Ancho mínimo para switches con texto
    // Padding interno para área táctil más amplia
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  // Track del switch - DISEÑO EXACTO COMO EN LA IMAGEN CON TEXTO
  switchTrack: {
    width: '100%',
    height: 32, // Altura mayor para acomodar el texto
    borderRadius: 16, // Radio exacto para forma ovalada perfecta
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4, // Padding para el texto y thumb
    // Sombras sutiles para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    // Borde sutil como en la imagen
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    position: 'relative',
  },

  // Thumb del switch - CÍRCULO PERFECTO COMO EN LA IMAGEN
  switchThumb: {
    width: 28, // Tamaño más grande para que se vea bien en Android
    height: 28,
    borderRadius: 14, // Perfectamente circular
    // Sombras más pronunciadas para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    // Propiedades para animaciones suaves
    position: 'absolute',
    top: 2, // Centrado en el track de 32px
    zIndex: 10, // Asegurar que esté encima del texto
    // Borde blanco como en la imagen
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  // Texto dentro del switch - COMO EN LA IMAGEN
  switchText: {
    fontSize: 11, // Tamaño pequeño para caber en el switch
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'absolute',
    zIndex: 5, // Debajo del thumb pero visible
  },

  // Texto OFF (lado izquierdo)
  switchTextOff: {
    left: 8,
    color: '#757575', // Gris para estado desactivado
  },

  // Texto ON (lado derecho)
  switchTextOn: {
    right: 8,
    color: '#FFFFFF', // Blanco para estado activado
  },

  // ==========================================================================
  // BOTÓN DE RESET - PARTE INFERIOR, ANCHO COMPLETO, VERDE
  // ==========================================================================

  resetButtonContainer: {
    paddingTop: 10,
    paddingBottom: 0, // Reducido para aprovechar mejor el espacio
    zIndex: 2,
  },

  resetButton: {
    backgroundColor: '#4CAF50', // Verde Material Design vibrante
    height: 44, // Altura ligeramente reducida
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15, // Tamaño ligeramente reducido
    fontWeight: '600',
    marginLeft: 8,
  },

  // ==========================================================================
  // MODAL DE CELEBRACIÓN
  // ==========================================================================

  celebrationModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  celebrationContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    minWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },

  celebrationTrophy: {
    fontSize: 80,
    marginBottom: 20,
  },

  celebrationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },

  celebrationSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },

  celebrationButton: {
    backgroundColor: '#4CAF50', // Verde Material Design consistente
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  celebrationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

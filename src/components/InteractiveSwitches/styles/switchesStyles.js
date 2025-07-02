import { StyleSheet } from 'react-native';

/**
 * Estilos del componente InteractiveSwitches - 40 switches TIPO iOS
 * Diseño exacto basado en la imagen iOS proporcionada (4 columnas)
 *
 * CARACTERÍSTICAS EXACTAS DE LA IMAGEN iOS:
 * - 40 switches compactos tipo iOS (40 total)
 * - Track súper redondeado (28px alto, borderRadius 14px)
 * - Thumb circular grande (24px) como iOS nativo
 * - Color desactivado: #E5E5EA (gris iOS claro)
 * - Color activado: #007AFF (azul iOS exacto)
 * - Distribución: 4 switches por fila (10 filas - 40 total)
 * - Mayor espaciado entre switches
 * - Sombras sutiles tipo iOS
 * - Sin texto, solo estados visuales
 *
 * @author Damian App
 * @version 17.0.0 - 40 iOS Switches (4x10 grid)
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
    justifyContent: 'space-between', // Para 4 switches por fila con espaciado uniforme
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flex: 1,
    gap: 16, // Espaciado ligeramente reducido para acomodar 10 filas
  },

  switchContainer: {
    width: '22%', // Para 4 switches por fila con espaciado
    aspectRatio: 1.9, // Proporción iOS exacta
    marginBottom: 16, // Espaciado vertical optimizado para 10 filas
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Track del switch - EXACTO COMO EN LA IMAGEN iOS
  switchTrack: {
    width: 46, // Ancho fijo tipo iOS (46px)
    height: 28, // Alto fijo tipo iOS (28px)
    borderRadius: 14, // Radio completo para forma súper redondeada
    backgroundColor: '#E5E5EA', // Color iOS desactivado exacto
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },

  // Track activado - Color iOS exacto
  switchTrackActive: {
    backgroundColor: '#007AFF', // Azul iOS exacto
  },

  // Thumb del switch - COMO EN LA IMAGEN iOS
  switchThumb: {
    width: 24, // Thumb grande tipo iOS
    height: 24,
    borderRadius: 12, // Perfectamente circular
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    position: 'absolute',
    top: 2, // Centrado en el track de 28px
    left: 2, // Posición inicial
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

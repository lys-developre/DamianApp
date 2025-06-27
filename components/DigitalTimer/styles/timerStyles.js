import { StyleSheet } from 'react-native';

/**
 * Estilos del componente DigitalTimer
 * Separados para mejor organización y mantenimiento
 *
 * @author Damian App
 * @version 1.0.0
 */

export const timerStyles = StyleSheet.create({
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
    // Efecto de backdrop blur simulado con overlay
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
  // FONDO DE PROGRESO VISUAL
  // ==========================================================================

  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.4)', // Azul glass suave por defecto
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 0,
    overflow: 'hidden',
    // Efecto de borde para mayor visibilidad
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.6)',
    // Sombra interna suave
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Brillo glass blanco
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // Efecto de gradiente glass
    shadowColor: 'rgba(255, 255, 255, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  // ==========================================================================
  // HEADER Y TÍTULO PRINCIPAL - DISEÑO MODERNO Y LIMPIO
  // ==========================================================================

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },

  motivationalFrame: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fondo oscuro tipo semáforo
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#2D3748', // Marco grueso como semáforo real
    paddingVertical: 22,
    paddingHorizontal: 26,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    minWidth: '85%',
    maxWidth: '95%',
    overflow: 'hidden',
    position: 'relative',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#F7FAFC', // Texto blanco por defecto para contraste
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 36,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Sombra oscura para resaltar
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Estados del semáforo - COLORES BRILLANTES Y VISIBLES
  headerTitleInitial: {
    color: '#FF4D4D', // Rojo brillante tipo semáforo
    fontWeight: '800',
    textShadowColor: 'rgba(255, 77, 77, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  headerTitleActive: {
    color: '#FFD700', // Amarillo dorado brillante tipo semáforo
    fontWeight: '800',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  headerTitleAdvanced: {
    color: '#00FF7F', // Verde brillante tipo semáforo
    fontWeight: '800',
    textShadowColor: 'rgba(0, 255, 127, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  motivationalFrameGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.4,
    zIndex: 1,
  },

  motivationalFrameInnerBorder: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Azul sutil para combinar con el theme
    zIndex: 2,
  },

  headerTitleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'transparent',
    zIndex: 0,
  },

  // ==========================================================================
  // DISPLAY DEL TIEMPO
  // ==========================================================================

  displayContainer: {
    alignItems: 'center',
    marginBottom: 25,
    zIndex: 1,
    position: 'relative',
  },

  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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

  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 5,
  },

  sparkle: {
    position: 'absolute',
    fontSize: 20,
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  sparkle1: { top: 10, left: 20 },
  sparkle2: { top: 15, right: 25 },
  sparkle3: { bottom: 20, left: 15 },
  sparkle4: { bottom: 25, right: 20 },

  secondTick: {
    position: 'absolute',
    left: -25,
    top: '50%',
    marginTop: -10,
    zIndex: 8,
  },

  tickIcon: {
    fontSize: 20,
    color: '#00E5FF',
    textShadowColor: 'rgba(0, 229, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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

  // ==========================================================================
  // BOTONES DE CONTROL
  // ==========================================================================

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    gap: 20,
    zIndex: 1,
  },

  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  playPauseButton: {
    backgroundColor: '#00C853',
  },

  resetButton: {
    backgroundColor: '#E91E63',
  },

  // ==========================================================================
  // PRESETS DE TIEMPO
  // ==========================================================================

  presetsContainer: {
    alignItems: 'center',
    zIndex: 2,
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
    backgroundColor: 'rgba(71, 85, 105, 0.9)', // Fondo gris azulado oscuro
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.8)', // Borde gris más claro
    minWidth: 75, // Tamaño base más pequeño
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    transform: [{ scale: 0.9 }], // Escala reducida cuando no está activo
  },

  // Estilo cuando no hay ningún preset activo (todos normales)
  presetButtonNormal: {
    transform: [{ scale: 1.0 }], // Tamaño normal cuando no hay activo
    minWidth: 85,
  },

  presetButtonActive: {
    backgroundColor: '#7C4DFF', // Morado brillante para el activo
    borderColor: '#5E35B1',
    borderWidth: 3,
    transform: [{ scale: 1.2 }], // Escala más grande para el activo
    shadowOpacity: 0.5,
    elevation: 8,
    minWidth: 100, // Ancho mayor para el activo
  },

  presetButtonDisabled: {
    backgroundColor: 'rgba(45, 55, 72, 0.8)', // Fondo más oscuro
    borderColor: 'rgba(45, 55, 72, 0.9)',
    opacity: 0.9, // Menos transparencia
    // Sombra más sutil para botones desactivados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  presetTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  presetButtonNumber: {
    color: '#ffffff',
    fontSize: 16, // Tamaño base más pequeño
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonNumberActive: {
    color: '#ffffff',
    fontSize: 22, // Tamaño más grande para el activo
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    lineHeight: 24,
  },

  presetButtonNumberDisabled: {
    color: 'rgba(255, 255, 255, 0.85)', // Texto más visible
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Sombra para mayor contraste
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonUnit: {
    color: '#ffffff',
    fontSize: 10, // Tamaño base más pequeño para unidades
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 11,
    marginTop: -2,
    opacity: 0.9,
  },

  presetButtonUnitActive: {
    color: '#ffffff',
    fontSize: 13, // Tamaño más grande para unidad activa
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 14,
  },

  presetButtonUnitDisabled: {
    color: 'rgba(255, 255, 255, 0.75)', // Texto más visible
    opacity: 0.9, // Menos transparencia
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra para mayor contraste
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  // ==========================================================================
  // MODAL DE CELEBRACIÓN
  // ==========================================================================

  celebrationModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  celebrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFD700',
  },

  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  trophyIcon: {
    fontSize: 80,
    textAlign: 'center',
  },

  numberOne: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B6B',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  celebrationTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },

  celebrationSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A47',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  medallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
  },

  medal: {
    fontSize: 40,
    marginHorizontal: 10,
  },

  celebrationSparkleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    width: 250,
  },

  celebrationSparkle: {
    fontSize: 30,
    marginHorizontal: 5,
  },

  celebrationButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#45B7D1',
  },

  celebrationButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

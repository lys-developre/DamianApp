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
  // CONTENEDOR PRINCIPAL
  // ==========================================================================

  container: {
    backgroundColor: '#1A237E', // Azul noche profundo
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },

  // ==========================================================================
  // FONDO DE PROGRESO VISUAL
  // ==========================================================================

  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(138, 43, 226, 0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 0,
    overflow: 'hidden',
  },

  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(147, 51, 234, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // ==========================================================================
  // HEADER Y TÍTULO PRINCIPAL
  // ==========================================================================

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingVertical: 25,
    paddingHorizontal: 15,
    zIndex: 1,
    minHeight: 80,
  },

  motivationalFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: 'rgba(0, 229, 255, 0.9)',
    paddingVertical: 28,
    paddingHorizontal: 32,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 15,
    minWidth: '90%',
    maxWidth: '98%',
    minHeight: 88,
    overflow: 'hidden',
    position: 'relative',
    backdropFilter: 'blur(10px)',
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#1A237E',
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 42,
    maxWidth: '100%',
    minHeight: 44,
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginBottom: 2,
    paddingHorizontal: 5,
  },

  motivationalFrameGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    opacity: 0.7,
    zIndex: 1,
  },

  motivationalFrameInnerBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 2,
  },

  headerTitleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    backgroundColor: 'rgba(26, 35, 126, 0.03)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  presetButtonActive: {
    backgroundColor: '#7C4DFF',
    borderColor: '#673AB7',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
    elevation: 6,
    minWidth: 90,
  },

  presetButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },

  presetTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  presetButtonNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonNumberActive: {
    color: '#ffffff',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  presetButtonNumberDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'transparent',
  },

  presetButtonUnit: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 12,
    marginTop: -2,
    opacity: 0.9,
  },

  presetButtonUnitActive: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonUnitDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.6,
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

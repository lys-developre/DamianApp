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
    borderRadius: 24, // Estandarizado con otros componentes
    padding: 20, // Estandarizado con otros componentes
    marginBottom: 20, // Estandarizado con otros componentes
    marginHorizontal: 8, // Estandarizado con otros componentes
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Borde sutil
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 8 }, // Estandarizado con otros componentes
    shadowOpacity: 0.25,
    shadowRadius: 24, // Estandarizado con otros componentes
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
    borderRadius: 24, // Estandarizado con otros componentes
    zIndex: 0,
  },

  // Borde interno para mayor definición
  innerGlassBorder: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 23, // Estandarizado con otros componentes
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
    marginBottom: 27, // 10% más pequeño (30 * 0.9)
    paddingVertical: 18, // 10% más pequeño (20 * 0.9)
    paddingHorizontal: 18, // 10% más pequeño (20 * 0.9)
    zIndex: 1,
    // El header ocupa más espacio para pictograma - 150% más alto
    height: 270, // 150% más alto que los 120 originales (120 * 2.5 = 300, pero ajustado para balance)
  },

  motivationalFrame: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fondo oscuro tipo semáforo
    borderRadius: 18, // 10% más pequeño (20 * 0.9)
    borderWidth: 4,
    borderColor: '#2D3748', // Marco grueso como semáforo real
    paddingVertical: 20, // 10% más pequeño (22 * 0.9)
    paddingHorizontal: 23, // 10% más pequeño (26 * 0.9)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 }, // 10% más pequeño (8 * 0.9)
    shadowOpacity: 0.3,
    shadowRadius: 14, // 10% más pequeño (15 * 0.9)
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
    // Ajustes para ocupar todo el header cuando sea necesario
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 25, // 10% más pequeño (28 * 0.9)
    fontWeight: '700',
    fontFamily: 'System',
    color: '#F7FAFC', // Texto blanco por defecto para contraste
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 32, // 10% más pequeño (36 * 0.9)
    maxWidth: '100%',
    paddingHorizontal: 7, // 10% más pequeño (8 * 0.9)
    paddingVertical: 7, // 10% más pequeño (8 * 0.9)
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

  // ==========================================================================
  // ESTILOS PARA PICTOGRAMA DE ESPERAR - VERSIÓN COMPACTA (20-25% del espacio)
  // ==========================================================================

  // Sección del pictograma - Ocupa el 100% del header
  pictogramSection: {
    height: '100%', // Ocupa todo el alto del header (25% del timer total)
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative', // Para posicionamiento absoluto del texto
  },

  // Frame específico para el pictograma - Ocupa todo el header aumentado
  pictogramFrame: {
    backgroundColor: 'rgba(30, 30, 30, 0.85)', // Fondo más transparente
    borderRadius: 18, // Igual que el motivationalFrame para consistencia
    borderWidth: 2, // Borde más fino
    borderColor: '#2D3748',
    paddingVertical: 0, // Sin padding vertical para ocupar todo el espacio
    paddingHorizontal: 0, // Sin padding horizontal para ocupar todo el espacio
    marginHorizontal: 0, // Sin margen para ocupar todo el ancho
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Sombra más pronunciada para la altura extra
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    width: '100%', // Ocupa todo el ancho del header
    height: '100%', // Ocupa toda la altura del header aumentada
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end', // Alinea el contenido hacia abajo para el texto
  },

  // Glow para el frame del pictograma
  pictogramFrameGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18, // Igual que el pictogramFrame
    backgroundColor: 'rgba(100, 181, 246, 0.15)',
    opacity: 0.6,
    zIndex: 1,
  },

  // Contenedor del pictograma - Ahora ocupa todo el espacio
  pictogramCompactContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },

  // Imagen del pictograma - Ocupa todo el fondo con mejor resolución
  pictogramCompactImage: {
    width: '100%', // Ocupa todo el ancho
    height: '100%', // Ocupa toda la altura aumentada
    position: 'absolute', // Posición absoluta como fondo
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
    borderRadius: 16, // Mantiene consistencia visual
    // Mantener la imagen clara y completa en el espacio aumentado
  },

  // Texto del pictograma - Superpuesto en la parte inferior con mejor visibilidad
  pictogramCompactText: {
    fontSize: 28, // Tamaño más grande para la altura aumentada
    fontWeight: '800', // Más bold para mejor visibilidad
    fontFamily: 'System',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 34,
    textShadowColor: 'rgba(0, 0, 0, 0.95)', // Sombra más intensa para contraste
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    zIndex: 15,
    position: 'absolute', // Posición absoluta sobre la imagen
    bottom: 20, // Un poco más arriba para mejor posicionamiento
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10, // Más padding vertical para el tamaño aumentado
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo más opaco para legibilidad
    borderRadius: 12, // Radio más grande
    marginHorizontal: 20, // Margen lateral para que no toque los bordes
  },

  // Estilos antiguos del pictograma (mantenidos para compatibilidad)
  headerTitleWaiting: {
    color: '#FFFFFF', // Blanco para contraste sobre imagen
    fontWeight: '800', // Más bold para visibilidad
    fontSize: 25, // 10% más pequeño (28 * 0.9)
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Sombra oscura para contraste
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 32, // 10% más pequeño (36 * 0.9)
    position: 'absolute', // Posición absoluta sobre la imagen
    bottom: 10, // En la parte inferior
    left: 0,
    right: 0,
    zIndex: 20, // Por encima de la imagen
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  pictogramContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 18, // 10% más pequeño
    minHeight: 126, // 10% más pequeño (140 * 0.9)
    width: '100%',
    position: 'relative', // Para posicionar texto sobre imagen
  },

  pictogramImage: {
    width: '100%', // Ocupa todo el ancho del contenedor
    height: '100%', // Ocupa toda la altura del contenedor
    position: 'absolute', // Posición absoluta para que el texto vaya encima
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
    borderRadius: 16, // Mantiene el radio del motivationalFrame
    // Sombra sutil para la imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
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
    marginBottom: 23, // 10% más pequeño (25 * 0.9)
    zIndex: 1,
    position: 'relative',
  },

  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeDisplay: {
    fontSize: 47, // 10% más pequeño (52 * 0.9)
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 16, // 10% más pequeño (18 * 0.9)
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
    marginBottom: 23, // 10% más pequeño (25 * 0.9)
    gap: 18, // 10% más pequeño (20 * 0.9)
    zIndex: 1,
  },

  controlButton: {
    width: 63, // 10% más pequeño (70 * 0.9)
    height: 63, // 10% más pequeño (70 * 0.9)
    borderRadius: 32, // 10% más pequeño (35 * 0.9)
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
    fontSize: 18, // 10% más pequeño (20 * 0.9)
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 18, // 10% más pequeño (20 * 0.9)
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
    gap: 7, // 10% más pequeño (8 * 0.9)
    maxWidth: '100%',
  },

  presetButton: {
    backgroundColor: 'rgba(71, 85, 105, 0.9)', // Fondo gris azulado oscuro
    paddingHorizontal: 13, // 10% más pequeño (14 * 0.9)
    paddingVertical: 9, // 10% más pequeño (10 * 0.9)
    borderRadius: 20, // 10% más pequeño (22 * 0.9)
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.8)', // Borde gris más claro
    minWidth: 68, // 10% más pequeño (75 * 0.9)
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
    minWidth: 77, // 10% más pequeño (85 * 0.9)
  },

  presetButtonActive: {
    backgroundColor: '#7C4DFF', // Morado brillante para el activo
    borderColor: '#5E35B1',
    borderWidth: 3,
    transform: [{ scale: 1.2 }], // Escala más grande para el activo
    shadowOpacity: 0.5,
    elevation: 8,
    minWidth: 90, // 10% más pequeño (100 * 0.9)
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

  // ==========================================================================
  // BOTÓN DE CERRAR
  // ==========================================================================

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

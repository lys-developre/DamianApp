import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente DigitalTimer - "Yo tengo paciencia"
 *
 * Temporizador digital personalizado diseñado específicamente para terapia de autismo,
 * enfocado en el desarrollo de la paciencia y autoafirmación personal.
 *
 * CARACTERÍSTICAS PRINCIPALES:
 * - Mensaje de autoafirmación en primera persona para empoderamiento
 * - Refuerzo positivo continuo de la autoestima
 * - Display digital grande y de alto contraste para mejor legibilidad
 * - Botones de control accesibles con iconografía clara
 * - Presets de tiempo predefinidos para diferentes actividades terapéuticas
 * - Indicadores visuales de estado del temporizador
 * - Feedback visual progresivo que llena el contenedor de abajo hacia arriba
 * - Íconos de corazón dorado para refuerzo emocional positivo
 * - Mensajes de felicitación personalizados al completar el tiempo
 *
 * ENFOQUE TERAPÉUTICO:
 * - Ayuda a desarrollar la capacidad de espera
 * - Fortalece la autoestima través de autoafirmaciones
 * - Proporciona estructura visual clara y predecible
 * - Celebra los logros con refuerzo positivo
 *
 * @component
 * @example
 * // Uso básico en una pantalla principal
 * <DigitalTimer />
 *
 * @author Desarrollado para Damián - App de apoyo terapéutico
 * @version 1.0.0
 * @since 2025-06-27
 */
export default function DigitalTimer() {
  // ============================================================================
  // ESTADO DEL COMPONENTE
  // ============================================================================

  /** @type {number} Tiempo restante en el temporizador (en segundos) */
  const [time, setTime] = useState(0);

  /** @type {boolean} Indica si el temporizador está actualmente en ejecución */
  const [isRunning, setIsRunning] = useState(false);

  /** @type {number} Tiempo inicial configurado para el temporizador (en segundos) */
  const [initialTime, setInitialTime] = useState(0);

  /** @type {number|null} Índice del preset de tiempo actualmente seleccionado */
  const [activePresetIndex, setActivePresetIndex] = useState(null);

  /** @type {React.MutableRefObject} Referencia al intervalo del temporizador para limpieza */
  const intervalRef = useRef(null);

  // ============================================================================
  // CONFIGURACIÓN DE PRESETS
  // ============================================================================

  /**
   * Presets de tiempo predefinidos para diferentes actividades terapéuticas
   *
   * Cada preset está diseñado para diferentes tipos de actividades:
   * - Tiempos cortos (1-5 min): Actividades de concentración, respiración
   * - Tiempos medios (10-30 min): Tareas escolares, actividades creativas
   * - Tiempos largos (1-2 horas): Períodos de descanso, actividades prolongadas
   *
   * @type {Array<{label: string, seconds: number}>}
   */
  const timePresets = [
    { label: '1 minuto', seconds: 60 }, // Ejercicios de respiración
    { label: '2 minutos', seconds: 120 }, // Actividades de mindfulness
    { label: '5 minutos', seconds: 300 }, // Descansos cortos
    { label: '10 minutos', seconds: 600 }, // Tareas escolares básicas
    { label: '15 minutos', seconds: 900 }, // Actividades creativas
    { label: '30 minutos', seconds: 1800 }, // Sesiones de trabajo
    { label: '1 hora', seconds: 3600 }, // Tiempo de estudio
    { label: '2 horas', seconds: 7200 }, // Actividades prolongadas
  ];

  // ============================================================================
  // EFECTOS Y LÓGICA DEL TEMPORIZADOR
  // ============================================================================

  /**
   * Efecto principal para manejar el countdown del temporizador
   *
   * FUNCIONALIDADES:
   * - Ejecuta el countdown cada segundo cuando el temporizador está activo
   * - Detiene automáticamente el temporizador cuando llega a 0
   * - Muestra mensaje de felicitación al completar el tiempo
   * - Limpia el intervalo para prevenir memory leaks
   *
   * DEPENDENCIAS:
   * - isRunning: Controla si el temporizador debe ejecutarse
   * - time: Tiempo actual para determinar cuándo parar
   *
   * @effect
   * @dependency {boolean} isRunning - Estado de ejecución del temporizador
   * @dependency {number} time - Tiempo restante en segundos
   */
  useEffect(() => {
    // Solo ejecutar el countdown si el temporizador está corriendo y hay tiempo restante
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          // Cuando el tiempo llega a 1 segundo o menos, finalizar
          if (prevTime <= 1) {
            setIsRunning(false);
            // Mostrar mensaje de felicitación personalizado
            Alert.alert(
              '¡Muy bien!',
              'Has esperado con paciencia. ¡Excelente trabajo!',
              [{ text: 'Gracias', style: 'default' }]
            );
            return 0;
          }
          // Decrementar el tiempo en 1 segundo
          return prevTime - 1;
        });
      }, 1000); // Ejecutar cada 1000ms (1 segundo)
    } else if (intervalRef.current) {
      // Limpiar el intervalo si el temporizador no está corriendo
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Función de limpieza para prevenir memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  /**
   * Convierte segundos a formato de tiempo legible HH:MM:SS
   *
   * PROPÓSITO:
   * - Proporciona una visualización consistente del tiempo
   * - Facilita la comprensión del tiempo restante
   * - Mantiene formato estándar independientemente de la duración
   *
   * FORMATO DE SALIDA:
   * - Siempre muestra horas, minutos y segundos (HH:MM:SS)
   * - Añade ceros a la izquierda para mantener consistencia visual
   * - Ejemplos: "00:05:30", "01:15:45", "02:00:00"
   *
   * @param {number} seconds - Tiempo en segundos a convertir
   * @returns {string} Tiempo formateado como "HH:MM:SS"
   *
   * @example
   * formatTime(90) // returns "00:01:30"
   * formatTime(3661) // returns "01:01:01"
   */
  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600); // Calcular horas completas
    const minutes = Math.floor((seconds % 3600) / 60); // Calcular minutos restantes
    const secs = seconds % 60; // Calcular segundos restantes

    // Formatear con ceros a la izquierda para consistencia visual
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // FUNCIONES DE CONTROL DEL TEMPORIZADOR
  // ============================================================================

  /**
   * Alterna entre iniciar y pausar el temporizador
   *
   * VALIDACIONES:
   * - Verifica que haya tiempo configurado antes de iniciar
   * - Muestra alerta educativa si no hay tiempo seleccionado
   *
   * COMPORTAMIENTO:
   * - Si está parado y hay tiempo: inicia el temporizador
   * - Si está corriendo: pausa el temporizador
   * - Si no hay tiempo: muestra mensaje instructivo
   *
   * @function
   * @name toggleTimer
   * @fires Alert - Cuando no hay tiempo configurado
   */
  const toggleTimer = () => {
    // Validar que hay tiempo configurado antes de iniciar
    if (time === 0 && !isRunning) {
      Alert.alert(
        'Sin tiempo configurado',
        'Por favor, selecciona un tiempo para el temporizador.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    // Alternar estado de ejecución
    setIsRunning(!isRunning);
  };

  /**
   * Reinicia el temporizador a su estado inicial
   *
   * ACCIONES REALIZADAS:
   * - Detiene el temporizador si está corriendo
   * - Restaura el tiempo al valor inicial configurado
   * - Limpia la selección de preset activo
   *
   * CASOS DE USO:
   * - Reiniciar un temporizador pausado
   * - Volver a ejecutar el mismo tiempo
   * - Cancelar un temporizador en progreso
   *
   * @function
   * @name resetTimer
   */
  const resetTimer = () => {
    setIsRunning(false); // Detener temporizador
    setTime(initialTime); // Restaurar tiempo inicial
    setActivePresetIndex(null); // Limpiar selección de preset
  };

  /**
   * Configura un nuevo tiempo usando un preset predefinido
   *
   * ACCIONES REALIZADAS:
   * - Detiene cualquier temporizador en ejecución
   * - Establece el nuevo tiempo seleccionado
   * - Guarda el tiempo inicial para funciones de reset
   * - Marca el preset como activo visualmente
   *
   * PARÁMETROS:
   * @param {number} seconds - Tiempo en segundos del preset seleccionado
   * @param {number} index - Índice del preset en el array para tracking visual
   *
   * @function
   * @name setPresetTime
   */
  const setPresetTime = (seconds, index) => {
    setIsRunning(false); // Asegurar que el temporizador esté detenido
    setTime(seconds); // Establecer el nuevo tiempo
    setInitialTime(seconds); // Guardar para funciones de reset
    setActivePresetIndex(index); // Marcar preset como activo
  };

  // ============================================================================
  // FUNCIONES DE CÁLCULO Y UTILIDADES
  // ============================================================================

  /**
   * Calcula el porcentaje de progreso del temporizador actual
   *
   * PROPÓSITO:
   * - Proporciona valor para la visualización del progreso de fondo
   * - Permite mostrar gráficamente cuánto tiempo ha transcurrido
   *
   * CÁLCULO:
   * - Porcentaje = (tiempo transcurrido / tiempo total) * 100
   * - Tiempo transcurrido = tiempo inicial - tiempo restante
   *
   * CASOS ESPECIALES:
   * - Si no hay tiempo inicial configurado: retorna 0%
   * - El resultado se usa para la altura del fondo de progreso verde
   *
   * @returns {number} Porcentaje de progreso (0-100)
   *
   * @example
   * // Con 5 minutos inicial y 2 minutos restantes
   * getProgress() // returns 60 (60% completado)
   */
  const getProgress = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  // ============================================================================
  // FUNCIONES DE RENDERIZADO
  // ============================================================================

  /**
   * Renderiza el texto de los botones preset con formato especializado
   *
   * DISEÑO VISUAL:
   * - Separa el número de la unidad de tiempo para mejor legibilidad
   * - Aplica estilos diferentes al número (más grande) y unidad (más pequeña)
   * - Adapta estilos según el estado: activo, deshabilitado, normal
   *
   * ACCESIBILIDAD:
   * - Mejora la comprensión visual del tiempo
   * - Destaca el número para reconocimiento rápido
   * - Mantiene consistencia en todos los estados
   *
   * @param {string} label - Etiqueta del preset (ej: "5 minutos")
   * @param {boolean} isActive - Si este preset está actualmente seleccionado
   * @param {boolean} isDisabled - Si este preset está deshabilitado
   * @returns {JSX.Element} Componente con texto formateado
   *
   * @example
   * renderPresetText("5 minutos", true, false)
   * // Renderiza "5" en grande y "minutos" en pequeño con estilos activos
   */
  const renderPresetText = (label, isActive, isDisabled) => {
    // Separar número y unidad para estilizado diferencial
    const parts = label.split(' ');
    const number = parts[0]; // "5", "1", "30", etc.
    const unit = parts.slice(1).join(' '); // "minuto", "minutos", "hora", "horas"

    return (
      <View style={styles.presetTextContainer}>
        {/* Número destacado */}
        <Text
          style={[
            styles.presetButtonNumber,
            isActive && styles.presetButtonNumberActive,
            isDisabled && styles.presetButtonNumberDisabled,
          ]}
        >
          {number}
        </Text>
        {/* Unidad de tiempo */}
        <Text
          style={[
            styles.presetButtonUnit,
            isActive && styles.presetButtonUnitActive,
            isDisabled && styles.presetButtonUnitDisabled,
          ]}
        >
          {unit}
        </Text>
      </View>
    );
  };

  // ============================================================================
  // RENDER PRINCIPAL DEL COMPONENTE
  // ============================================================================

  return (
    <View style={styles.container}>
      {/* 
        FONDO DE PROGRESO VISUAL
        - Se posiciona de forma absoluta para llenar el contenedor de abajo hacia arriba
        - La altura se calcula dinámicamente basada en el progreso del temporizador
        - Color verde translúcido para no interferir con la legibilidad del contenido
        - Z-index 0 para mantenerse detrás de todos los demás elementos
      */}
      <View
        style={[styles.progressBackground, { height: `${getProgress()}%` }]}
      />

      {/* 
        HEADER CON MENSAJE DE AUTOAFIRMACIÓN
        - Corazones dorados a ambos lados para refuerzo emocional positivo
        - Mensaje central "Yo tengo paciencia" en primera persona para empoderamiento
        - Z-index elevado para mantenerse visible sobre el fondo de progreso
      */}
      <View style={styles.header}>
        <MaterialIcons name="favorite" size={32} color="#FFD700" />
        <Text style={styles.headerTitle}>Yo tengo paciencia</Text>
        <MaterialIcons name="favorite" size={32} color="#FFD700" />
      </View>

      {/* 
        DISPLAY PRINCIPAL DEL TIEMPO
        - Muestra el tiempo en formato HH:MM:SS con fuente monospace para alineación
        - Incluye indicador de estado visual con círculo de color
        - Texto descriptivo del estado actual del temporizador
      */}
      <View style={styles.displayContainer}>
        <Text style={styles.timeDisplay}>{formatTime(time)}</Text>

        {/* Indicador de estado con círculo de color y texto descriptivo */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isRunning ? '#48bb78' : '#e53e3e' },
            ]}
          />
          <Text style={styles.statusText}>
            {isRunning ? 'Esperando...' : time > 0 ? 'Pausado' : 'Detenido'}
          </Text>
        </View>
      </View>

      {/* 
        BOTONES DE CONTROL PRINCIPAL
        - Play/Pausa: Inicia o detiene el temporizador
        - Reset/Stop: Reinicia el temporizador al tiempo inicial
        - Iconografía universal para facilitar el reconocimiento
        - Colores diferenciados: verde para iniciar, rojo para detener
      */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playPauseButton]}
          onPress={toggleTimer}
          activeOpacity={0.8}
          accessibilityLabel={
            isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'
          }
        >
          <MaterialIcons
            name={isRunning ? 'pause' : 'play-arrow'}
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
          activeOpacity={0.8}
          accessibilityLabel="Reiniciar temporizador"
        >
          <MaterialIcons name="stop" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 
        PRESETS DE TIEMPO
        - Botones predefinidos para diferentes duraciones de actividades
        - Diseño adaptativo que resalta el preset actualmente seleccionado
        - Deshabilitación visual de opciones no disponibles durante ejecución
        - Organización en grid responsive para diferentes tamaños de pantalla
      */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Cuánto esperar:</Text>
        <View style={styles.presetsGrid}>
          {timePresets.map((preset, index) => {
            const isActive = activePresetIndex === index;
            const isDisabled =
              activePresetIndex !== null && activePresetIndex !== index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  isActive && styles.presetButtonActive,
                  isDisabled && styles.presetButtonDisabled,
                ]}
                onPress={() => setPresetTime(preset.seconds, index)}
                activeOpacity={isDisabled ? 1 : 0.8}
                disabled={isDisabled}
                accessibilityLabel={`Configurar temporizador a ${preset.label}`}
              >
                {renderPresetText(preset.label, isActive, isDisabled)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/**
 * ============================================================================
 * ESTILOS DEL COMPONENTE DIGITALTIMER
 * ============================================================================
 *
 * Diseño centrado en accesibilidad y experiencia terapéutica:
 * - Colores de alto contraste para mejor visibilidad
 * - Espaciado generoso para facilitar la interacción táctil
 * - Jerarquía visual clara con diferentes tamaños de fuente
 * - Efectos de sombra para profundidad y definición
 * - Responsive design para diferentes tamaños de pantalla
 *
 * PALETA DE COLORES:
 * - Morado principal (#764BA2): Color base relajante y profesional
 * - Verde (#48bb78, #81C784): Estados activos y progreso positivo
 * - Rojo (#e53e3e): Estados de pausa/detención
 * - Dorado (#FFD700): Elementos de refuerzo positivo (corazones)
 * - Blanco con transparencias: Elementos secundarios y overlays
 */
const styles = StyleSheet.create({
  // ==========================================================================
  // CONTENEDOR PRINCIPAL
  // ==========================================================================

  /**
   * Estilo del contenedor principal del temporizador
   *
   * CARACTERÍSTICAS:
   * - Fondo morado relajante apropiado para terapia
   * - Bordes redondeados para apariencia amigable
   * - Sombra elevada para destacar del fondo
   * - Overflow hidden para contener el progreso visual
   * - Position relative para permitir elementos absolutos internos
   */
  container: {
    backgroundColor: '#764BA2', // Morado base terapéutico
    borderRadius: 20, // Esquinas suaves y amigables
    padding: 20, // Espaciado interno generoso
    marginBottom: 20, // Separación de otros componentes
    shadowColor: '#000', // Sombra para profundidad
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Sombra en Android
    position: 'relative', // Para elementos absolutamente posicionados
    overflow: 'hidden', // Contiene el fondo de progreso
  },

  // ==========================================================================
  // FONDO DE PROGRESO VISUAL
  // ==========================================================================

  /**
   * Fondo de progreso que se llena de abajo hacia arriba
   *
   * FUNCIONALIDAD:
   * - Se posiciona absolutamente en la parte inferior
   * - Altura dinámica basada en el progreso del temporizador
   * - Color verde translúcido para no interferir con el contenido
   * - Solo esquinas inferiores redondeadas para mejor ajuste
   */
  progressBackground: {
    position: 'absolute', // Posicionamiento absoluto
    bottom: 0, // Anclado en la parte inferior
    left: 0, // Ocupa todo el ancho
    right: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.3)', // Verde translúcido
    borderBottomLeftRadius: 20, // Solo esquinas inferiores
    borderBottomRightRadius: 20,
    zIndex: 0, // Detrás de todo el contenido
  },

  // ==========================================================================
  // HEADER Y TÍTULO PRINCIPAL
  // ==========================================================================

  /**
   * Contenedor del header con mensaje de autoafirmación
   *
   * DISEÑO:
   * - Layout horizontal con corazones a los lados
   * - Centrado para máximo impacto visual
   * - Espaciado generoso para respiración visual
   * - Z-index elevado para visibilidad sobre progreso
   */
  header: {
    flexDirection: 'row', // Diseño horizontal
    alignItems: 'center', // Alineación vertical centrada
    justifyContent: 'center', // Centrado horizontal
    marginBottom: 30, // Espaciado inferior
    paddingVertical: 15, // Espaciado vertical interno
    paddingHorizontal: 15, // Espaciado horizontal interno
    gap: 12, // Espaciado entre elementos
    zIndex: 1, // Sobre el fondo de progreso
  },

  /**
   * Título principal del temporizador
   *
   * TIPOGRAFÍA:
   * - Tamaño grande para jerarquía visual
   * - Peso bold para destacar importancia
   * - Sombra de texto para legibilidad
   * - Color blanco puro para máximo contraste
   */
  headerTitle: {
    fontSize: 24, // Tamaño prominente
    fontWeight: 'bold', // Peso fuerte
    color: '#ffffff', // Blanco puro
    textAlign: 'center', // Centrado
    letterSpacing: 1, // Espaciado entre letras
    lineHeight: 28, // Altura de línea
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra de texto
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    flexShrink: 1, // Permite contracción si es necesario
  },

  // ==========================================================================
  // DISPLAY DEL TIEMPO
  // ==========================================================================

  /**
   * Contenedor del display principal de tiempo
   *
   * LAYOUT:
   * - Centrado para foco principal
   * - Z-index elevado para visibilidad
   * - Espaciado inferior para separación
   */
  displayContainer: {
    alignItems: 'center', // Centrado horizontal
    marginBottom: 25, // Espaciado inferior
    zIndex: 1, // Sobre el fondo de progreso
  },

  /**
   * Display digital del tiempo
   *
   * TIPOGRAFÍA ESPECIALIZADA:
   * - Fuente monospace para alineación perfecta
   * - Tamaño muy grande para máxima legibilidad
   * - Espaciado entre caracteres para claridad
   * - Sombra de texto para profundidad
   */
  timeDisplay: {
    fontSize: 52, // Tamaño muy prominente
    fontWeight: 'bold', // Peso fuerte
    color: '#ffffff', // Blanco puro
    fontFamily: 'monospace', // Fuente monoespaciada
    textAlign: 'center', // Centrado
    marginBottom: 18, // Espaciado inferior
    letterSpacing: 2, // Espaciado entre caracteres
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Sombra suave
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  // ==========================================================================
  // INDICADORES DE ESTADO
  // ==========================================================================

  /**
   * Contenedor del indicador de estado
   *
   * LAYOUT:
   * - Disposición horizontal para círculo + texto
   * - Alineación centrada verticalmente
   */
  statusContainer: {
    flexDirection: 'row', // Círculo y texto en línea
    alignItems: 'center', // Alineación vertical centrada
  },

  /**
   * Círculo indicador de estado
   *
   * VISUAL:
   * - Pequeño círculo que cambia de color según el estado
   * - Verde cuando está corriendo, rojo cuando está parado
   * - Forma circular perfecta con border-radius 50%
   */
  statusIndicator: {
    width: 12, // Tamaño compacto
    height: 12,
    borderRadius: 6, // Círculo perfecto (50% del width/height)
    marginRight: 8, // Espaciado del texto
  },

  /**
   * Texto descriptivo del estado
   *
   * TIPOGRAFÍA:
   * - Tamaño mediano para información secundaria
   * - Peso semibold para legibilidad
   * - Sombra sutil para definición
   */
  statusText: {
    fontSize: 16, // Tamaño mediano
    color: '#ffffff', // Blanco puro
    fontWeight: '600', // Peso semibold
    letterSpacing: 0.3, // Espaciado sutil entre letras
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra suave
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ==========================================================================
  // CONTROLES PRINCIPALES
  // ==========================================================================

  /**
   * Contenedor de botones de control
   *
   * LAYOUT:
   * - Disposición horizontal centrada
   * - Espaciado uniforme entre botones
   * - Z-index elevado para interacción garantizada
   */
  controlsContainer: {
    flexDirection: 'row', // Botones en línea horizontal
    justifyContent: 'center', // Centrado horizontal
    alignItems: 'center', // Alineación vertical centrada
    marginBottom: 25, // Espaciado inferior
    gap: 20, // Espaciado entre botones
    zIndex: 1, // Sobre el fondo de progreso
  },

  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  playPauseButton: {
    backgroundColor: '#48bb78',
  },

  resetButton: {
    backgroundColor: '#e53e3e',
  },

  presetsContainer: {
    alignItems: 'center',
    zIndex: 2, // Más alto que otros elementos
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Menos transparente
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Borde más visible
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  presetButtonActive: {
    backgroundColor: '#81C784', // Verde claro
    borderColor: '#66BB6A',
    transform: [{ scale: 1.1 }], // Aumenta el tamaño
    shadowOpacity: 0.4,
    elevation: 6,
    minWidth: 90,
  },

  presetButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Menos transparente
    borderColor: 'rgba(255, 255, 255, 0.3)', // Borde más visible
    opacity: 0.6, // Reducir la opacidad general en lugar de hacer el fondo más transparente
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
});

/**
 * ============================================================================
 * NOTAS TÉCNICAS Y DE IMPLEMENTACIÓN
 * ============================================================================
 *
 * OPTIMIZACIONES APLICADAS:
 * - useEffect con dependencias específicas para evitar re-renders innecesarios
 * - Cleanup del interval en el useEffect para prevenir memory leaks
 * - Z-index estratégico para superposición correcta de elementos
 * - Border-radius selectivo en el progreso para mejor integración visual
 *
 * ACCESIBILIDAD:
 * - Labels descriptivos en todos los elementos interactivos
 * - Contraste de colores cumple con estándares WCAG 2.1
 * - Tamaños de texto apropiados para lectura fácil
 * - Espaciado táctil adecuado para interacción móvil
 *
 * COMPATIBILIDAD:
 * - Optimizado para Android y iOS
 * - Responsive design para diferentes tamaños de pantalla
 * - Degradación elegante en dispositivos menos potentes
 * - Compatible con screen readers y tecnologías asistivas
 *
 * MANTENIMIENTO:
 * - Código modular con funciones separadas por responsabilidad
 * - Comentarios exhaustivos para facilitar modificaciones futuras
 * - Constantes de tiempo configurables en el array timePresets
 * - Estilos organizados por secciones lógicas
 */

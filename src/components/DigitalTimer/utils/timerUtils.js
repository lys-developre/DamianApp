/**
 * Utilidades para formateo y cálculos del temporizador
 *
 * FUNCIONES:
 * - Formateo de tiempo a HH:MM:SS
 * - Cálculo de progreso y colores dinámicos
 * - Utilidades de renderizado
 *
 * @author Damian App
 * @version 1.0.0
 */

/**
 * Convierte segundos a formato de tiempo legible HH:MM:SS
 *
 * @param {number} seconds - Tiempo en segundos a convertir
 * @returns {string} Tiempo formateado como "HH:MM:SS"
 *
 * @example
 * formatTime(90) // returns "00:01:30"
 * formatTime(3661) // returns "01:01:01"
 */
export const formatTime = seconds => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calcula el porcentaje de progreso del temporizador
 *
 * @param {number} initialTime - Tiempo inicial en segundos
 * @param {number} currentTime - Tiempo restante en segundos
 * @returns {number} Porcentaje de progreso (0-100)
 */
export const calculateProgress = (initialTime, currentTime) => {
  if (initialTime === 0) return 0;
  if (currentTime === 0) return 100;

  const progress = ((initialTime - currentTime) / initialTime) * 100;
  return Math.min(Math.round(progress * 100) / 100, 100);
};

/**
 * Calcula el color de fondo dinámico basado en el progreso
 * SISTEMA SEMÁFORO: Rojo → Amarillo → Verde
 *
 * @param {number} progress - Progreso actual (0-100)
 * @returns {string} Color RGB con opacidad
 */
export const getProgressColor = progress => {
  let rgbColor;

  if (progress < 35) {
    rgbColor = '220, 38, 38'; // Rojo - Empezando (como semáforo en rojo)
  } else if (progress < 70) {
    rgbColor = '245, 158, 11'; // Amarillo/Ámbar - Progreso medio (precaución)
  } else {
    rgbColor = '34, 197, 94'; // Verde - Casi terminando (semáforo en verde)
  }

  // Opacidad glass: 50%-80% para mantener transparencia pero con buena visibilidad
  const opacity = 0.5 + (progress / 100) * 0.3;
  return `rgba(${rgbColor}, ${opacity})`;
};

/**
 * Obtiene la frase motivacional apropiada según el progreso
 *
 * @param {Array} phrases - Array de frases motivacionales
 * @param {number} progress - Progreso actual (0-100)
 * @param {boolean} isRunning - Si el temporizador está corriendo
 * @param {number} initialTime - Tiempo inicial configurado
 * @returns {string} Frase motivacional apropiada
 */
export const getCurrentPhrase = (
  phrases,
  progress,
  isRunning,
  initialTime = 0
) => {
  if (!isRunning) {
    // Si hay tiempo configurado pero no está corriendo, mostrar mensaje de preparación
    if (initialTime > 0) {
      return 'Esperar';
    }
    // Si no hay tiempo configurado
    return 'Selecciona un tiempo para empezar';
  }

  const currentPhrase = phrases.find(
    phrase => progress >= phrase.minProgress && progress < phrase.maxProgress
  );

  return currentPhrase ? currentPhrase.phrase : '😌 Esperar un poquito';
};

/**
 * Renderiza el texto de preset con formato especializado
 *
 * @param {string} label - Etiqueta del preset (ej: "5 minutos")
 * @returns {Object} Objeto con número y unidad separados
 */
export const parsePresetLabel = label => {
  const parts = label.split(' ');
  return {
    number: parts[0], // "5", "1", "30", etc.
    unit: parts.slice(1).join(' '), // "minuto", "minutos", "hora", "horas"
  };
};

/**
 * Utilidades de formateo para Damian APP
 *
 * PROPÓSITO: Centralizar funciones de formateo reutilizables
 * ESCALABILIDAD: Fácil agregar nuevos formateadores sin duplicar código
 *
 * @author Damian
 * @version 1.0.0
 */

/**
 * Formatea segundos totales a formato HH:mm:ss
 *
 * TÉCNICA: Math.floor para obtener enteros + padStart para ceros a la izquierda
 * USO: Temporizadores, contadores, duración de actividades
 *
 * @param {number} totalSeconds - Segundos totales a formatear
 * @returns {string} Tiempo formateado como "HH:mm:ss"
 *
 * @example
 * formatSeconds(3661) // "01:01:01"
 * formatSeconds(90)   // "00:01:30"
 * formatSeconds(0)    // "00:00:00"
 */
export const formatSeconds = totalSeconds => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0')
  );
};

/**
 * Formatea minutos a texto legible
 *
 * @param {number} minutes - Minutos a formatear
 * @returns {string} Texto legible
 *
 * @example
 * formatMinutes(1) // "1 minuto"
 * formatMinutes(30) // "30 minutos"
 */
export const formatMinutes = minutes => {
  if (minutes === 1) return '1 minuto';
  return `${minutes} minutos`;
};

/**
 * Formatea duraciones cortas para feedback inmediato
 *
 * @param {number} seconds - Segundos a formatear
 * @returns {string} Duración formateada
 *
 * @example
 * formatDuration(30) // "30s"
 * formatDuration(90) // "1m 30s"
 */
export const formatDuration = seconds => {
  if (seconds < 60) return `${seconds}s`;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

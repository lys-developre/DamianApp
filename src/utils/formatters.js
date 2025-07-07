/**
 * Utilidades de formateo para Damian APP - Migrado a Servicios Módulo 5
 *
 * DEPRECATION NOTICE: Este archivo mantiene compatibilidad hacia atrás
 * NUEVO ENFOQUE: Usar utilsService desde src/services/ para nuevas funciones
 * MIGRACIÓN: Gradualmente mover todas las funciones a utilsService
 *
 * @author Damian
 * @version 2.0.0 - Servicios Módulo 5
 */

import { utilsService } from '../services/utilsService';

/**
 * Formatea segundos totales a formato HH:mm:ss
 *
 * @deprecated Usar utilsService.formatSeconds() en su lugar
 * @param {number} totalSeconds - Segundos totales a formatear
 * @returns {string} Tiempo formateado como "HH:mm:ss"
 */
export const formatSeconds = totalSeconds => {
  return utilsService.formatSeconds(totalSeconds);
};

/**
 * Formatea minutos a texto legible
 *
 * @deprecated Usar utilsService.formatDuration() en su lugar
 * @param {number} minutes - Minutos a formatear
 * @returns {string} Texto legible
 */
export const formatMinutes = minutes => {
  if (minutes === 1) return '1 minuto';
  return `${minutes} minutos`;
};

/**
 * Formatea duraciones cortas para feedback inmediato
 *
 * @deprecated Usar utilsService.formatDuration() en su lugar
 * @param {number} seconds - Segundos a formatear
 * @returns {string} Duración formateada
 */
export const formatDuration = seconds => {
  return utilsService.formatDuration(seconds, true);
};

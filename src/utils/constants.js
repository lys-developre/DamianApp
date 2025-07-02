/**
 * CONSTANTES COMPARTIDAS - DamianApp
 *
 * Centralización de todas las constantes utilizadas en múltiples componentes
 * para evitar duplicación y facilitar el mantenimiento.
 *
 * @author Damian App
 * @version 1.0.0
 */

// ⏰ PRESETS DE TIEMPO PARA DIGITAL TIMER
export const digitalTimerPresets = [
  { label: '1 minuto', seconds: 60 },
  { label: '2 minutos', seconds: 120 },
  { label: '5 minutos', seconds: 300 },
  { label: '10 minutos', seconds: 600 },
  { label: '15 minutos', seconds: 900 },
  { label: '30 minutos', seconds: 1800 },
  { label: '1 hora', seconds: 3600 },
];

// ⏰ PRESETS DE TIEMPO PARA TIMER IMAGE BUTTONS (Rangos más amplios)
export const imageTimerPresets = [
  { label: '15 min', seconds: 15 * 60 },
  { label: '30 min', seconds: 30 * 60 },
  { label: '1 hora', seconds: 60 * 60 },
  { label: '1 día', seconds: 24 * 60 * 60 },
  { label: '1 semana', seconds: 7 * 24 * 60 * 60 },
  { label: '1 mes', seconds: 30 * 24 * 60 * 60 },
];

// 🎵 CONFIGURACIÓN DE AUDIO Y SONIDOS
export const audioConfig = {
  volumes: {
    normal: 0.5,
    celebration: 0.7,
    notification: 0.4,
  },
  paths: {
    celebration: '../../../../assets/sounds/celebration_epic.wav',
    almostDone: '../../../../assets/sounds/almost_done.wav',
    phraseChange: '../../../../assets/sounds/phrase_change.wav',
    notification: '../../../../assets/sounds/notification_soft.wav',
  },
};

// 🎯 CONFIGURACIÓN DE PICTOGRAMAS
export const pictogramConfig = {
  defaultPictogram: {
    image: '../../../../assets/pictogramas/esperar/esperar.png',
    audio: '../../../../assets/pictogramas/esperar/esperar.mp3',
  },
};

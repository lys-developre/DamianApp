/**
 * Frases motivacionales para TEA - TEMA SEMÁFORO
 *
 * CARACTERÍSTICAS:
 * - Mensajes relacionados con el concepto de semáforo
 * - Progresión emocional: Rojo (espera) → Amarillo (prepárate) → Verde (avanza)
 * - Lenguaje claro y asociativo con tráfico/semáforos
 * - Refuerzo constante del progreso
 *
 * @author Damian App
 * @version 3.0.0 (Tema Semáforo)
 */

export const motivationalPhrases = [
  // ZONA ROJA (0-35%): Espera/Detente
  {
    minProgress: 0,
    maxProgress: 12,
    phrase: '🔴 Semáforo en rojo, esperamos',
  },
  {
    minProgress: 12,
    maxProgress: 25,
    phrase: '🔴 Debemos parar y esperar',
  },
  {
    minProgress: 25,
    maxProgress: 35,
    phrase: '🔴 Tranquilo, aún es rojo',
  },

  // ZONA AMARILLA (35-70%): Prepárate/Precaución
  {
    minProgress: 35,
    maxProgress: 45,
    phrase: '🟡 ¡Amarillo! Prepárate Damián',
  },
  {
    minProgress: 45,
    maxProgress: 55,
    phrase: '🟡 Casi cambia a verde',
  },
  {
    minProgress: 55,
    maxProgress: 70,
    phrase: '🟡 ¡Muy bien! Ya casi verde',
  },

  // ZONA VERDE (70-100%): Avanza/¡Adelante!
  {
    minProgress: 70,
    maxProgress: 80,
    phrase: '🟢 ¡Ya casi!',
  },
  {
    minProgress: 80,
    maxProgress: 90,
    phrase: '🟢 ¡Excelente progreso!',
  },
  {
    minProgress: 90,
    maxProgress: 95,
    phrase: '🟢 ¡Ya casi llegaste al final!',
  },
  {
    minProgress: 95,
    maxProgress: 100,
    phrase: '🟢 ¡Felicitaciones Damián!',
  },
];

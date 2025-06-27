/**
 * Frases motivacionales para TEA - Progresión lógica y refuerzo positivo
 *
 * FUNCIONALIDAD:
 * - Frases que cambian según el progreso del temporizador
 * - Refuerzo positivo progresivo para mantener motivación
 * - Lenguaje optimizado para usuarios con TEA
 *
 * @author Damian App
 * @version 1.0.0
 */

export const motivationalPhrases = [
  { minProgress: 0, maxProgress: 15, phrase: 'Tenemos que esperar' },
  { minProgress: 15, maxProgress: 25, phrase: 'Hay que tener paciencia' },
  { minProgress: 25, maxProgress: 35, phrase: 'Esperemos tranquilos' },
  { minProgress: 35, maxProgress: 45, phrase: 'Lo estas haciendo bien' },
  { minProgress: 45, maxProgress: 55, phrase: 'Ya queda poco' },
  { minProgress: 55, maxProgress: 65, phrase: 'Muy bien damian!' },
  { minProgress: 65, maxProgress: 75, phrase: 'Ya casi termino' },
  { minProgress: 75, maxProgress: 85, phrase: 'Falta poquito' },
  { minProgress: 85, maxProgress: 95, phrase: 'Ya casi lo logras' },
  { minProgress: 95, maxProgress: 100, phrase: '¡Ya casi casi Damian!' },
];

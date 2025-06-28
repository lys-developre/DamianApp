/**
 * Configuración de pictogramas para frases motivacionales
 *
 * ESTRUCTURA:
 * - Cada frase puede tener un pictograma asociado
 * - Incluye imagen, audio y configuración de colores
 * - Preparado para expansión futura
 *
 * @author Damian App
 * @version 1.0.0 - Estructura base
 */

export const pictogramConfig = {
  // Pictograma para estado inicial (esperar)
  esperar: {
    image: require('../../../assets/pictogramas/esperar/esperar.png'),
    audio: require('../../../assets/pictogramas/esperar/esperar.mp3'),
    textColor: '#64B5F6',
    keywords: ['esperar', 'preparate', 'listo'],
  },

  // Estructura preparada para futuras frases motivacionales
  // energia: {
  //   image: require('../../../assets/pictogramas/energia/energia.png'),
  //   audio: require('../../../assets/pictogramas/energia/energia.mp3'),
  //   textColor: '#FFD700',
  //   keywords: ['energia', 'fuerza', 'poder']
  // },

  // concentracion: {
  //   image: require('../../../assets/pictogramas/concentracion/concentracion.png'),
  //   audio: require('../../../assets/pictogramas/concentracion/concentracion.mp3'),
  //   textColor: '#00FF7F',
  //   keywords: ['concentra', 'focus', 'atencion']
  // }
};

/**
 * Función para obtener configuración de pictograma basado en frase
 * @param {string} phrase - Frase motivacional actual
 * @returns {object|null} - Configuración del pictograma o null
 */
export const getPictogramForPhrase = phrase => {
  if (!phrase) return null;

  const lowerPhrase = phrase.toLowerCase();

  // Buscar pictograma que coincida con palabras clave
  for (const [key, config] of Object.entries(pictogramConfig)) {
    if (config.keywords.some(keyword => lowerPhrase.includes(keyword))) {
      return { key, ...config };
    }
  }

  return null;
};

/**
 * Función para verificar si una frase tiene pictograma disponible
 * @param {string} phrase - Frase a verificar
 * @returns {boolean} - True si tiene pictograma disponible
 */
export const hasPictogram = phrase => {
  return getPictogramForPhrase(phrase) !== null;
};

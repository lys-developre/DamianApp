/**
 * Configuración de Prettier para Damian APP
 *
 * Este archivo define las reglas de formateo automático del código
 * Sincronizado con eslint.config.js para evitar conflictos
 *
 * @see https://prettier.io/docs/en/options.html
 * @author Damian
 * @version 1.0.0
 */

module.exports = {
  /**
   * Agregar punto y coma al final de las declaraciones
   * Mejora la legibilidad y evita errores de inserción automática
   */
  semi: true,

  /**
   * Usar comillas simples en lugar de dobles
   * Consistencia con las preferencias del proyecto
   */
  singleQuote: true,

  /**
   * Número de espacios por nivel de indentación
   * Valor estándar para proyectos React Native
   */
  tabWidth: 2,

  /**
   * Comas finales donde ES5 las permite (objetos, arrays)
   * Facilita el versionado y reduce conflictos en git
   */
  trailingComma: 'es5',

  /**
   * Longitud máxima de línea antes del salto automático
   * Equilibrio entre legibilidad y densidad de código
   */
  printWidth: 80,

  /**
   * Espacios dentro de llaves de objetos { foo }
   * Mejora la legibilidad de objetos
   */
  bracketSpacing: true,

  /**
   * Evitar paréntesis en arrow functions con un solo parámetro
   * Sintaxis más limpia: x => x en lugar de (x) => x
   */
  arrowParens: 'avoid',

  /**
   * Configuración de fin de línea usando LF (Unix)
   * Evita problemas con caracteres CR/LF en sistemas mixtos
   */
  endOfLine: 'lf',
};

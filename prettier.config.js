/**
 * Configuración de Prettier para Damian APP
 *
 * FUNCIONALIDAD: Formateo automático de código sincronizado con ESLint
 * IMPACTO: Consistency de código + reducción de conflictos en git
 *
 * @see https://prettier.io/docs/en/options.html
 * @author Damian
 * @version 1.0.0
 */

module.exports = {
  /**
   * SINTAXIS: Punto y coma obligatorio (evita ASI bugs)
   */
  semi: true,

  /**
   * COMILLAS: Simples por consistencia del proyecto
   */
  singleQuote: true,

  /**
   * INDENTACIÓN: 2 espacios (estándar React Native)
   */
  tabWidth: 2,

  /**
   * COMAS FINALES: ES5 compatible (mejor git diff)
   */
  trailingComma: 'es5',

  /**
   * LONGITUD LÍNEA: 80 caracteres (legibilidad óptima)
   */
  printWidth: 80,

  /**
   * ESPACIOS OBJETOS: { foo } vs {foo} (legibilidad)
   */
  bracketSpacing: true,

  /**
   * ARROW FUNCTIONS: x => x vs (x) => x (sintaxis limpia)
   */
  arrowParens: 'avoid',

  /**
   * FIN DE LÍNEA: LF Unix style (compatibilidad multiplataforma)
   */
  endOfLine: 'lf',
};

/**
 * Configuración de ESLint para Damian APP
 *
 * Este archivo configura ESLint para trabajar con:
 * - React Native y Expo
 * - Prettier para formateo automático
 * - Reglas de calidad de código
 * - Compatibilidad con la nueva configuración flat de ESLint 9
 *
 * @see https://docs.expo.dev/guides/using-eslint/
 * @author Damian
 * @version 1.0.0
 */

// Importación de dependencias necesarias
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * Configuración principal de ESLint usando el formato "flat config"
 *
 * Se estructura como un array de configuraciones que se aplican
 * en orden secuencial para diferentes tipos de archivos
 */
module.exports = defineConfig([
  // Configuración base de Expo - incluye reglas para React Native
  expoConfig,

  {
    /**
     * Archivos y directorios a ignorar durante el linting
     *
     * Se excluyen:
     * - Archivos de build (dist, web-build)
     * - Dependencias (node_modules)
     * - Archivos generados por Expo (.expo)
     * - Builds nativos (ios, android)
     */
    ignores: [
      'dist/*', // Archivos de distribución
      'node_modules/*', // Dependencias de npm
      '.expo/*', // Archivos temporales de Expo
      'ios/*', // Build nativo iOS
      'android/*', // Build nativo Android
      'web-build/*', // Build para web
    ],
  },

  {
    /**
     * Configuración específica para archivos de código JavaScript y TypeScript
     *
     * Aplica reglas de linting y formateo a todos los archivos
     * con extensiones .js, .jsx, .ts, .tsx
     */
    files: ['**/*.{js,jsx,ts,tsx}'],

    /**
     * Configuración del lenguaje y sintaxis
     */
    languageOptions: {
      ecmaVersion: 2022, // Soporte para ES2022
      sourceType: 'module', // Uso de módulos ES6
    },

    /**
     * Reglas de linting y formateo
     */
    rules: {
      /**
       * Integración con Prettier para formateo automático
       *
       * Configuración sincronizada con .prettierrc para evitar conflictos
       */
      'prettier/prettier': [
        'error',
        {
          semi: true, // Punto y coma al final
          singleQuote: true, // Comillas simples
          tabWidth: 2, // Indentación de 2 espacios
          trailingComma: 'es5', // Comas finales donde ES5 las permite
          printWidth: 80, // Líneas máximo 80 caracteres
          bracketSpacing: true, // Espacios dentro de llaves { foo }
          arrowParens: 'avoid', // Sin paréntesis en arrow functions con un parámetro
        },
      ],

      /**
       * Reglas de calidad específicas para React Native
       */
      'no-console': 'warn', // Advertir sobre console.log en producción
      'no-unused-vars': 'warn', // Detectar variables declaradas pero no utilizadas
      'no-undef': 'error', // Error por variables no definidas
    },

    /**
     * Plugins utilizados
     *
     * prettier: Integra Prettier como regla de ESLint
     */
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
  },
]);

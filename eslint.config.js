/**
 * Configuración de ESLint para Damian APP
 *
 * TECNOLOGÍA: ESLint 9 con flat config (nueva sintaxis)
 * FUNCIONALIDAD: Linting + Prettier integrado para calidad de código automática
 *
 * HERRAMIENTAS INTEGRADAS:
 * - React Native y Expo rules
 * - Prettier para formateo automático
 * - Detección de errores y malas prácticas
 *
 * @see https://docs.expo.dev/guides/using-eslint/
 * @author Damian
 * @version 1.0.0
 */

// Importación de dependencias necesarias
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * CONFIGURACIÓN FLAT CONFIG (ESLint 9):
 * Array de objetos que se aplican secuencialmente por tipo de archivo
 */
module.exports = defineConfig([
  // Configuración base de Expo - reglas para React Native
  expoConfig,

  {
    /**
     * ARCHIVOS IGNORADOS: Excluye directorios de build y dependencias
     */
    ignores: [
      'dist/*', // Distribución
      'node_modules/*', // Dependencias npm
      '.expo/*', // Temporales Expo
      'ios/*', // Build iOS
      'android/*', // Build Android
      'web-build/*', // Build web
    ],
  },

  {
    /**
     * CONFIGURACIÓN PARA ARCHIVOS DE CÓDIGO: .js, .jsx, .ts, .tsx
     */
    files: ['**/*.{js,jsx,ts,tsx}'],

    /**
     * SINTAXIS Y ENTORNO: ES2022 + módulos + globals React Native
     */
    languageOptions: {
      ecmaVersion: 2022, // ES2022 features
      sourceType: 'module', // ES6 modules
      globals: {
        __DEV__: 'readonly', // React Native development flag
      },
    },

    /**
     * REGLAS DE LINTING Y FORMATEO
     */
    rules: {
      /**
       * PRETTIER INTEGRATION: Configuración sincronizada con .prettierrc
       */
      'prettier/prettier': [
        'error',
        {
          semi: true, // Punto y coma obligatorio
          singleQuote: true, // Comillas simples
          tabWidth: 2, // Indentación 2 espacios
          trailingComma: 'es5', // Comas finales ES5
          printWidth: 80, // Máximo 80 caracteres
          bracketSpacing: true, // Espacios en objetos { foo }
          arrowParens: 'avoid', // Sin paréntesis: x => x
          endOfLine: 'lf', // LF line endings (Unix style)
        },
      ],

      /**
       * REGLAS DE CALIDAD ESPECÍFICAS
       */
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'], // Permitir warnings y errors
        },
      ], // Advertir sobre console.log en producción
      'no-unused-vars': 'warn', // Variables declaradas no usadas
      'no-undef': 'error', // Variables no definidas = error
    },

    /**
     * PLUGINS: prettier plugin para integración ESLint + Prettier
     */
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
  },
]);

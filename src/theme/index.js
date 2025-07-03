/**
 * Theme exports centralizados
 *
 * @author Damian App
 * @version 2.0.0 - Dynamic Theme System
 */

// Exportar tema estático (para referencia)
export { THEME, createStyles } from './theme';

// Exportar sistema dinámico de temas
export { ThemeProvider, useTheme, withTheme } from './ThemeProvider';

// Export por defecto
export { default } from './theme';

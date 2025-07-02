/**
 * Punto de exportación centralizado para context
 *
 * PROPÓSITO: Simplificar imports del sistema de gestión de estado
 * ESCALABILIDAD: Fácil agregar nuevos contexts y providers
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 4
 */

export { AppProvider, useAppContext, ActionTypes } from './AppContext';

// Futuros contexts se pueden agregar aquí:
// export { ThemeProvider, useTheme } from './ThemeContext';
// export { AuthProvider, useAuth } from './AuthContext';

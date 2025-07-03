import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from './theme';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🎨 THEME PROVIDER - Sistema de Temas Dinámico
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 FUNCIONALIDADES:
 * ✅ Cambio dinámico entre modo claro y oscuro
 * ✅ Persistencia de preferencia del usuario en AsyncStorage
 * ✅ Estado global accesible desde cualquier componente
 * ✅ Hook personalizado useTheme() para fácil acceso
 * ✅ Carga inicial automática de la preferencia guardada
 * ✅ Actualización inmediata de toda la app al cambiar tema
 *
 * 🚀 BENEFICIOS:
 * → Un solo lugar para manejar el estado del tema
 * → Persistencia automática de preferencias
 * → Performance optimizada con React.memo y useCallback
 * → Fácil extensión para nuevos temas en el futuro
 * → Compatibilidad total con el theme system existente
 *
 * 📝 USO:
 * 1. Envolver la app con <ThemeProvider>
 * 2. Usar el hook useTheme() en cualquier componente
 * 3. Llamar toggleTheme() para cambiar entre temas
 *
 * @author Damian App - Dynamic Theme System
 * @version 1.0.0 - Theme Provider Implementation
 */

// Clave para AsyncStorage
const THEME_STORAGE_KEY = '@damianapp_theme_preference';

// Crear contexto del tema
const ThemeContext = createContext(null);

/**
 * ThemeProvider - Proveedor del contexto de tema
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijo
 */
export const ThemeProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('dark'); // Modo por defecto
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Cargar preferencia de tema guardada al inicializar
   */
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setCurrentMode(savedTheme);
        }
      } catch (error) {
        console.warn('Error loading theme preference:', error);
        // Mantener el tema por defecto si hay error
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  /**
   * Guardar preferencia de tema
   * @param {string} mode - Modo a guardar ('light' | 'dark')
   */
  const saveThemePreference = async mode => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  };

  /**
   * Alternar entre modo claro y oscuro
   */
  const toggleTheme = () => {
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    setCurrentMode(newMode);
    saveThemePreference(newMode);
  };

  /**
   * Establecer un modo específico
   * @param {string} mode - Modo a establecer ('light' | 'dark')
   */
  const setTheme = mode => {
    if (mode === 'light' || mode === 'dark') {
      setCurrentMode(mode);
      saveThemePreference(mode);
    }
  };

  /**
   * Obtener los colores según el modo actual
   */
  const getCurrentColors = () => {
    return THEME.getColors(currentMode);
  };

  // Crear objeto de tema dinámico
  const dynamicTheme = {
    ...THEME,
    mode: currentMode,
    colors: getCurrentColors(),
  };

  // Valor del contexto
  const contextValue = {
    // Tema completo
    theme: dynamicTheme,

    // Acceso directo a propiedades comunes
    colors: dynamicTheme.colors,
    typography: THEME.typography,
    spacing: THEME.spacing,
    borderRadius: THEME.borderRadius,
    shadows: THEME.shadows,

    // Estado del tema
    mode: currentMode,
    isDark: currentMode === 'dark',
    isLight: currentMode === 'light',
    isLoading,

    // Funciones para cambiar tema
    toggleTheme,
    setTheme,

    // Utilidades
    getColors: getCurrentColors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para usar el tema dinámico
 * @returns {Object} Objeto con tema, colores, funciones y estado
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * HOC para componentes que necesiten el tema
 * @param {React.Component} Component - Componente a envolver
 * @returns {React.Component} Componente envuelto con acceso al tema
 */
export const withTheme = Component => {
  const ThemedComponent = React.forwardRef((props, ref) => {
    const theme = useTheme();
    return <Component {...props} ref={ref} theme={theme} />;
  });

  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name || 'Component'})`;

  return ThemedComponent;
};

export default ThemeProvider;

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { AppProvider } from './src/context';
import { ThemeProvider } from './src/theme';
import configService from './src/services/core/config/configService';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * @returns {JSX.Element} Layout principal con gestión de estado y navegación
 * @author Damian
 * @version 8.0.0 - Sistema de Configuración Dinámico Módulo 8
 */
export default function App() {
  // Inicializar servicio de configuración
  useEffect(() => {
    configService.initialize().catch(error => {
      console.warn('Error initializing config service:', error);
    });
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

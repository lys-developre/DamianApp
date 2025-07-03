import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { AppProvider } from './src/context';
import { ThemeProvider } from './src/theme';
import configService from './src/services/configService';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * FLUJO ARQUITECTURAL MÓDULO 8:
 * 1. SafeAreaProvider proporciona contexto global para áreas seguras
 * 2. Inicialización del servicio de configuración dinámico
 * 3. ThemeProvider gestiona el sistema de temas dinámico
 * 4. AppProvider gestiona el estado global y persistencia con AsyncStorage
 * 5. AppNavigator maneja toda la navegación de la aplicación
 *
 * MEJORAS MÓDULO 8 (CONFIGURACIÓN DINÁMICA):
 * - ✅ Sistema de configuración centralizado implementado
 * - ✅ Configuraciones de UI, audio, haptics y accesibilidad
 * - ✅ Presets predefinidos para diferentes tipos de usuario
 * - ✅ Pantalla de configuración avanzada
 * - ✅ Persistencia automática de configuraciones
 *
 * MEJORAS MÓDULO 7 (TEMAS):
 * - ✅ Sistema de temas dinámico implementado
 * - ✅ Cambio entre modo claro y oscuro
 * - ✅ Persistencia de preferencias de tema
 * - ✅ Actualización automática de toda la app
 *
 * MEJORAS MÓDULO 4:
 * - ✅ Context API para gestión de estado global
 * - ✅ AsyncStorage para persistencia automática
 * - ✅ Estado centralizado y escalable
 * - ✅ Comunicación reactiva entre componentes
 *
 * MEJORAS MÓDULO 3:
 * - ✅ React Navigation implementado
 * - ✅ Navegación Stack para flujos complejos
 * - ✅ Transiciones fluidas y profesionales
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

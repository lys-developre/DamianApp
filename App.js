import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { AppProvider } from './src/context';
import { ThemeProvider } from './src/theme';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * FLUJO ARQUITECTURAL MÓDULO 7:
 * 1. SafeAreaProvider proporciona contexto global para áreas seguras
 * 2. ThemeProvider gestiona el sistema de temas dinámico
 * 3. AppProvider gestiona el estado global y persistencia con AsyncStorage
 * 4. AppNavigator maneja toda la navegación de la aplicación
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
 * @version 7.0.0 - Sistema de Temas Módulo 7
 */
export default function App() {
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

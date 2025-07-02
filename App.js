import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { AppProvider } from './src/context';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * FLUJO ARQUITECTURAL MÓDULO 4:
 * 1. SafeAreaProvider proporciona contexto global para áreas seguras
 * 2. AppProvider gestiona el estado global y persistencia con AsyncStorage
 * 3. AppNavigator maneja toda la navegación de la aplicación
 *
 * MEJORAS MÓDULO 3:
 * - ✅ React Navigation implementado
 * - ✅ Navegación Stack para flujos complejos
 * - ✅ Transiciones fluidas y profesionales
 *
 * MEJORAS MÓDULO 4:
 * - ✅ Context API para gestión de estado global
 * - ✅ AsyncStorage para persistencia automática
 * - ✅ Estado centralizado y escalable
 * - ✅ Comunicación reactiva entre componentes
 *
 * @returns {JSX.Element} Layout principal con gestión de estado y navegación
 * @author Damian
 * @version 4.0.0 - Gestión de Estado Módulo 4
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

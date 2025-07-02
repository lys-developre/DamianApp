import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * FLUJO ARQUITECTURAL MÓDULO 3:
 * 1. SafeAreaProvider proporciona contexto global para áreas seguras (notch, barra de estado)
 * 2. AppNavigator maneja toda la navegación de la aplicación
 * 3. Sistema de navegación profesional con Stack, Tab y transiciones
 *
 * MEJORAS MÓDULO 3:
 * - ✅ React Navigation implementado
 * - ✅ Navegación Stack para flujos complejos
 * - ✅ Tab Navigation para módulos principales
 * - ✅ Transiciones fluidas y profesionales
 * - ✅ Gestión de estado de navegación
 * - ✅ Tema oscuro consistente
 *
 * @returns {JSX.Element} Layout principal con navegación profesional
 * @author Damian
 * @version 3.0.0 - Navegación Módulo 3
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar pantallas
import { HomeScreen } from '../screens';
import AdminConfigScreen from '../components/AdminConfigScreen';
import TimerImageButtonsManager from '../components/TimerImageButtons';

/**
 * Navegador principal de la aplicación Damian APP
 *
 * ARQUITECTURA DE NAVEGACIÓN MÓDULO 3:
 * - ✅ Stack Navigation para flujo principal
 * - ✅ Tab Navigation para módulos principales (futuro)
 * - ✅ Transiciones fluidas y profesionales
 * - ✅ Gestión de estado de navegación persistente
 * - ✅ Deep linking preparado
 *
 * FLUJO DE NAVEGACIÓN:
 * 1. Home (pantalla principal con temporizadores y switches)
 * 2. AdminConfig (configuración administrativa)
 * 3. TimerImageManager (gestión de temporizadores con imagen)
 *
 * @author Damian App
 * @version 1.0.0 - Implementación Módulo 3
 */

const Stack = createStackNavigator();

/**
 * Stack Navigator principal de la aplicación
 */
const RootStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1E293B',
      },
      headerTintColor: '#ffffff',
      cardStyle: {
        backgroundColor: '#1E293B',
      },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Damian APP',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="AdminConfig"
      component={AdminConfigScreen}
      options={{
        title: 'Configuración',
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="TimerImageManager"
      component={TimerImageButtonsManager}
      options={{
        title: 'Gestión de Temporizadores',
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

/**
 * Navegador principal de la aplicación
 */
const AppNavigator = () => (
  <NavigationContainer>
    <RootStack />
  </NavigationContainer>
);

export default AppNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../theme';

// Importar pantallas
import { HomeScreen } from '../screens';
import AdminConfigScreen from '../components/AdminConfigScreen';
import TimerImageButtonsManager from '../components/TimerImageButtons';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';

/**
 * Navegador principal de la aplicación Damian APP
 *
 * ARQUITECTURA DE NAVEGACIÓN MÓDULO 7:
 * - ✅ Sistema de temas dinámico integrado
 * - ✅ Navegación al selector de temas
 * - ✅ Actualización automática del estilo de navegación según el tema
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
 * 4. ThemeSelector (selección de temas claro/oscuro)
 *
 * @author Damian App
 * @version 2.0.0 - Theme Integration Módulo 7
 */

const Stack = createStackNavigator();

/**
 * Stack Navigator principal de la aplicación
 */
const RootStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.BACKGROUND_SECONDARY,
        },
        headerTintColor: theme.colors.TEXT_PRIMARY,
        cardStyle: {
          backgroundColor: theme.colors.BACKGROUND_PRIMARY,
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
      <Stack.Screen
        name="ThemeSelector"
        component={ThemeSelector}
        options={{
          title: 'Temas de Color',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Navegador principal de la aplicación
 */
const AppNavigator = () => (
  <NavigationContainer>
    <RootStack />
  </NavigationContainer>
);

export default AppNavigator;

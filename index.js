/**
 * Punto de entrada principal de la aplicación Damian APP
 *
 * FLUJO DE INICIALIZACIÓN:
 * 1. Importa el componente raíz App desde ./App
 * 2. registerRootComponent registra la app en el AppRegistry de React Native
 * 3. Configura el entorno para funcionar tanto en Expo Go como en builds nativos
 *
 * TÉCNICA INTERNA: registerRootComponent ejecuta internamente:
 * - AppRegistry.registerComponent('main', () => App)
 * - Configuración del entorno multiplataforma
 * - Bridge entre JavaScript y código nativo
 *
 * @author Damian
 * @version 1.0.0
 */

import { registerRootComponent } from 'expo';
import App from './App';

/*
 * REGISTRO DE LA APLICACIÓN:
 * Esta función es el puente entre React Native y el sistema operativo
 * Funciona tanto en desarrollo (Expo Go) como en producción (APK/IPA)
 */
registerRootComponent(App);

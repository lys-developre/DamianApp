import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import Main from './components/Main';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * Actúa como layout principal proporcionando:
 * - SafeAreaProvider para manejo global de áreas seguras (multiplataforma)
 * - View como contenedor principal (optimizado para Android)
 * - Punto de entrada limpio y organizado
 * - Estructura modular para escalabilidad
 *
 * Nota: SafeAreaView nativo de React Native solo funciona en iOS.
 * Para Android usamos SafeAreaProvider de react-native-safe-area-context
 *
 * @returns {JSX.Element} Layout principal de la aplicación
 * @author Damian
 * @version 1.0.0
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Componente principal con el contenido de la aplicación */}
        <Main />
      </View>
    </SafeAreaProvider>
  );
}

/**
 * Estilos del layout principal
 *
 * Define el comportamiento del contenedor raíz:
 * - Ocupar toda la pantalla disponible
 * - Proporcionar base para componentes hijos
 */
const styles = StyleSheet.create({
  /**
   * Contenedor raíz de la aplicación
   *
   * Características:
   * - Ocupa toda la pantalla (flex: 1)
   * - Proporciona base para el SafeAreaProvider
   * - Optimizado para Android
   */
  container: {
    flex: 1,
  },
});

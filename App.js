import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens';

/**
 * Componente raíz de la aplicación Damian APP
 *
 * FLUJO ARQUITECTURAL:
 * 1. SafeAreaProvider proporciona contexto global para áreas seguras (notch, barra de estado)
 * 2. View actúa como contenedor flex que ocupa toda la pantalla
 * 3. Main contiene toda la lógica y UI de la aplicación
 *
 * NOTA TÉCNICA: SafeAreaView nativo solo funciona en iOS.
 * SafeAreaProvider de react-native-safe-area-context es multiplataforma.
 *
 * @returns {JSX.Element} Layout principal con manejo de áreas seguras
 * @author Damian
 * @version 1.0.0
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/*
         * COMPONENTE PRINCIPAL: HomeScreen contiene toda la UI y lógica de la app
         * Se renderiza dentro del contexto de áreas seguras
         */}
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  );
}

/**
 * Estilos del layout principal
 *
 * TÉCNICA UTILIZADA: StyleSheet.create() optimiza el rendimiento
 * vs estilos inline que se recrean en cada render
 */
const styles = StyleSheet.create({
  /**
   * Contenedor raíz - Ocupa toda la pantalla disponible
   *
   * flex: 1 = toma todo el espacio del padre (pantalla completa)
   * Es la base para que SafeAreaProvider funcione correctamente
   */
  container: {
    flex: 1,
  },
});

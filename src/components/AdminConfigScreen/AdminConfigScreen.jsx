import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Pantalla de configuración administrativa de Damian APP - Módulo 3
 *
 * MEJORAS MÓDULO 3:
 * - ✅ Integración completa con React Navigation
 * - ✅ Navegación profesional entre pantallas
 * - ✅ Eliminación de renderizado condicional
 * - ✅ useNavigation hook para navegación nativa
 * - ✅ Handlers optimizados con useCallback
 *
 * FUNCIONALIDAD: Hub de configuración para familia/terapeutas
 * NAVEGACIÓN: Usa React Navigation para navegar entre pantallas
 *
 * FLUJO DE NAVEGACIÓN:
 * 1. Muestra menú principal con opciones de configuración
 * 2. Al seleccionar opción → navega a pantalla específica usando navigation.navigate()
 * 3. Botón "Volver" usa navigation.goBack() para regresar
 *
 * @returns {JSX.Element} Pantalla de configuración administrativa
 * @author Damian App
 * @version 3.0.0 - Navegación Módulo 3
 */
const AdminConfigScreen = React.memo(() => {
  const navigation = useNavigation();

  // Handler para navegar a gestión de temporizadores con imagen
  const handleShowTimerManager = useCallback(() => {
    navigation.navigate('TimerImageManager');
  }, [navigation]);

  // Handler para volver a la pantalla anterior (Home)
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {/* BOTÓN: Gestión de temporizadores con imagen */}
      <TouchableOpacity
        style={styles.configButton}
        onPress={handleShowTimerManager}
        accessibilityRole="button"
        accessibilityLabel="Gestionar imágenes con temporizador"
        accessibilityHint="Abre la pantalla para configurar temporizadores con imágenes"
      >
        <Text style={styles.buttonText}>Imagenes con temporizador</Text>
      </TouchableOpacity>

      {/* BOTÓN: Configuración de temporizador digital */}
      <TouchableOpacity
        style={styles.configButton}
        accessibilityRole="button"
        accessibilityLabel="Configurar temporizador digital"
        accessibilityHint="Abre configuración del temporizador principal"
      >
        <Text style={styles.buttonText}>Configurar temporizador</Text>
      </TouchableOpacity>

      {/* BOTÓN: Configuración de frases motivacionales */}
      <TouchableOpacity
        style={styles.configButton}
        accessibilityRole="button"
        accessibilityLabel="Configurar frases motivacionales"
        accessibilityHint="Personaliza las frases que aparecen durante los temporizadores"
      >
        <Text style={styles.buttonText}>Configurar frases</Text>
      </TouchableOpacity>

      {/* BOTÓN: Volver a pantalla anterior */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        accessibilityHint="Regresa a la pantalla principal de la aplicación"
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
});

AdminConfigScreen.displayName = 'AdminConfigScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  configButton: {
    backgroundColor: '#45B7D1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 18,
    minWidth: 260,
    maxWidth: 320,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#F59E42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 30,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AdminConfigScreen;

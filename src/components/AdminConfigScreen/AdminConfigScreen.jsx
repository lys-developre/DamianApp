import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

/**
 * Pantalla de configuración administrativa de Damian APP - Módulo 7
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración completa al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Mantenimiento del aspecto visual actual
 * - ✅ Preparación para modo oscuro/claro
 * - ✅ Configuración de temas de color implementada
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
 * @returns {JSX.Element} Pantalla de configuración administrativa
 * @author Damian App
 * @version 5.0.0 - Theme Selector Módulo 7
 */
const AdminConfigScreen = React.memo(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Handler para mostrar el gestor de temporizadores con imagen
  const handleShowTimerManager = useCallback(() => {
    navigation.navigate('TimerImageButtonsManager');
  }, [navigation]);

  // Handler para mostrar el selector de temas
  const handleShowThemeSelector = useCallback(() => {
    navigation.navigate('ThemeSelector');
  }, [navigation]);

  // Handler para mostrar configuración avanzada
  const handleShowAdvancedConfig = useCallback(() => {
    navigation.navigate('AdvancedConfig');
  }, [navigation]);

  // Handler para volver a la pantalla anterior
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND_PRIMARY }]}
    >
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        Configuración
      </Text>

      {/* BOTÓN: Gestión de temporizadores con imagen */}
      <TouchableOpacity
        style={[styles.configButton, { backgroundColor: colors.PRIMARY }]}
        onPress={handleShowTimerManager}
        accessibilityRole="button"
        accessibilityLabel="Gestionar imágenes con temporizador"
        accessibilityHint="Abre la pantalla para configurar temporizadores con imágenes"
      >
        <Text style={[styles.buttonText, { color: colors.TEXT_PRIMARY }]}>
          Imagenes con temporizador
        </Text>
      </TouchableOpacity>

      {/* BOTÓN: Configuración de temas de color */}
      <TouchableOpacity
        style={[styles.configButton, { backgroundColor: colors.PRIMARY }]}
        onPress={handleShowThemeSelector}
        accessibilityRole="button"
        accessibilityLabel="Configurar temas de color"
        accessibilityHint="Abre la pantalla para seleccionar tema claro u oscuro"
      >
        <Text style={[styles.buttonText, { color: colors.TEXT_PRIMARY }]}>
          Temas de color
        </Text>
      </TouchableOpacity>

      {/* BOTÓN: Configuración de frases motivacionales */}
      <TouchableOpacity
        style={[styles.configButton, { backgroundColor: colors.PRIMARY }]}
        onPress={handleShowAdvancedConfig}
        accessibilityRole="button"
        accessibilityLabel="Configuración avanzada"
        accessibilityHint="Abre la pantalla de configuración avanzada para personalizar la experiencia"
      >
        <Text style={[styles.buttonText, { color: colors.TEXT_PRIMARY }]}>
          Configuración avanzada
        </Text>
      </TouchableOpacity>

      {/* BOTÓN: Volver a pantalla anterior */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.WARNING }]}
        onPress={handleGoBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        accessibilityHint="Regresa a la pantalla principal de la aplicación"
      >
        <Text style={[styles.buttonText, { color: colors.TEXT_PRIMARY }]}>
          Volver
        </Text>
      </TouchableOpacity>
    </View>
  );
});

AdminConfigScreen.displayName = 'AdminConfigScreen';

// Estilos sin colores hardcodeados - los colores vienen del theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  configButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 18,
    minWidth: 260,
    maxWidth: 320,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 30,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AdminConfigScreen;

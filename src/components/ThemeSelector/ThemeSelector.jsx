import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

/**
 * ThemeSelector - Pantalla para seleccionar entre temas claro y oscuro
 *
 * FUNCIONALIDADES:
 * - ✅ Selección entre modo oscuro y claro
 * - ✅ Preview en tiempo real del tema seleccionado
 * - ✅ Guardado de preferencia del usuario
 * - ✅ Integración completa con el theme system
 * - ✅ Preparado para agregar más temas en el futuro
 *
 * BENEFICIOS:
 * - Cambio automático de toda la app
 * - Persistencia de preferencia
 * - Interfaz intuitiva y accesible
 * - Experiencia de usuario fluida
 *
 * @returns {JSX.Element} Pantalla de selección de temas
 * @author Damian App
 * @version 1.0.0 - Theme Selector Implementation
 */
const ThemeSelector = React.memo(() => {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme } = useTheme();

  // Estado local para el tema seleccionado (para preview)
  const [selectedTheme, setSelectedTheme] = useState(isDark ? 'dark' : 'light');

  // Temas disponibles
  const availableThemes = [
    {
      id: 'dark',
      name: 'Modo Oscuro',
      description: 'Ideal para uso nocturno y menor fatiga visual',
      icon: 'dark-mode',
      preview: {
        primary: '#45B7D1',
        background: '#1E293B',
        text: '#FFFFFF',
        card: '#222',
      },
    },
    {
      id: 'light',
      name: 'Modo Claro',
      description: 'Perfecto para uso diurno y máxima legibilidad',
      icon: 'light-mode',
      preview: {
        primary: '#45B7D1',
        background: '#FFFFFF',
        text: '#1E293B',
        card: '#F1F5F9',
      },
    },
    // Preparado para futuros temas
    // {
    //   id: 'contrast',
    //   name: 'Alto Contraste',
    //   description: 'Máximo contraste para mejor accesibilidad',
    //   icon: 'contrast',
    //   preview: {
    //     primary: '#000000',
    //     background: '#FFFFFF',
    //     text: '#000000',
    //     card: '#F0F0F0',
    //   },
    // },
  ];

  // Handler para aplicar el tema seleccionado
  const handleApplyTheme = useCallback(() => {
    const currentThemeId = isDark ? 'dark' : 'light';

    if (selectedTheme !== currentThemeId) {
      Alert.alert(
        'Cambiar tema',
        `¿Deseas cambiar al ${selectedTheme === 'dark' ? 'modo oscuro' : 'modo claro'}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Cambiar',
            onPress: () => {
              toggleTheme();
              Alert.alert(
                'Tema aplicado',
                `Se ha cambiado al ${selectedTheme === 'dark' ? 'modo oscuro' : 'modo claro'} exitosamente.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [selectedTheme, isDark, toggleTheme, navigation]);

  // Handler para volver sin aplicar cambios
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Renderizar tarjeta de tema
  const renderThemeCard = useCallback(
    theme => {
      const isSelected = selectedTheme === theme.id;
      const isCurrentTheme =
        (isDark && theme.id === 'dark') || (!isDark && theme.id === 'light');

      return (
        <TouchableOpacity
          key={theme.id}
          style={[
            styles.themeCard,
            {
              backgroundColor: colors.BACKGROUND_CARD,
              borderColor: isSelected ? colors.PRIMARY : colors.BORDER_PRIMARY,
              borderWidth: isSelected ? 3 : 1,
            },
          ]}
          onPress={() => setSelectedTheme(theme.id)}
          activeOpacity={0.8}
          accessibilityLabel={`Seleccionar ${theme.name}`}
          accessibilityHint={theme.description}
        >
          {/* Header de la tarjeta */}
          <View style={styles.themeCardHeader}>
            <MaterialIcons
              name={theme.icon}
              size={32}
              color={isSelected ? colors.PRIMARY : colors.TEXT_SECONDARY}
            />
            {isCurrentTheme && (
              <View
                style={[
                  styles.currentBadge,
                  { backgroundColor: colors.SECONDARY },
                ]}
              >
                <Text
                  style={[
                    styles.currentBadgeText,
                    { color: colors.TEXT_PRIMARY },
                  ]}
                >
                  Actual
                </Text>
              </View>
            )}
          </View>

          {/* Información del tema */}
          <Text style={[styles.themeName, { color: colors.TEXT_PRIMARY }]}>
            {theme.name}
          </Text>
          <Text
            style={[styles.themeDescription, { color: colors.TEXT_SECONDARY }]}
          >
            {theme.description}
          </Text>

          {/* Preview del tema */}
          <View style={styles.themePreview}>
            <View
              style={[
                styles.previewContainer,
                { backgroundColor: theme.preview.background },
              ]}
            >
              <View
                style={[
                  styles.previewCard,
                  { backgroundColor: theme.preview.card },
                ]}
              >
                <View
                  style={[
                    styles.previewButton,
                    { backgroundColor: theme.preview.primary },
                  ]}
                />
                <View style={styles.previewTextLines}>
                  <View
                    style={[
                      styles.previewTextLine,
                      { backgroundColor: theme.preview.text },
                    ]}
                  />
                  <View
                    style={[
                      styles.previewTextLine,
                      styles.previewTextLineShort,
                      { backgroundColor: theme.preview.text, opacity: 0.6 },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Indicador de selección */}
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <MaterialIcons
                name="check-circle"
                size={24}
                color={colors.PRIMARY}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedTheme, isDark, colors]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND_PRIMARY }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          accessibilityLabel="Volver"
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.TEXT_PRIMARY}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Temas de Color
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
          Selecciona el tema que prefieras para toda la aplicación
        </Text>

        {/* Lista de temas */}
        <View style={styles.themesContainer}>
          {availableThemes.map(renderThemeCard)}
        </View>

        {/* Información adicional */}
        <View
          style={[
            styles.infoContainer,
            { backgroundColor: colors.BACKGROUND_CARD },
          ]}
        >
          <MaterialIcons name="info" size={20} color={colors.TEXT_SECONDARY} />
          <Text style={[styles.infoText, { color: colors.TEXT_SECONDARY }]}>
            El tema seleccionado se aplicará a toda la aplicación inmediatamente
            y se guardará tu preferencia para futuras sesiones.
          </Text>
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.cancelButton,
            { backgroundColor: colors.BACKGROUND_SECONDARY },
          ]}
          onPress={handleGoBack}
          accessibilityLabel="Cancelar"
        >
          <Text
            style={[styles.actionButtonText, { color: colors.TEXT_PRIMARY }]}
          >
            Cancelar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.applyButton,
            { backgroundColor: colors.PRIMARY },
          ]}
          onPress={handleApplyTheme}
          accessibilityLabel="Aplicar tema"
        >
          <Text
            style={[styles.actionButtonText, { color: colors.TEXT_PRIMARY }]}
          >
            Aplicar Tema
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

ThemeSelector.displayName = 'ThemeSelector';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60, // Para el status bar
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40, // Mismo ancho que el botón de atrás
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  themesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  themeCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themePreview: {
    marginBottom: 12,
  },
  previewContainer: {
    height: 80,
    borderRadius: 12,
    padding: 12,
  },
  previewCard: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewButton: {
    width: 24,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  previewTextLines: {
    flex: 1,
    gap: 4,
  },
  previewTextLine: {
    height: 8,
    borderRadius: 4,
  },
  previewTextLineShort: {
    width: '70%',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    // Estilos específicos para cancelar si es necesario
  },
  applyButton: {
    // Estilos específicos para aplicar si es necesario
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemeSelector;

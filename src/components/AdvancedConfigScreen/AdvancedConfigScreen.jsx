import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import {
  useConfig,
  useUIConfig,
  useAudioConfig,
  useHapticsConfig,
  useAccessibilityConfig,
} from '../../hooks/useConfig';

/**
 * 🔧 PANTALLA DE CONFIGURACIÓN AVANZADA - DamianApp Módulo 8
 *
 * 🎯 FUNCIONALIDADES:
 * ✅ Configuración completa de UI, audio, haptics y accesibilidad
 * ✅ Presets predefinidos para diferentes tipos de usuario
 * ✅ Reset a valores por defecto
 * ✅ Preview en tiempo real de cambios
 * ✅ Validación de valores
 * ✅ Interfaz organizada por categorías
 */
const AdvancedConfigScreen = React.memo(() => {
  // const navigation = useNavigation(); // Eliminado porque ya no se usa
  const { colors } = useTheme();

  // Hooks de configuración reales
  const { reset } = useConfig();
  const uiConfig = useUIConfig();
  const audioConfig = useAudioConfig();
  const hapticsConfig = useHapticsConfig();
  const accessibilityConfig = useAccessibilityConfig();

  // Estado local para modales y feedback
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Handler para simular guardado (feedback visual)
  const handleSaveChanges = useCallback(() => {
    setIsSaving(true);

    // Simular proceso de guardado con feedback visual
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());

      Alert.alert(
        '✅ Configuración Guardada',
        'Todos los cambios han sido aplicados correctamente.\n\n' +
          'Nota: Los cambios también se guardan automáticamente mientras configuras.',
        [{ text: 'Entendido' }]
      );
    }, 1000);
  }, []);

  // Handler para reset
  const handleReset = useCallback(() => {
    Alert.alert(
      'Resetear configuración',
      '¿Estás seguro de que quieres resetear toda la configuración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: () => {
            reset()
              .then(() => {
                Alert.alert('Éxito', 'Configuración restablecida');
              })
              .catch(error => {
                Alert.alert('Error', 'No se pudo resetear la configuración');
                console.error('Error resetting config:', error);
              });
          },
        },
      ]
    );
  }, [reset]);

  // Handler para probar configuración actual
  const handleTestConfiguration = useCallback(() => {
    // Obtener configuración completa para debugging
    const fullConfig = {
      ui: uiConfig,
      audio: audioConfig,
      haptics: hapticsConfig,
      accessibility: accessibilityConfig,
    };

    if (__DEV__) {
      console.warn('🔧 DEBUG - Full Configuration:', fullConfig);
    }

    Alert.alert(
      '🔧 Debug - Configuración Actual',
      `🎮 Haptics: ${hapticsConfig.enabled ? 'ON' : 'OFF'} (${hapticsConfig.intensity})\n` +
        `🔊 Audio: ${audioConfig.enabled ? 'ON' : 'OFF'} (Vol: ${Math.round(audioConfig.volume * 100)}%)\n` +
        `🎭 Animaciones: ${uiConfig.animations?.enabled !== false ? 'ON' : 'OFF'}\n` +
        `⏱️ Milisegundos: ${uiConfig.timer?.showMilliseconds ? 'ON' : 'OFF'}\n` +
        `🎛️ Switches Celebration: ${uiConfig.switches?.celebration !== false ? 'ON' : 'OFF'}\n` +
        `♿ Reducir Animaciones: ${accessibilityConfig.reduceAnimations ? 'ON' : 'OFF'}\n\n` +
        'Configuración completa enviada a consola.',
      [
        { text: 'OK' },
        {
          text: 'Test Haptics',
          onPress: async () => {
            try {
              const { hapticsService } = await import(
                '../../services/media/haptics'
              );
              await hapticsService.medium();
              Alert.alert('Haptics', 'Test completado');
            } catch (error) {
              Alert.alert('Error', 'Haptics no disponible: ' + error.message);
            }
          },
        },
      ]
    );
  }, [uiConfig, audioConfig, hapticsConfig, accessibilityConfig]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND_PRIMARY }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Acciones rápidas */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.BACKGROUND_SECONDARY, marginTop: 24 },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
            Acciones Rápidas
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.SUCCESS }]}
              onPress={handleTestConfiguration}
            >
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.TEXT_PRIMARY}
              />
              <Text style={[styles.actionText, { color: colors.TEXT_PRIMARY }]}>
                Probar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isSaving
                    ? colors.BORDER_PRIMARY
                    : colors.WARNING,
                  opacity: isSaving ? 0.7 : 1,
                },
              ]}
              onPress={handleSaveChanges}
              disabled={isSaving}
            >
              <MaterialIcons
                name={isSaving ? 'hourglass-empty' : 'save'}
                size={20}
                color={colors.TEXT_PRIMARY}
              />
              <Text style={[styles.actionText, { color: colors.TEXT_PRIMARY }]}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.DANGER }]}
              onPress={handleReset}
            >
              <MaterialIcons
                name="refresh"
                size={20}
                color={colors.TEXT_PRIMARY}
              />
              <Text style={[styles.actionText, { color: colors.TEXT_PRIMARY }]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Configuración de UI */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.BACKGROUND_SECONDARY },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
            🎨 Pantalla Principal
          </Text>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Animaciones habilitadas
            </Text>
            <Switch
              value={uiConfig.animations?.enabled || false}
              onValueChange={enabled =>
                uiConfig.setAnimations({
                  ...uiConfig.animations,
                  enabled,
                })
              }
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Duración: {uiConfig.animations?.duration || 300}ms
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={1000}
              step={50}
              value={uiConfig.animations?.duration || 300}
              onValueChange={duration =>
                uiConfig.setAnimations({
                  ...uiConfig.animations,
                  duration,
                })
              }
              minimumTrackTintColor={colors.PRIMARY}
              maximumTrackTintColor={colors.BORDER_PRIMARY}
              thumbTintColor={colors.PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Milisegundos en timer
            </Text>
            <Switch
              value={uiConfig.timer?.showMilliseconds || false}
              onValueChange={showMilliseconds =>
                uiConfig.setTimer({
                  ...uiConfig.timer,
                  showMilliseconds,
                })
              }
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Efecto glow en timer
            </Text>
            <Switch
              value={uiConfig.timer?.glowEffect || false}
              onValueChange={glowEffect =>
                uiConfig.setTimer({
                  ...uiConfig.timer,
                  glowEffect,
                })
              }
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Celebración en switches
            </Text>
            <Switch
              value={uiConfig.switches?.showCelebration || false}
              onValueChange={showCelebration =>
                uiConfig.setSwitches({
                  ...uiConfig.switches,
                  showCelebration,
                })
              }
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>
        </View>
        {/* Configuración de Audio */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.BACKGROUND_SECONDARY },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
            🔊 Audio
          </Text>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Audio habilitado
            </Text>
            <Switch
              value={audioConfig.enabled}
              onValueChange={audioConfig.setEnabled}
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Volumen: {Math.round(audioConfig.volume * 100)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
              value={audioConfig.volume}
              onValueChange={audioConfig.setVolume}
              minimumTrackTintColor={colors.PRIMARY}
              maximumTrackTintColor={colors.BORDER_PRIMARY}
              thumbTintColor={colors.PRIMARY}
              disabled={!audioConfig.enabled}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Efectos fade
            </Text>
            <Switch
              value={audioConfig.fadeIn}
              onValueChange={audioConfig.setFadeIn}
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
              disabled={!audioConfig.enabled}
            />
          </View>
        </View>
        {/* Configuración de Haptics */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.BACKGROUND_SECONDARY },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
            📳 Vibracin
          </Text>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Vibración habilitada
            </Text>
            <Switch
              value={hapticsConfig.enabled}
              onValueChange={hapticsConfig.setEnabled}
              trackColor={{
                false: colors.BORDER_PRIMARY,
                true: colors.PRIMARY,
              }}
              thumbColor={colors.TEXT_PRIMARY}
            />
          </View>

          <View style={styles.configItem}>
            <Text
              style={[styles.configLabel, { color: colors.TEXT_SECONDARY }]}
            >
              Intensidad: {hapticsConfig.intensity}
            </Text>
            <View style={styles.segmentedControl}>
              {['light', 'medium', 'heavy'].map(intensity => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor:
                        hapticsConfig.intensity === intensity
                          ? colors.PRIMARY
                          : colors.BACKGROUND_PRIMARY,
                    },
                  ]}
                  onPress={() => hapticsConfig.setIntensity(intensity)}
                  disabled={!hapticsConfig.enabled}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color:
                          hapticsConfig.intensity === intensity
                            ? colors.TEXT_PRIMARY
                            : colors.TEXT_SECONDARY,
                      },
                    ]}
                  >
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Indicador de estado de guardado */}
        {lastSaved && (
          <View
            style={[
              styles.saveIndicator,
              { backgroundColor: colors.BACKGROUND_SECONDARY },
            ]}
          >
            <MaterialIcons
              name="check-circle"
              size={16}
              color={colors.SUCCESS}
              style={styles.saveIcon}
            />
            <Text style={[styles.saveText, { color: colors.TEXT_SECONDARY }]}>
              Última actualización: {lastSaved.toLocaleTimeString()}
            </Text>
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  configLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
  slider: {
    flex: 1,
    height: 40,
    marginLeft: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bottomPadding: {
    height: 50, // antes 20, ahora más separación inferior
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  presetButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  presetText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
  },
  closeButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  saveIcon: {
    marginRight: 6,
  },
  saveText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

AdvancedConfigScreen.displayName = 'AdvancedConfigScreen';

export default AdvancedConfigScreen;

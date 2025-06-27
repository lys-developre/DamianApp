import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Componente de configuración de sonidos para TEA Timer
 * Permite gestionar tonos nativos y subir archivos MP3 personalizados
 * Optimizado para performance y experiencia de usuario
 */
export default function SoundConfigScreen({ onBack, safeSounds }) {
  const [customSoundStatus, setCustomSoundStatus] = useState({
    soft: false,
    celebration: false,
    'almost-done': false,
  });
  const [loading, setLoading] = useState({});
  const [initialized, setInitialized] = useState(false);

  /**
   * Tipos de sonidos configurables - Memoizado para performance
   */
  const soundTypes = React.useMemo(
    () => [
      {
        key: 'soft',
        name: 'Cambio de Frase',
        description: 'Sonido suave cuando cambia la frase motivacional',
        icon: 'notifications-none',
        defaultDescription: 'Tono de notificación suave del sistema',
        color: '#4CAF50',
      },
      {
        key: 'celebration',
        name: 'Celebración Épica',
        description: 'Fanfarria cuando se completa el temporizador',
        icon: 'celebration',
        defaultDescription: 'Secuencia de tonos de logro del sistema',
        color: '#FF9800',
      },
      {
        key: 'almost-done',
        name: 'Casi Listo',
        description: 'Sonido cuando falta poco para terminar (95%)',
        icon: 'timer',
        defaultDescription: 'Tono de atención positiva del sistema',
        color: '#9C27B0',
      },
    ],
    []
  );

  /**
   * Inicializa el estado de sonidos personalizados al cargar
   */
  useEffect(() => {
    const initializeSoundStatus = async () => {
      if (!safeSounds || initialized) return;

      try {
        setLoading(prev => ({ ...prev, init: true }));

        // Verificar qué sonidos personalizados están cargados
        const status = {};
        for (const soundType of soundTypes) {
          status[soundType.key] =
            safeSounds.customSounds?.has(soundType.key) || false;
        }

        setCustomSoundStatus(status);
        setInitialized(true);
      } catch (_error) {
        // Error silencioso, usar estado por defecto
      } finally {
        setLoading(prev => ({ ...prev, init: false }));
      }
    };

    initializeSoundStatus();
  }, [safeSounds, soundTypes, initialized]);

  /**
   * Sube un archivo MP3 personalizado para un tipo de sonido
   * Optimizado con loading states y mejor UX
   */
  const handleUploadCustomSound = useCallback(
    async type => {
      if (!safeSounds) return;

      try {
        setLoading(prev => ({ ...prev, [type]: true }));

        const success = await safeSounds.uploadCustomSound(type);
        if (success) {
          setCustomSoundStatus(prev => ({
            ...prev,
            [type]: true,
          }));

          // Feedback visual y táctil
          if (safeSounds.phraseChange) {
            safeSounds.phraseChange();
          }
        }
      } catch (_error) {
        Alert.alert('❌ Error', 'No se pudo cargar el archivo de audio', [
          { text: 'OK' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
      }
    },
    [safeSounds]
  );

  /**
   * Elimina un sonido personalizado y vuelve al nativo
   * Optimizado con loading states
   */
  const handleRemoveCustomSound = useCallback(
    type => {
      if (!safeSounds) return;

      Alert.alert(
        '🗑️ Eliminar Sonido Personalizado',
        '¿Quieres volver a usar el tono nativo del sistema?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                setLoading(prev => ({ ...prev, [type]: true }));

                await safeSounds.removeCustomSound(type);
                setCustomSoundStatus(prev => ({
                  ...prev,
                  [type]: false,
                }));

                // Feedback de éxito
                if (safeSounds.phraseChange) {
                  safeSounds.phraseChange();
                }
              } catch (_error) {
                Alert.alert('❌ Error', 'No se pudo eliminar el sonido', [
                  { text: 'OK' },
                ]);
              } finally {
                setLoading(prev => ({ ...prev, [type]: false }));
              }
            },
          },
        ]
      );
    },
    [safeSounds]
  );

  /**
   * Reproduce un sonido de muestra
   * Optimizado con loading states y mejor feedback
   */
  const handleTestSound = useCallback(
    async type => {
      if (!safeSounds) return;

      try {
        setLoading(prev => ({ ...prev, [`test-${type}`]: true }));

        await safeSounds.playSound(type, { volume: 0.8 });

        // Feedback visual breve
        setTimeout(() => {
          setLoading(prev => ({ ...prev, [`test-${type}`]: false }));
        }, 1000);
      } catch (_error) {
        Alert.alert('⚠️ Aviso', 'No se pudo reproducir el sonido de muestra', [
          { text: 'OK' },
        ]);
        setLoading(prev => ({ ...prev, [`test-${type}`]: false }));
      }
    },
    [safeSounds]
  );

  /**
   * Renderiza un botón de acción optimizado
   */
  const renderActionButton = useCallback(
    (props, soundKey) => {
      const isLoading = loading[props.loadingKey] || false;

      return (
        <TouchableOpacity
          style={[props.style, isLoading && styles.buttonLoading]}
          onPress={props.onPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MaterialIcons name={props.icon} size={20} color="#ffffff" />
          )}
          <Text style={props.textStyle}>
            {isLoading ? props.loadingText : props.text}
          </Text>
        </TouchableOpacity>
      );
    },
    [loading]
  );

  return (
    <View style={styles.container}>
      {/* Header optimizado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔊 Configuración de Sonidos</Text>
      </View>

      {/* Loading inicial */}
      {loading.init ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Cargando configuración...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
        >
          {/* Información del sistema - Optimizada */}
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={24} color="#4ECDC4" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Sistema Híbrido de Audio</Text>
              <Text style={styles.infoText}>
                • <Text style={styles.boldText}>Por defecto</Text>: Tonos
                nativos del sistema{'\n'}•{' '}
                <Text style={styles.boldText}>Personalizable</Text>: Sube
                archivos MP3 propios{'\n'}•{' '}
                <Text style={styles.boldText}>Amigable TEA</Text>: Sonidos
                suaves y no sobresaltantes
              </Text>
            </View>
          </View>

          {/* Lista de tipos de sonidos - Optimizada */}
          {soundTypes.map(soundType => (
            <SoundCard
              key={soundType.key}
              soundType={soundType}
              isCustom={customSoundStatus[soundType.key]}
              onUpload={() => handleUploadCustomSound(soundType.key)}
              onRemove={() => handleRemoveCustomSound(soundType.key)}
              onTest={() => handleTestSound(soundType.key)}
              loading={loading}
              renderActionButton={renderActionButton}
            />
          ))}

          {/* Guía optimizada */}
          <GuideCard />
        </ScrollView>
      )}
    </View>
  );
}

/**
 * Componente optimizado para cada tarjeta de sonido
 * Separado para mejorar performance con React.memo
 */
const SoundCard = React.memo(
  ({
    soundType,
    isCustom,
    onUpload,
    onRemove,
    onTest,
    loading,
    renderActionButton,
  }) => (
    <View style={styles.soundCard}>
      {/* Header del sonido */}
      <View style={styles.soundHeader}>
        <MaterialIcons
          name={soundType.icon}
          size={28}
          color={soundType.color || '#1A237E'}
        />
        <View style={styles.soundInfo}>
          <Text style={styles.soundName}>{soundType.name}</Text>
          <Text style={styles.soundDescription}>{soundType.description}</Text>
        </View>
      </View>

      {/* Estado actual */}
      <View style={styles.soundStatus}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isCustom ? '#4CAF50' : '#7C4DFF' },
          ]}
        >
          <MaterialIcons
            name={isCustom ? 'audiotrack' : 'speaker'}
            size={16}
            color="#ffffff"
          />
          <Text style={styles.statusText}>
            {isCustom ? 'MP3 Personalizado' : 'Tono Nativo'}
          </Text>
        </View>
      </View>

      {/* Descripción del estado actual */}
      <Text style={styles.currentDescription}>
        {isCustom
          ? 'Usando archivo MP3 personalizado'
          : soundType.defaultDescription}
      </Text>

      {/* Botones de acción optimizados */}
      <View style={styles.actionButtons}>
        {/* Botón de test */}
        {renderActionButton(
          {
            style: styles.testButton,
            textStyle: styles.testButtonText,
            icon: loading[`test-${soundType.key}`]
              ? 'hourglass-empty'
              : 'play-arrow',
            text: 'Probar',
            loadingText: 'Sonando...',
            loadingKey: `test-${soundType.key}`,
            onPress: onTest,
          },
          soundType.key
        )}

        {/* Botón de subir/cambiar */}
        {renderActionButton(
          {
            style: styles.uploadButton,
            textStyle: styles.uploadButtonText,
            icon: loading[soundType.key]
              ? 'hourglass-empty'
              : isCustom
                ? 'edit'
                : 'upload',
            text: isCustom ? 'Cambiar' : 'Subir MP3',
            loadingText: 'Cargando...',
            loadingKey: soundType.key,
            onPress: onUpload,
          },
          soundType.key
        )}

        {/* Botón de eliminar (solo si hay personalizado) */}
        {isCustom &&
          renderActionButton(
            {
              style: styles.removeButton,
              textStyle: styles.removeButtonText,
              icon: loading[soundType.key] ? 'hourglass-empty' : 'delete',
              text: 'Eliminar',
              loadingText: 'Eliminando...',
              loadingKey: soundType.key,
              onPress: onRemove,
            },
            soundType.key
          )}
      </View>
    </View>
  )
);
SoundCard.displayName = 'SoundCard';

/**
 * Componente de guía separado para optimización
 */
const GuideCard = React.memo(() => (
  <View style={styles.guideCard}>
    <Text style={styles.guideTitle}>📋 Guía para Archivos MP3</Text>
    <Text style={styles.guideText}>
      <Text style={styles.boldText}>Formato recomendado:</Text>
      {'\n'}• Formato: MP3 o WAV{'\n'}• Calidad: 22kHz, 16-bit{'\n'}• Tamaño:
      Menor a 50KB{'\n'}• Duración: 200ms - 3 segundos{'\n'}
      {'\n'}
      <Text style={styles.boldText}>Consejos para TEA:</Text>
      {'\n'}• Sonidos suaves, no agresivos{'\n'}• Volumen moderado{'\n'}• Tonos
      agudos pero suaves{'\n'}• Evitar sonidos metálicos o estridentes
    </Text>
  </View>
));
GuideCard.displayName = 'GuideCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A237E', // Mismo color que DigitalTimer
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40, // Para status bar
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  backButton: {
    marginRight: 15,
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A47',
    marginLeft: 10,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#2E3A47',
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },

  boldText: {
    fontWeight: '700',
  },

  soundCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  soundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  soundInfo: {
    marginLeft: 12,
    flex: 1,
  },

  soundName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A47',
    marginBottom: 4,
  },

  soundDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  soundStatus: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },

  currentDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
  },

  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 2,
    justifyContent: 'center',
  },

  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },

  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
  },

  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },

  guideCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    marginBottom: 30,
  },

  guideTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A47',
    marginBottom: 12,
  },

  guideText: {
    fontSize: 14,
    color: '#2E3A47',
    lineHeight: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },

  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 15,
    fontWeight: '600',
  },

  buttonLoading: {
    opacity: 0.7,
  },

  infoContent: {
    marginLeft: 10,
    flex: 1,
  },
});

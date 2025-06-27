import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import ConfettiCannon from 'react-native-confetti-cannon';

/**
 * Utilidad para manejar haptics de forma segura con diagnóstico
 * Incluye vibraciones más potentes y duraderas para mejor feedback
 */
const safeHaptics = {
  /**
   * Ejecuta un haptic de forma segura con manejo de errores
   * @param {Function} hapticsFunction - Función de haptics a ejecutar
   * @param {string} type - Tipo de haptic para logging
   */
  async execute(hapticsFunction, type = 'haptic') {
    try {
      await hapticsFunction();
      // Solo logging en desarrollo, sin console statements en producción
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`✅ Haptic ${type} ejecutado correctamente`);
      }
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Error en haptic ${type}:`, error.message);
        // eslint-disable-next-line no-console
        console.warn('Posibles causas:');
        // eslint-disable-next-line no-console
        console.warn('1. Dispositivo sin soporte de vibración');
        // eslint-disable-next-line no-console
        console.warn('2. Haptics deshabilitados en configuración del sistema');
        // eslint-disable-next-line no-console
        console.warn(
          '3. Ejecutándose en simulador (solo dispositivos físicos)'
        );
        // eslint-disable-next-line no-console
        console.warn('4. Falta permiso VIBRATE en Android');
      }
    }
  },

  /**
   * Haptic suave mejorado - múltiples pulsos para mayor duración
   */
  async light() {
    await this.execute(async () => {
      // Secuencia de pulsos suaves para mayor duración
      for (let i = 0; i < 2; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (i < 1) await new Promise(resolve => setTimeout(resolve, 100));
      }
    }, 'Light Enhanced');
  },

  /**
   * Haptic medio mejorado - más intenso y duradero
   */
  async medium() {
    await this.execute(async () => {
      // Combinación de medium + heavy para mayor potencia
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(resolve => setTimeout(resolve, 150));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 'Medium Enhanced');
  },

  /**
   * Haptic fuerte mejorado - máxima potencia y duración
   */
  async heavy() {
    await this.execute(async () => {
      // Secuencia de vibraciones fuertes para máximo impacto
      for (let i = 0; i < 3; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
      }
    }, 'Heavy Enhanced');
  },

  /**
   * Haptic de notificación de éxito potenciado
   */
  async success() {
    await this.execute(async () => {
      // Notificación de éxito seguida de vibración fuerte
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 300));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 'Success Enhanced');
  },

  /**
   * Celebración épica - vibración de máxima potencia para completar temporizador
   */
  async celebration() {
    await this.execute(async () => {
      // Secuencia épica para celebración
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Múltiples pulsos fuertes con ritmo acelerado
      const delays = [300, 250, 200, 150, 100];
      for (let i = 0; i < 5; i++) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (i < 4) await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }, 'Celebration Epic');
  },
};

/**
 * Utilidad para manejar sonidos de forma segura en Android
 * Sistema híbrido: tonos nativos de Android + archivos MP3 personalizados
 */
const safeSounds = {
  /**
   * Configuración de audio inicializada
   */
  isInitialized: false,
  customSounds: new Map(), // Cache para sonidos personalizados

  /**
   * Inicializa el sistema de audio de forma segura
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configuración básica de audio compatible con Android
      await Audio.setAudioModeAsync({
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      this.isInitialized = true;

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('🔊 Sistema de audio inicializado');
      }
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('⚠️ Audio no disponible:', error.message);
      }
    }
  },

  /**
   * Carga un archivo de audio personalizado
   */
  async loadCustomSound(type, uri) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      this.customSounds.set(type, sound);

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`✅ Sonido personalizado ${type} cargado`);
      }

      return true;
    } catch (_error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Error cargando sonido ${type}:`, _error.message);
      }
      return false;
    }
  },

  /**
   * Reproduce sonido usando archivo personalizado o tono nativo
   */
  async playSound(type, options = {}) {
    try {
      await this.initialize();

      // Intentar reproducir sonido personalizado primero
      if (this.customSounds.has(type)) {
        const sound = this.customSounds.get(type);
        await sound.setVolumeAsync(options.volume || 0.7);
        await sound.replayAsync();

        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(`🎵 Sonido personalizado ${type} reproducido`);
        }
        return;
      }

      // Fallback a tonos nativos del sistema
      await this.playNativeSound(type, options);
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Error reproduciendo sonido ${type}:`, error.message);
      }

      // Fallback final: solo vibración
      if (type === 'celebration') {
        safeHaptics.celebration();
      } else {
        safeHaptics.light();
      }
    }
  },

  /**
   * Reproduce tonos nativos del sistema Android/iOS
   */
  async playNativeSound(type, options = {}) {
    try {
      // Android: Usar sonidos incluidos en assets
      switch (type) {
        case 'soft':
          // Sonido suave - usar tono de notificación del sistema
          await Audio.Sound.createAsync(
            require('../assets/sounds/notification_soft.wav'),
            {
              volume: options.volume || 0.4,
              shouldPlay: true,
              isLooping: false,
            }
          )
            .then(({ sound }) => {
              sound.playAsync();
              // Liberar memoria después de reproducir
              setTimeout(() => sound.unloadAsync(), 2000);
            })
            .catch(() => {
              // Fallback: vibración suave
              safeHaptics.light();
            });
          break;
        case 'phrase-change':
          // Cambio de frase - secuencia ascendente llamativa
          await Audio.Sound.createAsync(
            require('../assets/sounds/phrase_change.wav'),
            {
              volume: options.volume || 0.6,
              shouldPlay: true,
              isLooping: false,
            }
          )
            .then(({ sound }) => {
              sound.playAsync();
              // Liberar memoria después de reproducir
              setTimeout(() => sound.unloadAsync(), 2000);
            })
            .catch(() => {
              // Fallback: vibración suave
              safeHaptics.light();
            });
          break;
        case 'celebration':
          // Celebración - secuencia de sonidos épicos
          for (let i = 0; i < 3; i++) {
            await Audio.Sound.createAsync(
              require('../assets/sounds/celebration_epic.wav'),
              {
                volume: Math.min((options.volume || 0.7) + i * 0.1, 1.0),
                shouldPlay: true,
                isLooping: false,
              }
            )
              .then(({ sound }) => {
                sound.playAsync();
                // Liberar memoria después de reproducir
                setTimeout(() => sound.unloadAsync(), 3000);
              })
              .catch(() => {
                // Fallback: vibración de celebración
                safeHaptics.celebration();
              });

            if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
          }
          break;
        case 'almost-done':
          // Casi listo - tono de atención positiva
          await Audio.Sound.createAsync(
            require('../assets/sounds/almost_done.wav'),
            {
              volume: options.volume || 0.6,
              shouldPlay: true,
              isLooping: false,
            }
          )
            .then(({ sound }) => {
              sound.playAsync();
              // Liberar memoria después de reproducir
              setTimeout(() => sound.unloadAsync(), 2000);
            })
            .catch(() => {
              // Fallback: vibración suave
              safeHaptics.light();
            });
          break;
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`🎵 Tono nativo Android ${type} reproducido`);
      }
    } catch (error) {
      // Fallback: simulación temporal (como antes)
      await this.playSimulatedSound(type);

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`Usando simulación para ${type}:`, error.message);
      }
    }
  },

  /**
   * Fallback: simulación temporal (sistema anterior)
   */
  async playSimulatedSound(type) {
    switch (type) {
      case 'soft':
        await new Promise(resolve => setTimeout(resolve, 100));
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('🔔 Simulación: sonido suave');
        }
        break;

      case 'phrase-change':
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('🎼 Simulación: cambio de frase ascendente...');
        }
        // Simular secuencia de 4 notas ascendentes
        for (let i = 0; i < 4; i++) {
          await new Promise(resolve => setTimeout(resolve, 120));
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log(`🎵 Nota ${i + 1}/4 (${['C5', 'E5', 'G5', 'C6'][i]})`);
          }
        }
        break;

      case 'celebration':
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('🎵 Simulación: celebración épica...');
        }

        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 150));
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log(`🎼 Simulación nota ${i + 1}/3`);
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        break;

      default:
        await new Promise(resolve => setTimeout(resolve, 50));
    }
  },

  /**
   * Abre selector de archivos para subir audio personalizado
   */
  async uploadCustomSound(type) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // Copiar archivo a directorio permanente
        const fileName = `custom_${type}.mp3`;
        const localUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.copyAsync({
          from: result.uri,
          to: localUri,
        });

        // Cargar el sonido personalizado
        const success = await this.loadCustomSound(type, localUri);

        if (success) {
          // Guardar configuración para persistencia
          await this.saveCustomSoundConfig(type, localUri);

          Alert.alert(
            '✅ Sonido Personalizado',
            `Archivo de audio para "${type}" cargado correctamente`,
            [{ text: 'OK' }]
          );

          return true;
        }
      }

      return false;
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo cargar el archivo de audio', [
        { text: 'OK' },
      ]);

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Error subiendo sonido:', error);
      }

      return false;
    }
  },

  /**
   * Guarda configuración de sonidos personalizados
   */
  async saveCustomSoundConfig(type, uri) {
    try {
      const configPath = `${FileSystem.documentDirectory}custom_sounds_config.json`;
      let config = {};

      // Leer configuración existente
      try {
        const existingConfig = await FileSystem.readAsStringAsync(configPath);
        config = JSON.parse(existingConfig);
      } catch {
        // Archivo no existe, usar configuración vacía
      }

      // Actualizar configuración
      config[type] = uri;

      // Guardar configuración actualizada
      await FileSystem.writeAsStringAsync(configPath, JSON.stringify(config));

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('💾 Configuración de sonidos guardada');
      }
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn('Error guardando configuración:', error);
      }
    }
  },

  /**
   * Carga sonidos personalizados al inicializar
   */
  async loadCustomSoundsFromConfig() {
    try {
      const configPath = `${FileSystem.documentDirectory}custom_sounds_config.json`;
      const configString = await FileSystem.readAsStringAsync(configPath);
      const config = JSON.parse(configString);

      for (const [type, uri] of Object.entries(config)) {
        await this.loadCustomSound(type, uri);
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('📁 Sonidos personalizados cargados desde configuración');
      }
    } catch (_error) {
      // No hay configuración guardada, usar tonos nativos
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('📁 No hay sonidos personalizados, usando tonos nativos');
      }
    }
  },

  /**
   * Elimina un sonido personalizado
   */
  async removeCustomSound(type) {
    try {
      if (this.customSounds.has(type)) {
        const sound = this.customSounds.get(type);
        await sound.unloadAsync();
        this.customSounds.delete(type);
      }

      // Actualizar configuración
      const configPath = `${FileSystem.documentDirectory}custom_sounds_config.json`;
      try {
        const configString = await FileSystem.readAsStringAsync(configPath);
        const config = JSON.parse(configString);
        delete config[type];
        await FileSystem.writeAsStringAsync(configPath, JSON.stringify(config));
      } catch {
        // Configuración no existe
      }

      Alert.alert(
        '🗑️ Sonido Eliminado',
        `Se volverá a usar el tono nativo para "${type}"`,
        [{ text: 'OK' }]
      );

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`🗑️ Sonido personalizado ${type} eliminado`);
      }
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Error eliminando sonido:', error);
      }
    }
  },

  /**
   * Métodos de conveniencia para eventos específicos
   */
  async phraseChange() {
    await this.playSound('phrase-change', { volume: 0.6 });
  },

  async epicCelebration() {
    await this.playSound('celebration', { volume: 0.8 });
  },

  async almostDone() {
    await this.playSound('almost-done', { volume: 0.6 });
  },
};

/**
 * Frases motivacionales para TEA - Progresión lógica y refuerzo positivo
 */
const motivationalPhrases = [
  { minProgress: 0, maxProgress: 15, phrase: 'Tenemos que esperar' },
  { minProgress: 15, maxProgress: 25, phrase: 'Soy paciente' },
  { minProgress: 25, maxProgress: 35, phrase: 'Espero tranquilo' },
  { minProgress: 35, maxProgress: 45, phrase: 'Lo estoy haciendo bien' },
  { minProgress: 45, maxProgress: 55, phrase: 'Ya queda poco' },
  { minProgress: 55, maxProgress: 65, phrase: 'Muy bien hecho' },
  { minProgress: 65, maxProgress: 75, phrase: 'Ya casi termino' },
  { minProgress: 75, maxProgress: 85, phrase: 'Falta poquito' },
  { minProgress: 85, maxProgress: 95, phrase: 'Ya casi lo logras' },
  { minProgress: 95, maxProgress: 100, phrase: '¡Ya terminé!' },
];

/**
 * DigitalTimer - Temporizador para terapia TEA
 * Desarrolla paciencia con frases motivacionales progresivas
 */
export default function DigitalTimer() {
  // Estado del componente
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [activePresetIndex, setActivePresetIndex] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Referencias y animaciones
  const intervalRef = useRef(null);
  const textOpacity = useRef(new Animated.Value(1)).current;
  const previousPhrase = useRef('😌 Esperar un poquito');

  // Animaciones para celebración
  const trophyScale = useRef(new Animated.Value(0)).current;
  const medallRotation = useRef(new Animated.Value(0)).current;
  const confettiScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  // Animaciones para frases
  const phraseScale = useRef(new Animated.Value(1)).current;
  const phraseTranslateY = useRef(new Animated.Value(0)).current;

  // Animaciones para progreso
  const progressPulse = useRef(new Animated.Value(1)).current;
  const progressGlow = useRef(new Animated.Value(0)).current;

  // Presets de tiempo para actividades terapéuticas
  const timePresets = [
    { label: '1 minuto', seconds: 60 },
    { label: '2 minutos', seconds: 120 },
    { label: '5 minutos', seconds: 300 },
    { label: '10 minutos', seconds: 600 },
    { label: '15 minutos', seconds: 900 },
    { label: '30 minutos', seconds: 1800 },
    { label: '1 hora', seconds: 3600 },
    { label: '2 horas', seconds: 7200 },
  ];

  // ============================================================================
  // EFECTOS Y LÓGICA DEL TEMPORIZADOR
  // ============================================================================

  /**
   * Efecto para inicializar el sistema de sonidos al cargar el componente
   *
   * FUNCIONALIDADES:
   * - Inicializa el sistema de audio
   * - Carga sonidos personalizados guardados
   * - Configura el sistema híbrido (nativo + personalizado)
   */
  useEffect(() => {
    const initializeSounds = async () => {
      // Inicializar sistema base
      await safeSounds.initialize();

      // Cargar sonidos personalizados guardados
      await safeSounds.loadCustomSoundsFromConfig();
    };

    initializeSounds();
  }, []); // Solo ejecutar una vez al montar el componente

  /**
   * Efecto principal para manejar el countdown del temporizador
   *
   * FUNCIONALIDADES:
   * - Ejecuta el countdown cada segundo cuando el temporizador está activo
   * - Detiene automáticamente el temporizador cuando llega a 0
   * - Muestra mensaje de felicitación al completar el tiempo
   * - Limpia el intervalo para prevenir memory leaks
   *
   * DEPENDENCIAS:
   * - isRunning: Controla si el temporizador debe ejecutarse
   * - time: Tiempo actual para determinar cuándo parar
   *
   * @effect
   * @dependency {boolean} isRunning - Estado de ejecución del temporizador
   * @dependency {number} time - Tiempo restante en segundos
   */
  useEffect(() => {
    // Solo ejecutar el countdown si el temporizador está corriendo y hay tiempo restante
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          // Cuando el tiempo llega a 1 segundo o menos, finalizar
          if (prevTime <= 1) {
            setIsRunning(false);
            // Iniciar celebración fantástica
            startCelebration();
            return 0;
          }
          // Decrementar el tiempo en 1 segundo
          return prevTime - 1;
        });
      }, 1000); // Ejecutar cada 1000ms (1 segundo)
    } else if (intervalRef.current) {
      // Limpiar el intervalo si el temporizador no está corriendo
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Función de limpieza para prevenir memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, startCelebration]);

  /**
   * Efecto para animar la barra de progreso con pulsación y brillo
   *
   * FUNCIONALIDADES:
   * - Animación de pulsación cuando el temporizador está activo
   * - Efecto de brillo que se intensifica con el progreso
   * - Feedback visual dinámico del estado del temporizador
   */
  useEffect(() => {
    if (isRunning && time > 0) {
      // Animación de pulsación continua para la barra de progreso
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressPulse, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(progressPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Animación de brillo que se intensifica con el progreso
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(progressGlow, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(progressGlow, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    } else {
      // Resetear animaciones cuando no está corriendo
      progressPulse.setValue(1);
      progressGlow.setValue(0);
    }
  }, [isRunning, time, progressPulse, progressGlow]);

  /**
   * Efecto para animar el cambio de frases motivacionales
   *
   * FUNCIONALIDAD MEJORADA:
   * - Detecta cuando cambia la frase motivacional
   * - Aplica animaciones múltiples: fade, escala y traslación
   * - Efectos de entrada más dinámicos y atractivos
   * - Feedback táctil suave al cambiar frases
   *
   * @effect
   * @dependency {string} getCurrentMotivationalPhrase() - Frase actual
   */
  useEffect(() => {
    const currentPhrase = getCurrentMotivationalPhrase();

    if (previousPhrase.current !== currentPhrase) {
      // Vibración suave al cambiar de frase para feedback táctil
      safeHaptics.light();

      // Sonido suave para el cambio de frase - DESHABILITADO según requerimientos
      // safeSounds.phraseChange();

      // Animación mejorada con múltiples efectos
      Animated.sequence([
        // Fase 1: Salida con fade, escala y traslación hacia arriba
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(phraseScale, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(phraseTranslateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Fase 2: Entrada con bounce y traslación desde abajo
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(phraseScale, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(phraseTranslateY, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      previousPhrase.current = currentPhrase;
    }
  }, [
    time,
    isRunning,
    textOpacity,
    phraseScale,
    phraseTranslateY,
    getCurrentMotivationalPhrase,
  ]);

  // ============================================================================
  // FUNCIONES DE CELEBRACIÓN
  // ============================================================================

  /**
   * Inicia la secuencia de celebración fantástica
   *
   * CARACTERÍSTICAS:
   * - Vibración en patrones rítmicos
   * - Animaciones secuenciales de elementos
   * - Confeti y efectos visuales
   * - Sonidos de celebración (si están disponibles)
   */
  const startCelebration = useCallback(() => {
    setShowCelebration(true);

    // Vibración épica de celebración con máxima potencia
    safeHaptics.celebration();

    // Sonido épico de celebración
    safeSounds.epicCelebration();

    // Secuencia de animaciones
    Animated.sequence([
      // 1. Fade in del modal
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // 2. Aparecer trofeo con efecto bounce
      Animated.spring(trophyScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      // 3. Rotación de medallas
      Animated.timing(medallRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      // 4. Confeti explosion
      Animated.spring(confettiScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotación continua de medallas
    const rotateAnimation = () => {
      medallRotation.setValue(0);
      Animated.loop(
        Animated.timing(medallRotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };

    setTimeout(rotateAnimation, 1000);
  }, [modalOpacity, trophyScale, medallRotation, confettiScale]);

  /**
   * Efecto especial cuando se alcanza el 95% del progreso
   *
   * CARACTERÍSTICAS:
   * - Activación de confeti anticipado
   * - Vibración especial de "casi listo"
   * - Intensificación de animaciones de progreso
   */
  const triggerAlmostDoneEffect = useCallback(() => {
    // Vibración potente para indicar que falta poco - usando heavy mejorado
    safeHaptics.heavy();

    // Sonido de "casi listo" para feedback auditivo
    safeSounds.almostDone();

    // Segunda vibración de confirmación más potente
    setTimeout(() => {
      safeHaptics.medium();
    }, 400);
  }, []);

  // Efecto para detectar cuando se alcanza el 95%
  useEffect(() => {
    const progress = getProgress();
    if (progress >= 95 && progress < 100 && isRunning) {
      triggerAlmostDoneEffect();
    }
  }, [getProgress, isRunning, triggerAlmostDoneEffect]);

  /**
   * Cierra el modal de celebración, resetea animaciones y reinicia el temporizador
   */
  const closeCelebration = useCallback(() => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCelebration(false);
      // Reset de todas las animaciones
      trophyScale.setValue(0);
      medallRotation.setValue(0);
      confettiScale.setValue(0);
      modalOpacity.setValue(0);

      // Reiniciar automáticamente el temporizador
      setTime(initialTime);
      setIsRunning(false);
      setActivePresetIndex(null);
    });
  }, [modalOpacity, trophyScale, medallRotation, confettiScale, initialTime]);

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  /**
   * Convierte segundos a formato de tiempo legible HH:MM:SS
   *
   * PROPÓSITO:
   * - Proporciona una visualización consistente del tiempo
   * - Facilita la comprensión del tiempo restante
   * - Mantiene formato estándar independientemente de la duración
   *
   * FORMATO DE SALIDA:
   * - Siempre muestra horas, minutos y segundos (HH:MM:SS)
   * - Añade ceros a la izquierda para mantener consistencia visual
   * - Ejemplos: "00:05:30", "01:15:45", "02:00:00"
   *
   * @param {number} seconds - Tiempo en segundos a convertir
   * @returns {string} Tiempo formateado como "HH:MM:SS"
   *
   * @example
   * formatTime(90) // returns "00:01:30"
   * formatTime(3661) // returns "01:01:01"
   */
  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600); // Calcular horas completas
    const minutes = Math.floor((seconds % 3600) / 60); // Calcular minutos restantes
    const secs = seconds % 60; // Calcular segundos restantes

    // Formatear con ceros a la izquierda para consistencia visual
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // FUNCIONES DE CONTROL DEL TEMPORIZADOR
  // ============================================================================

  /**
   * Alterna entre iniciar y pausar el temporizador
   *
   * VALIDACIONES:
   * - Verifica que haya tiempo configurado antes de iniciar
   * - Muestra alerta educativa si no hay tiempo seleccionado
   *
   * COMPORTAMIENTO:
   * - Si está parado y hay tiempo: inicia el temporizador
   * - Si está corriendo: pausa el temporizador
   * - Si no hay tiempo: muestra mensaje instructivo
   *
   * @function
   * @name toggleTimer
   * @fires Alert - Cuando no hay tiempo configurado
   */
  const toggleTimer = () => {
    // Validar que hay tiempo configurado antes de iniciar
    if (time === 0 && !isRunning) {
      Alert.alert(
        'Sin tiempo configurado',
        'Por favor, selecciona un tiempo para el temporizador.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    // Alternar estado de ejecución
    setIsRunning(!isRunning);
  };

  /**
   * Reinicia el temporizador a su estado inicial
   *
   * ACCIONES REALIZADAS:
   * - Detiene el temporizador si está corriendo
   * - Restaura el tiempo al valor inicial configurado
   * - Limpia la selección de preset activo
   *
   * CASOS DE USO:
   * - Reiniciar un temporizador pausado
   * - Volver a ejecutar el mismo tiempo
   * - Cancelar un temporizador en progreso
   *
   * @function
   * @name resetTimer
   */
  const resetTimer = () => {
    setIsRunning(false); // Detener temporizador
    setTime(initialTime); // Restaurar tiempo inicial
    setActivePresetIndex(null); // Limpiar selección de preset
  };

  /**
   * Configura un nuevo tiempo usando un preset predefinido
   *
   * ACCIONES REALIZADAS:
   * - Detiene cualquier temporizador en ejecución
   * - Establece el nuevo tiempo seleccionado
   * - Guarda el tiempo inicial para funciones de reset
   * - Marca el preset como activo visualmente
   *
   * PARÁMETROS:
   * @param {number} seconds - Tiempo en segundos del preset seleccionado
   * @param {number} index - Índice del preset en el array para tracking visual
   *
   * @function
   * @name setPresetTime
   */
  const setPresetTime = (seconds, index) => {
    setIsRunning(false); // Asegurar que el temporizador esté detenido
    setTime(seconds); // Establecer el nuevo tiempo
    setInitialTime(seconds); // Guardar para funciones de reset
    setActivePresetIndex(index); // Marcar preset como activo
  };

  // ============================================================================
  // FUNCIONES DE CÁLCULO Y UTILIDADES
  // ============================================================================

  /**
   * Calcula el porcentaje de progreso del temporizador actual
   *
   * PROPÓSITO:
   * - Proporciona valor para la visualización del progreso de fondo
   * - Permite mostrar gráficamente cuánto tiempo ha transcurrido
   *
   * CÁLCULO:
   * - Porcentaje = (tiempo transcurrido / tiempo total) * 100
   * - Tiempo transcurrido = tiempo inicial - tiempo restante
   * - Cuando el tiempo llega a 0, se asegura que el progreso sea exactamente 100%
   *
   * CASOS ESPECIALES:
   * - Si no hay tiempo inicial configurado: retorna 0%
   * - Si el tiempo restante es 0: retorna 100% (completado)
   * - El resultado se usa para la altura del fondo de progreso
   *
   * @returns {number} Porcentaje de progreso (0-100)
   *
   * @example
   * // Con 5 minutos inicial y 2 minutos restantes
   * getProgress() // returns 60 (60% completado)
   * // Con tiempo completado (0 segundos restantes)
   * getProgress() // returns 100 (100% completado)
   */
  const getProgress = useCallback(() => {
    if (initialTime === 0) return 0;

    // Si el tiempo restante es 0, asegurar que el progreso sea 100%
    if (time === 0) return 100;

    const progress = ((initialTime - time) / initialTime) * 100;
    // Asegurar que nunca exceda 100% y redondear para precisión
    return Math.min(Math.round(progress * 100) / 100, 100);
  }, [initialTime, time]);

  /**
   * Obtiene la frase motivacional apropiada según el progreso del temporizador
   *
   * LÓGICA DE SELECCIÓN:
   * - Calcula el progreso actual como porcentaje
   * - Encuentra la frase que corresponde al rango de progreso
   * - Proporciona refuerzo positivo progresivo
   *
   * CASOS ESPECIALES:
   * - Si no hay tiempo inicial: muestra mensaje de autoafirmación base
   * - Si el temporizador no está corriendo: muestra mensaje estático
   *
   * @returns {string} Frase motivacional apropiada para el momento actual
   *
   * @example
   * // Con 50% de progreso
   * getCurrentMotivationalPhrase() // returns "Hay que esperar un poco más"
   */
  const getCurrentMotivationalPhrase = useCallback(() => {
    // Si no hay tiempo configurado o no está corriendo, mostrar mensaje base
    if (initialTime === 0 || !isRunning) {
      return '😌 Esperar un poquito';
    }

    const progress = getProgress();

    // Buscar la frase que corresponde al progreso actual
    const currentPhrase = motivationalPhrases.find(
      phrase => progress >= phrase.minProgress && progress < phrase.maxProgress
    );

    // Fallback al mensaje base si no se encuentra una frase
    return currentPhrase ? currentPhrase.phrase : '😌 Esperar un poquito';
  }, [initialTime, isRunning, getProgress]); // Dependencias del callback

  // ============================================================================
  // FUNCIONES DE RENDERIZADO
  // ============================================================================

  /**
   * Renderiza el texto de los botones preset con formato especializado
   *
   * DISEÑO VISUAL:
   * - Separa el número de la unidad de tiempo para mejor legibilidad
   * - Aplica estilos diferentes al número (más grande) y unidad (más pequeña)
   * - Adapta estilos según el estado: activo, deshabilitado, normal
   *
   * ACCESIBILIDAD:
   * - Mejora la comprensión visual del tiempo
   * - Destaca el número para reconocimiento rápido
   * - Mantiene consistencia en todos los estados
   *
   * @param {string} label - Etiqueta del preset (ej: "5 minutos")
   * @param {boolean} isActive - Si este preset está actualmente seleccionado
   * @param {boolean} isDisabled - Si este preset está deshabilitado
   * @returns {JSX.Element} Componente con texto formateado
   *
   * @example
   * renderPresetText("5 minutos", true, false)
   * // Renderiza "5" en grande y "minutos" en pequeño con estilos activos
   */
  const renderPresetText = (label, isActive, isDisabled) => {
    // Separar número y unidad para estilizado diferencial
    const parts = label.split(' ');
    const number = parts[0]; // "5", "1", "30", etc.
    const unit = parts.slice(1).join(' '); // "minuto", "minutos", "hora", "horas"

    return (
      <View style={styles.presetTextContainer}>
        {/* Número destacado */}
        <Text
          style={[
            styles.presetButtonNumber,
            isActive && styles.presetButtonNumberActive,
            isDisabled && styles.presetButtonNumberDisabled,
          ]}
        >
          {number}
        </Text>
        {/* Unidad de tiempo */}
        <Text
          style={[
            styles.presetButtonUnit,
            isActive && styles.presetButtonUnitActive,
            isDisabled && styles.presetButtonUnitDisabled,
          ]}
        >
          {unit}
        </Text>
      </View>
    );
  };

  // ============================================================================
  // COMPONENTES INTERNOS OPTIMIZADOS
  // ============================================================================

  /**
   * Componente optimizado para el display del tiempo
   * Separado para evitar re-renders innecesarios
   */
  const TimeDisplay = React.memo(({ time, isRunning }) => (
    <View style={styles.displayContainer}>
      <Text style={styles.timeDisplay}>{formatTime(time)}</Text>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isRunning ? '#00C853' : '#E91E63' },
          ]}
        />
        <Text style={styles.statusText}>
          {isRunning ? 'Esperando...' : time > 0 ? 'Pausado' : 'Detenido'}
        </Text>
      </View>
    </View>
  ));
  TimeDisplay.displayName = 'TimeDisplay';

  /**
   * Componente optimizado para botones de control
   * Evita re-renders cuando solo cambia el tiempo
   */
  const ControlButtons = React.memo(
    ({ isRunning, toggleTimer, resetTimer }) => (
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playPauseButton]}
          onPress={toggleTimer}
          activeOpacity={0.8}
          accessibilityLabel={
            isRunning ? 'Pausar temporizador' : 'Iniciar temporizador'
          }
        >
          <MaterialIcons
            name={isRunning ? 'pause' : 'play-arrow'}
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
          activeOpacity={0.8}
          accessibilityLabel="Reiniciar temporizador"
        >
          <MaterialIcons name="stop" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    )
  );
  ControlButtons.displayName = 'ControlButtons';

  /**
   * Componente optimizado para presets de tiempo
   * Se renderiza solo cuando cambia el preset activo
   */
  const TimePresets = React.memo(
    ({ timePresets, activePresetIndex, setPresetTime, renderPresetText }) => (
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Cuánto esperar:</Text>
        <View style={styles.presetsGrid}>
          {timePresets.map((preset, index) => {
            const isActive = activePresetIndex === index;
            const isDisabled =
              activePresetIndex !== null && activePresetIndex !== index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  isActive && styles.presetButtonActive,
                  isDisabled && styles.presetButtonDisabled,
                ]}
                onPress={() => setPresetTime(preset.seconds, index)}
                activeOpacity={isDisabled ? 1 : 0.8}
                disabled={isDisabled}
                accessibilityLabel={`Configurar temporizador a ${preset.label}`}
              >
                {renderPresetText(preset.label, isActive, isDisabled)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    )
  );
  TimePresets.displayName = 'TimePresets';

  // ============================================================================
  // RENDER PRINCIPAL DEL COMPONENTE
  // ============================================================================

  return (
    <View style={styles.container}>
      {/* 
        FONDO DE PROGRESO VISUAL MEJORADO
        - Se posiciona de forma absoluta para llenar el contenedor de abajo hacia arriba
        - La altura se calcula dinámicamente basada en el progreso del temporizador
        - Efectos de pulsación y brillo cuando está activo
        - Gradiente dinámico que cambia con el progreso
        - Z-index 0 para mantenerse detrás de todos los demás elementos
      */}
      <Animated.View
        style={[
          styles.progressBackground,
          {
            height: `${getProgress()}%`,
            transform: [{ scale: progressPulse }],
            opacity: progressGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0.9],
            }),
          },
        ]}
      >
        {/* Capa de brillo adicional para efecto más dinámico */}
        <Animated.View
          style={[
            styles.progressGlow,
            {
              opacity: progressGlow,
            },
          ]}
        />
      </Animated.View>

      {/* 
        HEADER CON MENSAJE DE AUTOAFIRMACIÓN DINÁMICO
        - Mensaje central que cambia automáticamente según el progreso del temporizador
        - Frases motivacionales progresivas para mantener el ánimo
        - Tipografía priorizada para máxima legibilidad y impacto visual
        - Marco decorativo con fondo distintivo para mayor prominencia
        - Z-index elevado para mantenerse visible sobre el fondo de progreso
      */}
      <View style={styles.header}>
        <View style={styles.motivationalFrame}>
          <Animated.Text
            style={[
              styles.headerTitle,
              {
                opacity: textOpacity,
                transform: [
                  { scale: phraseScale },
                  { translateY: phraseTranslateY },
                ],
              },
            ]}
          >
            {getCurrentMotivationalPhrase()}
          </Animated.Text>
        </View>
      </View>

      {/* 
        DISPLAY PRINCIPAL DEL TIEMPO
        - Muestra el tiempo en formato HH:MM:SS con fuente monospace para alineación
        - Incluye indicador de estado visual con círculo de color
        - Texto descriptivo del estado actual del temporizador
      */}
      <TimeDisplay time={time} isRunning={isRunning} />

      {/* 
        BOTONES DE CONTROL PRINCIPAL
        - Play/Pausa: Inicia o detiene el temporizador
        - Reset/Stop: Reinicia el temporizador al tiempo inicial
        - Iconografía universal para facilitar el reconocimiento
        - Colores diferenciados: verde para iniciar, rojo para detener
      */}
      <ControlButtons
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />

      {/* 
        PRESETS DE TIEMPO
        - Botones predefinidos para diferentes duraciones de actividades
        - Diseño adaptativo que resalta el preset actualmente seleccionado
        - Deshabilitación visual de opciones no disponibles durante ejecución
        - Organización en grid responsive para diferentes tamaños de pantalla
      */}
      <TimePresets
        timePresets={timePresets}
        activePresetIndex={activePresetIndex}
        setPresetTime={setPresetTime}
        renderPresetText={renderPresetText}
      />

      {/* 
        MODAL DE CELEBRACIÓN FANTÁSTICO
        - Aparece cuando se completa el temporizador
        - Incluye trofeos, medallas, confeti y animaciones
        - Vibración rítmica para feedback táctil
        - Colores vibrantes y efectos visuales espectaculares
      */}
      <Modal
        visible={showCelebration}
        transparent={true}
        animationType="none"
        onRequestClose={closeCelebration}
      >
        <Animated.View
          style={[styles.celebrationModal, { opacity: modalOpacity }]}
        >
          <ConfettiCannon
            count={200}
            origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
            fadeOut={true}
            autoStart={showCelebration}
            colors={[
              '#FFD700',
              '#FF6B6B',
              '#4ECDC4',
              '#45B7D1',
              '#96CEB4',
              '#FFEAA7',
            ]}
          />

          <View style={styles.celebrationContent}>
            {/* Trofeo Principal Animado */}
            <Animated.View
              style={[
                styles.trophyContainer,
                {
                  transform: [{ scale: trophyScale }],
                },
              ]}
            >
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.numberOne}>#1</Text>
            </Animated.View>

            {/* Mensaje de Felicitación */}
            <Text style={styles.celebrationTitle}>¡INCREÍBLE!</Text>
            <Text style={styles.celebrationSubtitle}>
              Has esperado con paciencia{'\n'}¡Eres un campeón! 🌟
            </Text>

            {/* Medallas Giratorias */}
            <Animated.View
              style={[
                styles.medallContainer,
                {
                  transform: [
                    {
                      rotate: medallRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.medal}>🥇</Text>
              <Text style={styles.medal}>🎖️</Text>
              <Text style={styles.medal}>🏅</Text>
            </Animated.View>

            {/* Efectos Adicionales */}
            <Animated.View
              style={[
                styles.sparkleContainer,
                {
                  transform: [{ scale: confettiScale }],
                },
              ]}
            >
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>🌟</Text>
              <Text style={styles.sparkle}>💫</Text>
              <Text style={styles.sparkle}>⭐</Text>
            </Animated.View>

            {/* Botón de Continuar */}
            <TouchableOpacity
              style={styles.celebrationButton}
              onPress={closeCelebration}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationButtonText}>¡Continuar! 🚀</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

/**
 * ============================================================================
 * ESTILOS DEL COMPONENTE DIGITALTIMER
 * ============================================================================
 *
 * Diseño centrado en accesibilidad y experiencia terapéutica:
 * - Colores de alto contraste para mejor visibilidad
 * - Espaciado generoso para facilitar la interacción táctil
 * - Jerarquía visual clara con diferentes tamaños de fuente
 * - Efectos de sombra para profundidad y definición
 * - Responsive design para diferentes tamaños de pantalla
 *
 * PALETAS DE COLORES DISPONIBLES PARA TEA:
 *
 * PALETA ACTUAL - ATARDECER CÁLIDO: �
 * - Fondo principal (#6A4C93): Morado suave y acogedor
 * - Progreso (rgba(255, 183, 77, 0.7)): Dorado cálido y energizante
 * - Marco (#E6E6FA): Lavanda suave para máximo contraste
 * - Botón Play (#81C784): Verde salvia calmante
 * - Botón Reset (#FFAB91): Melocotón suave y amigable
 *
 * OTRAS PALETAS DISPONIBLES:
 * - BOSQUE TRANQUILO 🌲: Verdes naturales y relajantes
 * - ATARDECER CÁLIDO 🌅: Morados y dorados acogedores
 *
 * ============================================================================
 * INSTRUCCIONES PARA CAMBIAR PALETAS:
 * ============================================================================
 *
 * PALETA 2 - BOSQUE TRANQUILO 🌲:
 * - container.backgroundColor: '#2D5A27'
 * - progressBackground.backgroundColor: 'rgba(139, 195, 74, 0.7)'
 * - progressGlow.backgroundColor: 'rgba(156, 204, 101, 0.4)'
 * - motivationalFrame.borderColor: '#98FB98'
 * - motivationalFrame.shadowColor: '#90EE90'
 * - playPauseButton.backgroundColor: '#4CAF50'
 * - resetButton.backgroundColor: '#FFB74D'
 * - presetButtonActive.backgroundColor: '#66BB6A'
 * - presetButtonActive.borderColor: '#4CAF50'
 * - statusIndicator (running): '#4CAF50'
 * - statusIndicator (stopped): '#FFB74D'
 *
 * PALETA 3 - ATARDECER CÁLIDO 🌅:
 * - container.backgroundColor: '#6A4C93'
 * - progressBackground.backgroundColor: 'rgba(255, 183, 77, 0.7)'
 * - progressGlow.backgroundColor: 'rgba(255, 206, 84, 0.4)'
 * - motivationalFrame.borderColor: '#E6E6FA'
 * - motivationalFrame.shadowColor: '#DDA0DD'
 * - playPauseButton.backgroundColor: '#81C784'
 * - resetButton.backgroundColor: '#FFAB91'
 * - presetButtonActive.backgroundColor: '#BA68C8'
 * - presetButtonActive.borderColor: '#9C27B0'
 * - statusIndicator (running): '#81C784'
 * - statusIndicator (stopped): '#FFAB91'
 */
const styles = StyleSheet.create({
  // ==========================================================================
  // CONTENEDOR PRINCIPAL
  // ==========================================================================

  /**
   * Estilo del contenedor principal del temporizador
   *
   * PALETA ATARDECER CÁLIDO �:
   * - Fondo morado suave y acogedor que transmite calma
   * - Colores inspirados en atardeceres para relajación
   * - Bordes redondeados para apariencia amigable
   * - Sombra suave para profundidad sin ser agresiva
   */
  container: {
    backgroundColor: '#1A237E', // Azul noche profundo
    borderRadius: 20, // Esquinas suaves y amigables
    padding: 20, // Espaciado interno generoso
    marginBottom: 20, // Separación de otros componentes
    shadowColor: '#000', // Sombra para profundidad
    shadowOffset: { width: 0, height: 2 }, // Sombra más suave
    shadowOpacity: 0.15, // Opacidad reducida para menos contraste
    shadowRadius: 6, // Radio más suave
    elevation: 4, // Elevación reducida en Android
    position: 'relative', // Para elementos absolutamente posicionados
    overflow: 'hidden', // Contiene el fondo de progreso
  },

  // ==========================================================================
  // FONDO DE PROGRESO VISUAL
  // ==========================================================================

  /**
   * Fondo de progreso que se llena de abajo hacia arriba
   *
   * PALETA ATARDECER CÁLIDO �:
   * - Se posiciona absolutamente en la parte inferior
   * - Altura dinámica basada en el progreso del temporizador
   * - Dorado suave para excelente contraste con el fondo morado
   * - Solo esquinas inferiores redondeadas para mejor ajuste
   * - Efectos de animación cuando está activo
   */
  progressBackground: {
    position: 'absolute', // Posicionamiento absoluto
    bottom: 0, // Anclado en la parte inferior
    left: 0, // Ocupa todo el ancho
    right: 0,
    backgroundColor: 'rgba(138, 43, 226, 0.8)', // Violeta aurora brillante
    borderBottomLeftRadius: 20, // Solo esquinas inferiores
    borderBottomRightRadius: 20,
    zIndex: 0, // Detrás de todo el contenido
    overflow: 'hidden', // Para contener el efecto de brillo
  },

  /**
   * Capa de brillo adicional para la barra de progreso
   *
   * EFECTOS VISUALES BOSQUE TRANQUILO:
   * - Gradiente verde brillante que se superpone al progreso
   * - Animación de pulsación para feedback visual
   * - Intensidad variable según el estado del temporizador
   */
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(147, 51, 234, 0.5)', // Violeta más intenso
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // ==========================================================================
  // HEADER Y TÍTULO PRINCIPAL
  // ==========================================================================

  /**
   * Contenedor del header con mensaje de autoafirmación dinámico
   *
   * DISEÑO:
   * - Layout centrado para máximo impacto del texto
   * - Espaciado generoso para respiración visual
   * - Flexible para adaptarse a textos de diferente longitud
   * - Z-index elevado para visibilidad sobre progreso
   */
  header: {
    alignItems: 'center', // Alineación centrada
    justifyContent: 'center', // Centrado horizontal
    marginBottom: 40, // Espaciado inferior aumentado
    paddingVertical: 25, // Espaciado vertical interno aumentado
    paddingHorizontal: 15, // Espaciado horizontal para el texto
    zIndex: 1, // Sobre el fondo de progreso
    minHeight: 80, // Altura mínima para consistencia
  },

  /**
   * Marco decorativo para los mensajes motivacionales
   *
   * PALETA ATARDECER CÁLIDO �:
   * - Fondo semi-transparente blanco para contraste suave
   * - Borde dorado para armonía con el tema cálido
   * - Esquinas redondeadas para apariencia amigable
   * - Múltiples capas de sombra para efecto de profundidad
   * - Espaciado interno generoso para respiración del texto
   */
  motivationalFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo blanco semi-transparente
    borderRadius: 25, // Esquinas muy redondeadas para suavidad
    borderWidth: 3, // Borde grueso para visibilidad
    borderColor: '#00E5FF', // Cyan eléctrico
    paddingVertical: 20, // Espaciado vertical generoso
    paddingHorizontal: 25, // Espaciado horizontal amplio
    marginHorizontal: 10, // Margen lateral para respiración
    shadowColor: '#00BCD4', // Sombra cyan
    shadowOffset: { width: 0, height: 4 }, // Sombra hacia abajo
    shadowOpacity: 0.3, // Opacidad aumentada para mejor definición
    shadowRadius: 12, // Radio de sombra más amplio
    elevation: 8, // Elevación aumentada en Android
    minWidth: '85%', // Ancho mínimo del marco
    maxWidth: '95%', // Ancho máximo para adaptabilidad
  },

  /**
   * Título principal del temporizador con frases motivacionales dinámicas
   *
   * TIPOGRAFÍA OPTIMIZADA PARA TEA:
   * - Fuente sans-serif legible y amigable
   * - Tamaño aumentado en 15% para mayor impacto visual
   * - Peso medium para suavidad visual
   * - Color oscuro para contraste con el fondo claro del marco
   * - Espaciado optimizado para comprensión
   */
  headerTitle: {
    fontSize: 32, // Aumentado de 28 a 32 (~15% más grande)
    fontWeight: '600', // Peso medium, más suave que bold
    color: '#2E3A47', // Color oscuro para contraste con fondo claro
    textAlign: 'center', // Centrado
    letterSpacing: 0.5, // Espaciado moderado para claridad
    lineHeight: 38, // Altura de línea ajustada proporcionalmente
    maxWidth: '100%', // Ocupa todo el ancho disponible
    minHeight: 40, // Altura mínima ajustada proporcionalmente
    fontFamily: 'System', // Fuente del sistema, más legible
  },

  // ==========================================================================
  // DISPLAY DEL TIEMPO
  // ==========================================================================

  /**
   * Contenedor del display principal de tiempo
   *
   * LAYOUT:
   * - Centrado para foco principal
   * - Z-index elevado para visibilidad
   * - Espaciado inferior para separación
   */
  displayContainer: {
    alignItems: 'center', // Centrado horizontal
    marginBottom: 25, // Espaciado inferior
    zIndex: 1, // Sobre el fondo de progreso
  },

  /**
   * Display digital del tiempo
   *
   * TIPOGRAFÍA ESPECIALIZADA:
   * - Fuente monospace para alineación perfecta
   * - Tamaño muy grande para máxima legibilidad
   * - Espaciado entre caracteres para claridad
   * - Sombra de texto para profundidad
   */
  timeDisplay: {
    fontSize: 52, // Tamaño muy prominente
    fontWeight: 'bold', // Peso fuerte
    color: '#ffffff', // Blanco puro
    fontFamily: 'monospace', // Fuente monoespaciada
    textAlign: 'center', // Centrado
    marginBottom: 18, // Espaciado inferior
    letterSpacing: 2, // Espaciado entre caracteres
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Sombra suave
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  // ==========================================================================
  // INDICADORES DE ESTADO
  // ==========================================================================

  /**
   * Contenedor del indicador de estado
   *
   * LAYOUT:
   * - Disposición horizontal para círculo + texto
   * - Alineación centrada verticalmente
   */
  statusContainer: {
    flexDirection: 'row', // Círculo y texto en línea
    alignItems: 'center', // Alineación vertical centrada
  },

  /**
   * Círculo indicador de estado
   *
   * VISUAL:
   * - Pequeño círculo que cambia de color según el estado
   * - Verde cuando está corriendo, rojo cuando está parado
   * - Forma circular perfecta con border-radius 50%
   */
  statusIndicator: {
    width: 12, // Tamaño compacto
    height: 12,
    borderRadius: 6, // Círculo perfecto (50% del width/height)
    marginRight: 8, // Espaciado del texto
  },

  /**
   * Texto descriptivo del estado
   *
   * TIPOGRAFÍA:
   * - Tamaño mediano para información secundaria
   * - Peso semibold para legibilidad
   * - Sombra sutil para definición
   */
  statusText: {
    fontSize: 16, // Tamaño mediano
    color: '#ffffff', // Blanco puro
    fontWeight: '600', // Peso semibold
    letterSpacing: 0.3, // Espaciado sutil entre letras
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra suave
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ==========================================================================
  // CONTROLES PRINCIPALES
  // ==========================================================================

  /**
   * Contenedor de botones de control
   *
   * LAYOUT:
   * - Disposición horizontal centrada
   * - Espaciado uniforme entre botones
   * - Z-index elevado para interacción garantizada
   */
  controlsContainer: {
    flexDirection: 'row', // Botones en línea horizontal
    justifyContent: 'center', // Centrado horizontal
    alignItems: 'center', // Alineación vertical centrada
    marginBottom: 25, // Espaciado inferior
    gap: 20, // Espaciado entre botones
    zIndex: 1, // Sobre el fondo de progreso
  },

  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  playPauseButton: {
    backgroundColor: '#00C853', // Verde esmeralda
  },

  resetButton: {
    backgroundColor: '#E91E63', // Rosa aurora
  },

  presetsContainer: {
    alignItems: 'center',
    zIndex: 2, // Más alto que otros elementos
  },

  presetsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: '100%',
  },

  presetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Menos transparente
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Borde más visible
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  presetButtonActive: {
    backgroundColor: '#7C4DFF', // Violeta intenso
    borderColor: '#673AB7', // Borde violeta más profundo
    transform: [{ scale: 1.1 }], // Aumenta el tamaño
    shadowOpacity: 0.4,
    elevation: 6,
    minWidth: 90,
  },

  presetButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Menos transparente
    borderColor: 'rgba(255, 255, 255, 0.3)', // Borde más visible
    opacity: 0.6, // Reducir la opacidad general en lugar de hacer el fondo más transparente
  },

  presetTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  presetButtonNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonNumberActive: {
    color: '#ffffff',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  presetButtonNumberDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
    textShadowColor: 'transparent',
  },

  presetButtonUnit: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 12,
    marginTop: -2,
    opacity: 0.9,
  },

  presetButtonUnitActive: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  presetButtonUnitDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.6,
  },

  // ==========================================================================
  // MODAL DE CELEBRACIÓN FANTÁSTICO
  // ==========================================================================

  /**
   * Modal de celebración que aparece al completar el temporizador
   *
   * DISEÑO ESPECTACULAR:
   * - Fondo semi-transparente con gradiente vibrante
   * - Ocupa toda la pantalla para máximo impacto
   * - Efectos visuales llamativos pero no agresivos
   */
  celebrationModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  /**
   * Contenedor principal del contenido de celebración
   *
   * ORGANIZACIÓN:
   * - Centrado vertical y horizontal
   * - Espaciado generoso entre elementos
   * - Fondo decorativo con gradiente
   */
  celebrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFD700',
  },

  /**
   * Contenedor del trofeo principal animado
   *
   * CARACTERÍSTICAS:
   * - Trofeo grande como elemento central
   * - Número 1 superpuesto
   * - Efectos de escala y bounce
   */
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  /**
   * Icono del trofeo principal
   */
  trophyIcon: {
    fontSize: 80,
    textAlign: 'center',
  },

  /**
   * Número 1 superpuesto en el trofeo
   */
  numberOne: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B6B',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  /**
   * Título principal de la celebración
   */
  celebrationTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },

  /**
   * Subtítulo con mensaje motivacional
   */
  celebrationSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A47',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  /**
   * Contenedor de medallas giratorias
   */
  medallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
  },

  /**
   * Estilo individual de cada medalla
   */
  medal: {
    fontSize: 40,
    marginHorizontal: 10,
  },

  /**
   * Contenedor de efectos de brillo y estrellas
   */
  sparkleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    width: 250,
  },

  /**
   * Estilo individual de cada efecto de brillo
   */
  sparkle: {
    fontSize: 30,
    marginHorizontal: 5,
  },

  /**
   * Botón para cerrar la celebración
   *
   * DISEÑO:
   * - Botón grande y atractivo
   * - Colores vibrantes pero amigables
   * - Fácil de tocar para usuarios con TEA
   */
  celebrationButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#45B7D1',
  },

  /**
   * Texto del botón de celebración
   */
  celebrationButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

// ============================================================================
// INICIALIZACIÓN DE SONIDOS
// ============================================================================

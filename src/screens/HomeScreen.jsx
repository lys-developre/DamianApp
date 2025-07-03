import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context';
import { useTheme } from '../theme';
import DigitalTimer from '../components/DigitalTimer';
import InteractiveSwitches from '../components/InteractiveSwitches';
import MainButtons from '../components/MainButtons';
import TimerImageButton from '../components/TimerImageButtons';
import { formatSeconds } from '../utils';

const { width } = Dimensions.get('window');

/**
 * Pantalla principal (Home) de la aplicación Damian APP
 *
 * ARQUITECTURA ACTUALIZADA: Movido de components/ a screens/ siguiendo estructura enterprise
 * MÓDULO 3: Integración con React Navigation para navegación profesional
 * MÓDULO 4: Migración a Context API para gestión de estado global
 *
 * Sistema de comunicación aumentativa y regulación emocional especializado:
 * - Comunicación asistida visual con pictogramas personalizados
 * - Sistema de regulación emocional basado en evidencia (ABA/TEACCH)
 * - Agenda visual inteligente para anticipación y rutinas
 * - Módulo de alimentación gamificado con refuerzos positivos
 * - Seguimiento y análisis de datos para familia y terapeutas
 * - Interfaz adaptada a necesidades específicas de autismo
 *
 * Funcionalidades especializadas:
 * - Pantalla principal: Hub de navegación visual
 * - Comunicación: Frases pre-programadas con pictogramas
 * - Regulación emocional: Semáforo emocional y estrategias de calma
 * - Agenda visual: Rutinas diarias con pictogramas editables
 * - Alimentación: Gamificación para introducción de alimentos
 * - Reportes: Análisis de progreso para familia y profesionales
 *
 * Optimizaciones de rendimiento aplicadas:
 * - ✅ formatSeconds centralizado en utils/formatters.js
 * - ✅ useCallback para handlers estables
 * - ✅ useMemo para arrays y estilos optimizados
 * - ✅ React Navigation para gestión de navegación profesional
 * - ✅ Context API para estado global centralizado
 * - ✅ AsyncStorage para persistencia automática
 *
 * @returns {JSX.Element} Hub principal con navegación especializada
 * @author Damian
 * @version 6.0.0 - Estado Global Módulo 4
 */
export default function HomeScreen() {
  const navigation = useNavigation();
  const { state, timerImageActions } = useAppContext();
  const { colors } = useTheme();

  // Crear estilos usando el theme dentro del componente
  const styles = useMemo(() => createHomeScreenStyles(colors), [colors]);

  // Extraer datos del estado global
  const { timerImageButtons } = state;

  // Referencia para evitar problemas de cierre sobre el estado
  const intervalRef = useRef();

  // Callback para navegar a configuración usando React Navigation
  const handleConfigShow = useCallback(() => {
    navigation.navigate('AdminConfig');
  }, [navigation]);

  // Función para manejar vacía de timer (memoizada)
  const handleTimerPress = useCallback(() => {}, []);

  // MainButtons memoizado para evitar recreaciones
  const mainButtons = useMemo(
    () => [
      {
        key: 'admin',
        icon: 'settings',
        title: 'Configuración',
        description: 'Modo familia',
        onPress: handleConfigShow,
        style: { backgroundColor: colors.PRIMARY }, // Usando theme
        accessibilityLabel: 'Modo familia/terapeuta',
        accessibilityHint: 'Configuración y personalización',
      },
      {
        key: 'admin-b',
        icon: 'settings',
        title: 'Configuración b',
        description: 'Modo familia b',
        onPress: handleTimerPress,
        style: { backgroundColor: colors.WARNING }, // Usando theme
        accessibilityLabel: 'Modo familia/terapeuta',
        accessibilityHint: 'Configuración y personalización',
      },
    ],
    [handleConfigShow, handleTimerPress, colors]
  );

  // Estilos memoizados para evitar recreaciones
  const timerImageButtonsContainerStyle = useMemo(
    () => ({ width: '100%', marginBottom: 18 }),
    []
  );

  const timerImageButtonWrapperStyle = useMemo(
    () => ({ width: '100%', alignItems: 'center', marginBottom: 12 }),
    []
  );

  const timerImageButtonStyle = useMemo(
    () => ({ width: width * 0.82, height: width * 0.82 }),
    []
  );

  // Array de temporizadores memoizado para evitar recreaciones
  const timerImageButtonElements = useMemo(
    () =>
      timerImageButtons.map(btn => (
        <View key={btn.id} style={timerImageButtonWrapperStyle}>
          <TimerImageButton
            image={btn.image}
            timer={btn.timer}
            isActive={btn.isActive}
            onPress={handleTimerPress}
            style={timerImageButtonStyle}
          />
        </View>
      )),
    [
      timerImageButtons,
      timerImageButtonWrapperStyle,
      timerImageButtonStyle,
      handleTimerPress,
    ]
  );

  // Efecto: cuenta regresiva para todos los temporizadores activos
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      // Actualizar temporizadores activos usando actions del context
      timerImageActions.setTimers(
        timerImageButtons.map(btn => {
          if (btn.isActive && btn.seconds > 0) {
            const newSeconds = btn.seconds - 1;
            if (newSeconds === 0) {
              // Finaliza: cambia a verde
              return {
                ...btn,
                seconds: 0,
                timer: formatSeconds(0),
                isActive: false,
              };
            }
            return {
              ...btn,
              seconds: newSeconds,
              timer: formatSeconds(newSeconds),
            };
          }
          return btn;
        })
      );
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timerImageButtons, timerImageActions]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header con título principal */}
      <View style={styles.headerContainer}>
        <Text style={styles.appTitle}>Damian APP</Text>
        <Text style={styles.appSubtitle}>Comunicación y Regulación</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>v4.0</Text>
        </View>
      </View>

      {/* Temporizador Digital */}
      <DigitalTimer />

      {/* Switches Interactivos */}
      <InteractiveSwitches />

      {/* Temporizadores con imagen */}
      <View style={timerImageButtonsContainerStyle}>
        {timerImageButtonElements}
      </View>

      {/* Grid de módulos principales (solo Admin) */}
      <MainButtons buttons={mainButtons} styles={styles} />

      {/* Indicador visual en la parte inferior */}
      <View style={styles.bottomIndicator}>
        <Text style={styles.indicatorText}>
          Aplicación especializada en comunicación aumentativa y regulación
          emocional
        </Text>
      </View>

      {/* Configuración de la barra de estado */}
      <StatusBar style="light" />
    </ScrollView>
  );
}

/**
 * Función para crear estilos usando el theme system
 * Mantiene el aspecto visual actual pero centraliza los colores
 */
const createHomeScreenStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY, // Era: '#1E293B'
    },
    contentContainer: {
      flexGrow: 1,
      paddingVertical: 20,
      paddingHorizontal: 15,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 30,
      paddingTop: 20,
    },
    appTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      textAlign: 'center',
      marginBottom: 5,
    },
    appSubtitle: {
      fontSize: 16,
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      textAlign: 'center',
      opacity: 0.9,
      marginBottom: 15,
    },
    badge: {
      backgroundColor: colors.SECONDARY, // Era: '#48bb78'
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    badgeText: {
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      fontSize: 12,
      fontWeight: '600',
    },
    modulesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    moduleCard: {
      width: width * 0.42,
      height: 140,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      marginHorizontal: 'auto',
    },
    adminCard: {
      backgroundColor: colors.PRIMARY, // Era: '#45B7D1'
    },
    moduleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    moduleDescription: {
      fontSize: 12,
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      textAlign: 'center',
      opacity: 0.9,
    },
    bottomIndicator: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginTop: 20,
    },
    indicatorText: {
      color: colors.TEXT_PRIMARY, // Era: '#ffffff'
      fontSize: 12,
      textAlign: 'center',
      opacity: 0.8,
      fontWeight: '500',
      lineHeight: 16,
    },
  });

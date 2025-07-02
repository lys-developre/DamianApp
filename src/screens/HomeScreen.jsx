import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
 * - ✅ Eliminación de renderizado condicional por navegación nativa
 *
 * @returns {JSX.Element} Hub principal con navegación especializada
 * @author Damian
 * @version 5.0.0 - Navegación Módulo 3
 */
export default function HomeScreen() {
  const navigation = useNavigation();

  // Estado de temporizadores con imagen: tiempo en segundos y formateado
  const [timerImageButtons, setTimerImageButtons] = useState([
    {
      id: '1',
      image: 'https://placekitten.com/300/300',
      timer: '02:30:00',
      seconds: 2 * 3600 + 30 * 60, // 2h 30m
      isActive: true,
    },
    {
      id: '2',
      image: 'https://placekitten.com/301/301',
      timer: '00:00:00',
      seconds: 0,
      isActive: false,
    },
  ]);

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
        style: { backgroundColor: '#45B7D1' }, // Azul
        accessibilityLabel: 'Modo familia/terapeuta',
        accessibilityHint: 'Configuración y personalización',
      },
      {
        key: 'admin-b',
        icon: 'settings',
        title: 'Configuración b',
        description: 'Modo familia b',
        onPress: handleTimerPress,
        style: { backgroundColor: '#F59E42' }, // Naranja
        accessibilityLabel: 'Modo familia/terapeuta',
        accessibilityHint: 'Configuración y personalización',
      },
    ],
    [handleConfigShow, handleTimerPress]
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
      setTimerImageButtons(prev =>
        prev.map(btn => {
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
  }, []);

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
 * Estilos del componente HomeScreen
 *
 * Define la apariencia visual del hub principal especializado:
 * - Layout responsivo con grid de módulos
 * - Colores suaves y contrastantes para accesibilidad
 * - Tipografía clara y espaciado generoso
 * - Sombras y efectos visuales optimizados
 * - Diseño adaptado a necesidades de autismo
 */
const styles = StyleSheet.create({
  /**
   * Contenedor principal scrollable - FONDO MEJORADO
   * Color que contrasta perfectamente con el efecto glass del DigitalTimer
   */
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Azul gris oscuro elegante para contraste optimal
  },

  /**
   * Contenedor del contenido scrollable
   */
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  /**
   * Header con título y badge
   */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },

  /**
   * Título principal de la aplicación
   */
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },

  /**
   * Subtítulo descriptivo
   */
  appSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 15,
  },

  /**
   * Badge de versión
   */
  badge: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  /**
   * Texto del badge
   */
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  /**
   * Grid de módulos principales
   */
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  /**
   * Card base para módulos
   */
  moduleCard: {
    width: width * 0.42, // Aproximadamente 42% del ancho de la pantalla
    height: 140,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 'auto',
  },

  /**
   * Card de admin/familia
   */
  adminCard: {
    backgroundColor: '#45B7D1',
  },

  /**
   * Título del módulo
   */
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  /**
   * Descripción del módulo
   */
  moduleDescription: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },

  /**
   * Indicador inferior
   */
  bottomIndicator: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },

  /**
   * Texto del indicador
   */
  indicatorText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
    lineHeight: 16,
  },
});

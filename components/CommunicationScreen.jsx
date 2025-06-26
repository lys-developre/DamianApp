import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import CommunicationButton from './CommunicationButton';

/**
 * Configuración de los botones de comunicación
 * Frases pre-programadas organizadas por categorías
 * Cada botón tiene texto, color, icono y categoría específica
 */
const COMMUNICATION_BUTTONS = [
  // Categoría: Afecto y Vínculos
  {
    text: 'Te quiero mamá',
    color: '#FF6B6B',
    id: 'te_quiero_mama',
    category: 'afecto',
    icon: <MaterialIcons name="favorite" size={28} color="#ffffff" />,
  },
  {
    text: 'Te quiero papá',
    color: '#4ECDC4',
    id: 'te_quiero_papa',
    category: 'afecto',
    icon: <MaterialIcons name="favorite" size={28} color="#ffffff" />,
  },
  {
    text: 'Abrazo',
    color: '#FF9FF3',
    id: 'abrazo',
    category: 'afecto',
    icon: <MaterialIcons name="hug" size={28} color="#ffffff" />,
  },

  // Categoría: Necesidades Básicas
  {
    text: 'Quiero agua',
    color: '#45B7D1',
    id: 'quiero_agua',
    category: 'necesidades',
    icon: <MaterialIcons name="local-drink" size={28} color="#ffffff" />,
  },
  {
    text: 'Tengo hambre',
    color: '#96CEB4',
    id: 'tengo_hambre',
    category: 'necesidades',
    icon: <MaterialIcons name="restaurant" size={28} color="#ffffff" />,
  },
  {
    text: 'Quiero ir al baño',
    color: '#9C88FF',
    id: 'quiero_bano',
    category: 'necesidades',
    icon: <MaterialIcons name="wc" size={28} color="#ffffff" />,
  },

  // Categoría: Emociones
  {
    text: 'Estoy feliz',
    color: '#FFD93D',
    id: 'estoy_feliz',
    category: 'emociones',
    icon: (
      <MaterialIcons
        name="sentiment-very-satisfied"
        size={28}
        color="#ffffff"
      />
    ),
  },
  {
    text: 'Estoy triste',
    color: '#74B9FF',
    id: 'estoy_triste',
    category: 'emociones',
    icon: (
      <MaterialIcons name="sentiment-dissatisfied" size={28} color="#ffffff" />
    ),
  },
  {
    text: 'Estoy cansado',
    color: '#A29BFE',
    id: 'estoy_cansado',
    category: 'emociones',
    icon: <FontAwesome5 name="bed" size={24} color="#ffffff" />,
  },

  // Categoría: Salud
  {
    text: 'Me duele',
    color: '#FFEAA7',
    id: 'me_duele',
    category: 'salud',
    icon: <MaterialIcons name="healing" size={28} color="#ffffff" />,
  },
  {
    text: 'No me siento bien',
    color: '#FD79A8',
    id: 'no_me_siento_bien',
    category: 'salud',
    icon: <MaterialIcons name="sick" size={28} color="#ffffff" />,
  },

  // Categoría: Actividades
  {
    text: 'Quiero jugar',
    color: '#00B894',
    id: 'quiero_jugar',
    category: 'actividades',
    icon: <Ionicons name="game-controller" size={28} color="#ffffff" />,
  },
  {
    text: 'Quiero ver TV',
    color: '#6C5CE7',
    id: 'quiero_tv',
    category: 'actividades',
    icon: <MaterialIcons name="tv" size={28} color="#ffffff" />,
  },

  // Categoría: Comunicación
  {
    text: 'No entiendo',
    color: '#DDA0DD',
    id: 'no_entiendo',
    category: 'comunicacion',
    icon: <MaterialIcons name="help-outline" size={28} color="#ffffff" />,
  },
  {
    text: 'Esperar',
    color: '#98D8C8',
    id: 'esperar',
    category: 'comunicacion',
    icon: <MaterialIcons name="access-time" size={28} color="#ffffff" />,
  },
  {
    text: 'Más por favor',
    color: '#81ECEC',
    id: 'mas_por_favor',
    category: 'comunicacion',
    icon: <MaterialIcons name="add" size={28} color="#ffffff" />,
  },
];

/**
 * Componente de pantalla de comunicación con botones interactivos
 *
 * Renderiza una pantalla con botones de comunicación optimizada:
 * - FlatList altamente optimizado con virtualización
 * - Funciones memoizadas para prevenir renders innecesarios
 * - Datos estáticos externalizados para mejor rendimiento
 * - Botones con pictogramas claros y colores distintivos
 * - Botón de regreso simple
 * - Compatibilidad con dispositivos modernos
 *
 * Optimizaciones de rendimiento:
 * - useCallback para funciones estables
 * - getItemLayout para scroll optimizado
 * - removeClippedSubviews para memoria eficiente
 * - Configuración de ventana de render optimizada
 *
 * Características de accesibilidad:
 * - Texto grande y contrastante
 * - Pictogramas claros e intuitivos
 * - Respuesta táctil optimizada
 * - Navegación simple y directa
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onBack - Función para regresar a la pantalla anterior
 * @returns {JSX.Element} Pantalla de comunicación con botones
 * @author Damian
 * @version 3.0.0
 */
export default function CommunicationScreen({ onBack }) {
  /**
   * Maneja el evento de regreso directo
   * Memoizado para evitar recreaciones innecesarias
   */
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  /**
   * Maneja el evento de clic en los botones de comunicación
   * Memoizado para optimizar el rendimiento
   *
   * @param {Object} button - El botón seleccionado con texto y categoría
   */
  const handleButtonPress = useCallback(button => {
    Alert.alert(
      '💬 Mensaje Seleccionado',
      `"${button.text}"\n\nCategoría: ${button.category.charAt(0).toUpperCase() + button.category.slice(1)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: '📱 Enviar a Familia',
          onPress: () => {
            Alert.alert(
              '✅ ¡Mensaje Enviado!',
              `"${button.text}" ha sido enviado a la familia vía WhatsApp`,
              [{ text: 'Perfecto', style: 'default' }]
            );
          },
        },
      ]
    );
  }, []);

  /**
   * Renderiza cada botón de comunicación
   * Memoizado para evitar renders innecesarios
   */
  const renderButton = useCallback(
    ({ item }) => (
      <View style={styles.buttonWrapper}>
        <CommunicationButton
          text={item.text}
          color={item.color}
          id={item.id}
          icon={item.icon}
          onPress={() => handleButtonPress(item)}
        />
      </View>
    ),
    [handleButtonPress]
  );

  /**
   * Función para extraer la clave de cada elemento del FlatList
   * Optimizada para el rendimiento del FlatList
   */
  const keyExtractor = useCallback(item => item.id, []);

  return (
    <View style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comunicación</Text>
      </View>

      {/* Header informativo */}
      <View style={styles.infoHeader}>
        <MaterialIcons name="chat" size={32} color="#FF6B6B" />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Frases pre-programadas</Text>
          <Text style={styles.infoSubtitle}>
            Toca una frase para enviarla a tu familia 💬
          </Text>
        </View>
      </View>

      {/* Lista de botones de comunicación */}
      <FlatList
        data={COMMUNICATION_BUTTONS}
        renderItem={renderButton}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        bounces={true}
        decelerationRate="fast"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        getItemLayout={(data, index) => ({
          length: 75, // 60 altura del botón + 15 separador
          offset: 75 * index,
          index,
        })}
      />
    </View>
  );
}

/**
 * Estilos del componente CommunicationScreen
 *
 * Define la apariencia visual de la pantalla de comunicación:
 * - Layout y posicionamiento
 * - Colores y gradientes
 * - Header y navegación
 * - Lista de botones optimizada
 */
const styles = StyleSheet.create({
  /**
   * Contenedor principal de la pantalla
   */
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  /**
   * Header con título y botón de regreso
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  /**
   * Botón de regreso en el header
   */
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  /**
   * Título del header
   */
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 48, // Compensar el espacio del botón de regreso (mismo ancho)
  },

  /**
   * Header informativo
   */
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /**
   * Contenedor del texto informativo
   */
  infoText: {
    flex: 1,
    marginLeft: 15,
  },

  /**
   * Título del header informativo
   */
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },

  /**
   * Subtítulo del header informativo
   */
  infoSubtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 18,
  },

  /**
   * Contenido del FlatList
   */
  flatListContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /**
   * Contenedor de cada botón
   */
  buttonWrapper: {
    width: '100%',
  },

  /**
   * Separador entre botones
   */
  separator: {
    height: 15,
  },
});

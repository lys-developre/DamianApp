import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import CommunicationButton from './CommunicationButton';

/**
 * Configuración de los botones de comunicación
 * Memoizado fuera del componente para optimizar el rendimiento
 * Cada botón tiene texto, color, icono y función específica
 */
const COMMUNICATION_BUTTONS = [
  {
    text: 'MAMÁ',
    color: '#FF6B6B',
    id: 'mama',
    icon: <MaterialIcons name="face" size={28} color="#ffffff" />,
  },
  {
    text: 'PAPÁ',
    color: '#4ECDC4',
    id: 'papa',
    icon: <MaterialIcons name="face" size={28} color="#ffffff" />,
  },
  {
    text: 'DAMIÁN',
    color: '#45B7D1',
    id: 'damian',
    icon: <MaterialIcons name="child-care" size={28} color="#ffffff" />,
  },
  {
    text: 'QUIERO',
    color: '#96CEB4',
    id: 'quiero',
    icon: <MaterialIcons name="favorite" size={28} color="#ffffff" />,
  },
  {
    text: 'ME DUELE',
    color: '#FFEAA7',
    id: 'duele',
    icon: <MaterialIcons name="healing" size={28} color="#ffffff" />,
  },
  {
    text: 'NO ENTIENDO',
    color: '#DDA0DD',
    id: 'noentiendo',
    icon: <MaterialIcons name="help-outline" size={28} color="#ffffff" />,
  },
  {
    text: 'ESPERAR',
    color: '#98D8C8',
    id: 'esperar',
    icon: <MaterialIcons name="access-time" size={28} color="#ffffff" />,
  },
  {
    text: 'JUEGOS',
    color: '#FF9FF3',
    id: 'juegos',
    icon: <Ionicons name="game-controller" size={28} color="#ffffff" />,
  },
  {
    text: 'CHARLAR',
    color: '#54A0FF',
    id: 'charlar',
    icon: <MaterialIcons name="chat" size={28} color="#ffffff" />,
  },
  {
    text: 'COMIDA',
    color: '#5F27CD',
    id: 'comida',
    icon: <MaterialIcons name="restaurant" size={28} color="#ffffff" />,
  },
  {
    text: 'ABURRIDO',
    color: '#FF6348',
    id: 'aburrido',
    icon: (
      <MaterialCommunityIcons name="emoticon-sad" size={28} color="#ffffff" />
    ),
  },
  {
    text: 'CANSADO',
    color: '#9C88FF',
    id: 'cansado',
    icon: <FontAwesome5 name="bed" size={24} color="#ffffff" />,
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
   * @param {string} message - El mensaje que se ha seleccionado
   */
  const handleButtonPress = useCallback(message => {
    Alert.alert('Mensaje Seleccionado', `"${message}"`, [
      { text: 'OK', style: 'default' },
    ]);
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
          onPress={handleButtonPress}
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

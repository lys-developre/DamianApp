import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Pantalla de Reportes y Análisis de Progreso
 *
 * Sistema de seguimiento especializado para familia y terapeutas:
 * - Análisis de patrones de comportamiento y comunicación
 * - Reportes visuales de progreso alimentario y emocional
 * - Exportación de datos para sesiones terapéuticas
 * - Identificación de desencadenantes y estrategias efectivas
 * - Dashboard personalizado con métricas clave
 * - Recomendaciones basadas en datos recopilados
 *
 * Funcionalidades para profesionales:
 * - Gráficos de evolución temporal
 * - Correlaciones entre eventos y comportamientos
 * - Alertas automáticas de patrones preocupantes
 * - Comparación de periodos de tiempo
 *
 * @param {Function} onBack - Función para regresar al hub principal
 * @returns {JSX.Element} Pantalla de reportes y análisis
 * @author Damian
 * @version 4.0.0
 */

// Datos de ejemplo para demostración
const SAMPLE_DATA = {
  weeklyProgress: {
    communication: 85,
    emotional: 72,
    food: 68,
    schedule: 90,
  },
  recentEvents: [
    {
      id: 1,
      type: 'communication',
      description: 'Usó "Te quiero mamá" espontáneamente',
      timestamp: '2025-06-26 14:30',
      positive: true,
    },
    {
      id: 2,
      type: 'emotional',
      description: 'Toleró espera de 5 minutos sin crisis',
      timestamp: '2025-06-26 10:15',
      positive: true,
    },
    {
      id: 3,
      type: 'food',
      description: 'Probó banana (pequeño bocado)',
      timestamp: '2025-06-25 16:00',
      positive: true,
    },
    {
      id: 4,
      type: 'emotional',
      description: 'Crisis evitada con semáforo emocional',
      timestamp: '2025-06-25 12:45',
      positive: true,
    },
  ],
  weeklyStats: {
    totalInteractions: 127,
    newWords: 3,
    crisisAvoided: 8,
    foodsTried: 2,
    avgSessionTime: 12, // minutos
  },
};

const REPORT_SECTIONS = [
  {
    id: 'weekly',
    title: 'Resumen Semanal',
    icon: 'bar-chart',
    color: '#4ECDC4',
  },
  {
    id: 'communication',
    title: 'Comunicación',
    icon: 'chat',
    color: '#FF6B6B',
  },
  {
    id: 'emotional',
    title: 'Regulación Emocional',
    icon: 'sentiment-satisfied-alt',
    color: '#4ECDC4',
  },
  {
    id: 'food',
    title: 'Alimentación',
    icon: 'restaurant',
    color: '#96CEB4',
  },
  {
    id: 'export',
    title: 'Exportar Datos',
    icon: 'download',
    color: '#9C88FF',
  },
];

export default function ReportsScreen({ onBack }) {
  const [selectedSection, setSelectedSection] = useState('weekly');

  /**
   * Maneja la selección de sección de reportes
   */
  const handleSectionSelect = useCallback(sectionId => {
    setSelectedSection(sectionId);
  }, []);

  /**
   * Renderiza el contenido de la sección seleccionada
   */
  const renderSectionContent = useCallback(() => {
    switch (selectedSection) {
      case 'weekly':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Progreso de esta semana</Text>

            {/* Métricas principales */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <MaterialIcons name="chat" size={32} color="#FF6B6B" />
                <Text style={styles.metricValue}>
                  {SAMPLE_DATA.weeklyProgress.communication}%
                </Text>
                <Text style={styles.metricLabel}>Comunicación</Text>
              </View>

              <View style={styles.metricCard}>
                <MaterialIcons
                  name="sentiment-satisfied-alt"
                  size={32}
                  color="#4ECDC4"
                />
                <Text style={styles.metricValue}>
                  {SAMPLE_DATA.weeklyProgress.emotional}%
                </Text>
                <Text style={styles.metricLabel}>Regulación</Text>
              </View>

              <View style={styles.metricCard}>
                <MaterialIcons name="restaurant" size={32} color="#96CEB4" />
                <Text style={styles.metricValue}>
                  {SAMPLE_DATA.weeklyProgress.food}%
                </Text>
                <Text style={styles.metricLabel}>Alimentación</Text>
              </View>

              <View style={styles.metricCard}>
                <MaterialIcons name="schedule" size={32} color="#45B7D1" />
                <Text style={styles.metricValue}>
                  {SAMPLE_DATA.weeklyProgress.schedule}%
                </Text>
                <Text style={styles.metricLabel}>Rutinas</Text>
              </View>
            </View>

            {/* Estadísticas rápidas */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Estadísticas destacadas</Text>
              <View style={styles.statRow}>
                <MaterialIcons name="touch-app" size={20} color="#667eea" />
                <Text style={styles.statText}>
                  {SAMPLE_DATA.weeklyStats.totalInteractions} interacciones
                  totales
                </Text>
              </View>
              <View style={styles.statRow}>
                <MaterialIcons name="new-releases" size={20} color="#667eea" />
                <Text style={styles.statText}>
                  {SAMPLE_DATA.weeklyStats.newWords} nuevas palabras aprendidas
                </Text>
              </View>
              <View style={styles.statRow}>
                <MaterialIcons name="shield" size={20} color="#667eea" />
                <Text style={styles.statText}>
                  {SAMPLE_DATA.weeklyStats.crisisAvoided} crisis evitadas
                </Text>
              </View>
              <View style={styles.statRow}>
                <MaterialIcons name="restaurant" size={20} color="#667eea" />
                <Text style={styles.statText}>
                  {SAMPLE_DATA.weeklyStats.foodsTried} alimentos nuevos probados
                </Text>
              </View>
            </View>
          </View>
        );

      case 'communication':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Análisis de Comunicación</Text>
            <View style={styles.analysisCard}>
              <MaterialIcons name="trending-up" size={24} color="#48bb78" />
              <Text style={styles.analysisText}>
                Incremento del 25% en comunicación espontánea esta semana
              </Text>
            </View>
            <View style={styles.analysisCard}>
              <MaterialIcons name="stars" size={24} color="#FFD700" />
              <Text style={styles.analysisText}>
                Frases más utilizadas: &quot;Te quiero mamá&quot;, &quot;Quiero
                agua&quot;, &quot;Estoy feliz&quot;
              </Text>
            </View>
          </View>
        );

      case 'emotional':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Regulación Emocional</Text>
            <View style={styles.analysisCard}>
              <MaterialIcons name="emoji-emotions" size={24} color="#4ECDC4" />
              <Text style={styles.analysisText}>
                Tiempo promedio de autorregulación: 3 minutos (mejora del 40%)
              </Text>
            </View>
            <View style={styles.analysisCard}>
              <MaterialIcons name="psychology" size={24} color="#4ECDC4" />
              <Text style={styles.analysisText}>
                Estrategia más efectiva: Semáforo emocional (85% de éxito)
              </Text>
            </View>
          </View>
        );

      case 'food':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Progreso Alimentario</Text>
            <View style={styles.analysisCard}>
              <MaterialIcons name="restaurant" size={24} color="#96CEB4" />
              <Text style={styles.analysisText}>
                2 nuevos alimentos introducidos exitosamente
              </Text>
            </View>
            <View style={styles.analysisCard}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.analysisText}>
                Textura preferida: cremosa (80% de aceptación)
              </Text>
            </View>
          </View>
        );

      case 'export':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Exportar Datos</Text>
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
              <MaterialIcons name="picture-as-pdf" size={24} color="#ffffff" />
              <Text style={styles.exportButtonText}>Generar Reporte PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
              <MaterialIcons name="table-chart" size={24} color="#ffffff" />
              <Text style={styles.exportButtonText}>Exportar Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
              <MaterialIcons name="share" size={24} color="#ffffff" />
              <Text style={styles.exportButtonText}>
                Compartir con Terapeuta
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  }, [selectedSection]);

  /**
   * Renderiza un evento reciente
   */
  const renderEvent = useCallback(
    ({ item }) => (
      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <MaterialIcons
            name={
              item.type === 'communication'
                ? 'chat'
                : item.type === 'emotional'
                  ? 'sentiment-satisfied-alt'
                  : item.type === 'food'
                    ? 'restaurant'
                    : 'schedule'
            }
            size={20}
            color={item.positive ? '#48bb78' : '#e53e3e'}
          />
          <Text style={styles.eventTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.eventDescription}>{item.description}</Text>
        {item.positive && (
          <View style={styles.positiveIndicator}>
            <MaterialIcons name="check-circle" size={16} color="#48bb78" />
            <Text style={styles.positiveText}>Logro positivo</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel="Regresar al menú principal"
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Reportes y Análisis</Text>
      </View>

      <View style={styles.content}>
        {/* Navegación de secciones */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sectionNav}
          contentContainerStyle={styles.sectionNavContent}
        >
          {REPORT_SECTIONS.map(section => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionButton,
                { backgroundColor: section.color },
                selectedSection === section.id && styles.selectedSectionButton,
              ]}
              onPress={() => handleSectionSelect(section.id)}
              activeOpacity={0.8}
            >
              <MaterialIcons name={section.icon} size={20} color="#ffffff" />
              <Text style={styles.sectionButtonText}>{section.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contenido de la sección */}
        <ScrollView
          style={styles.sectionContent}
          showsVerticalScrollIndicator={false}
        >
          {renderSectionContent()}

          {/* Eventos recientes */}
          {selectedSection === 'weekly' && (
            <View style={styles.eventsContainer}>
              <Text style={styles.eventsTitle}>Eventos Recientes</Text>
              <FlatList
                data={SAMPLE_DATA.recentEvents}
                renderItem={renderEvent}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * Estilos del módulo de reportes
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9C88FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#9C88FF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  sectionNav: {
    paddingVertical: 20,
  },
  sectionNavContent: {
    paddingHorizontal: 20,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedSectionButton: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  metricCard: {
    width: width * 0.42,
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 10,
    flex: 1,
  },
  analysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 14,
    color: '#2d3748',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C88FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventsContainer: {
    marginTop: 25,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  eventCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#48bb78',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    color: '#718096',
  },
  eventDescription: {
    fontSize: 14,
    color: '#2d3748',
    marginBottom: 8,
  },
  positiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positiveText: {
    fontSize: 12,
    color: '#48bb78',
    marginLeft: 4,
    fontWeight: '600',
  },
});

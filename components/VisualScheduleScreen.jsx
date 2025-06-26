import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Pantalla de Agenda Visual - Damian APP
 *
 * Módulo especializado para rutinas diarias con pictogramas:
 * - Visualización clara de actividades del día
 * - Pictogramas para cada actividad
 * - Indicadores de progreso visual
 * - Anticipación de cambios y transiciones
 * - Personalización de rutinas familiares
 *
 * Características terapéuticas:
 * - Reduce ansiedad por anticipación
 * - Mejora la comprensión temporal
 * - Facilita transiciones entre actividades
 * - Promueve independencia y autonomía
 * - Apoyo visual para comunicación
 *
 * @param {Function} onBack - Función para regresar a la pantalla principal
 * @returns {JSX.Element} Interfaz de agenda visual adaptada
 * @author Damian
 * @version 4.0.0
 */
export default function VisualScheduleScreen({ onBack }) {
  // Estado de las actividades del día
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: 'Desayuno',
      icon: 'restaurant',
      completed: true,
      time: '8:00',
    },
    {
      id: 2,
      name: 'Cepillarse los dientes',
      icon: 'brush',
      completed: true,
      time: '8:30',
    },
    {
      id: 3,
      name: 'Terapia',
      icon: 'psychology',
      completed: false,
      time: '9:00',
    },
    { id: 4, name: 'Recreo', icon: 'toys', completed: false, time: '10:30' },
    {
      id: 5,
      name: 'Almuerzo',
      icon: 'lunch-dining',
      completed: false,
      time: '12:00',
    },
    { id: 6, name: 'Siesta', icon: 'bed', completed: false, time: '14:00' },
    {
      id: 7,
      name: 'Juego libre',
      icon: 'games',
      completed: false,
      time: '15:30',
    },
    {
      id: 8,
      name: 'Cena',
      icon: 'dinner-dining',
      completed: false,
      time: '18:00',
    },
  ]);

  /**
   * Marca una actividad como completada o pendiente
   */
  const toggleActivity = useCallback(activityId => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  }, []);

  /**
   * Renderiza una tarjeta de actividad individual
   */
  const renderActivityCard = useCallback(
    activity => (
      <TouchableOpacity
        key={activity.id}
        style={[
          styles.activityCard,
          activity.completed && styles.activityCardCompleted,
        ]}
        onPress={() => toggleActivity(activity.id)}
        activeOpacity={0.8}
        accessibilityLabel={`Actividad: ${activity.name} a las ${activity.time}`}
        accessibilityHint={
          activity.completed
            ? 'Completada - Toca para marcar como pendiente'
            : 'Pendiente - Toca para marcar como completada'
        }
      >
        <View style={styles.activityIcon}>
          <MaterialIcons
            name={activity.icon}
            size={32}
            color={activity.completed ? '#48bb78' : '#667eea'}
          />
        </View>

        <View style={styles.activityInfo}>
          <Text
            style={[
              styles.activityName,
              activity.completed && styles.activityNameCompleted,
            ]}
          >
            {activity.name}
          </Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>

        <View style={styles.activityStatus}>
          <MaterialIcons
            name={
              activity.completed ? 'check-circle' : 'radio-button-unchecked'
            }
            size={24}
            color={activity.completed ? '#48bb78' : '#ccc'}
          />
        </View>
      </TouchableOpacity>
    ),
    [toggleActivity]
  );

  return (
    <View style={styles.container}>
      {/* Header con navegación */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Regresar al menú principal"
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Agenda Visual</Text>
          <Text style={styles.headerSubtitle}>Mi día de hoy</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          accessibilityLabel="Editar rutina"
        >
          <MaterialIcons name="edit" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Resumen del progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <MaterialIcons name="today" size={32} color="#48bb78" />
          <View style={styles.progressText}>
            <Text style={styles.progressTitle}>Progreso del día</Text>
            <Text style={styles.progressSubtitle}>
              {activities.filter(a => a.completed).length} de{' '}
              {activities.length} actividades
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(activities.filter(a => a.completed).length / activities.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Lista de actividades */}
      <ScrollView
        style={styles.activitiesContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Actividades de hoy</Text>

        {activities.map(renderActivityCard)}

        {/* Botón para agregar nueva actividad */}
        <TouchableOpacity
          style={styles.addActivityButton}
          accessibilityLabel="Agregar nueva actividad"
        >
          <MaterialIcons name="add" size={24} color="#667eea" />
          <Text style={styles.addActivityText}>Agregar actividad</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Mensaje motivacional */}
      <View style={styles.motivationalContainer}>
        <Text style={styles.motivationalText}>
          ¡Excelente trabajo! Sigue tu rutina paso a paso 🌟
        </Text>
      </View>
    </View>
  );
}

/**
 * Estilos del componente VisualScheduleScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },

  header: {
    backgroundColor: '#667eea',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  progressText: {
    marginLeft: 15,
    flex: 1,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  progressSubtitle: {
    fontSize: 14,
    color: '#666',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#e1e5e9',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },

  activitiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },

  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  activityCardCompleted: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },

  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  activityInfo: {
    flex: 1,
  },

  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  activityNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  activityTime: {
    fontSize: 14,
    color: '#666',
  },

  activityStatus: {
    marginLeft: 10,
  },

  addActivityButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderStyle: 'dashed',
  },

  addActivityText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
    marginLeft: 8,
  },

  motivationalContainer: {
    backgroundColor: '#48bb78',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  motivationalText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

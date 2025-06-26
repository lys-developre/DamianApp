import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Pantalla del Módulo de Alimentación Gamificado
 *
 * Funcionalidades especializadas basadas en evidencia:
 * - Introducción gradual de alimentos con refuerzo positivo
 * - Sistema de recompensas visuales (estrellas, trofeos)
 * - Registro de progreso alimentario personalizado
 * - Técnicas de imitación digital (videos de familia)
 * - Desensibilización gradual (oler, tocar, probar)
 * - Seguimiento de patrones y preferencias
 *
 * Basado en principios terapéuticos:
 * - ABA: refuerzo inmediato de aproximaciones
 * - Integración sensorial: exposición gradual
 * - Modelado social: imitación de figuras cercanas
 *
 * @param {Function} onBack - Función para regresar al hub principal
 * @returns {JSX.Element} Pantalla de alimentación gamificada
 * @author Damian
 * @version 4.0.0
 */

// Datos de alimentos personalizados para Damián
const FOODS_DATA = [
  {
    id: 'danette',
    name: 'Danette Chocolate',
    category: 'favoritos',
    texture: 'cremoso',
    accepted: true,
    attempts: 15,
    lastTried: '2025-06-25',
    stars: 5,
    emoji: '🍫',
  },
  {
    id: 'sandwich',
    name: 'Sándwich Pan Lactal',
    category: 'favoritos',
    texture: 'suave',
    accepted: true,
    attempts: 20,
    lastTried: '2025-06-26',
    stars: 5,
    emoji: '🥪',
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'frutas',
    texture: 'suave',
    accepted: false,
    attempts: 3,
    lastTried: '2025-06-20',
    stars: 1,
    emoji: '🍌',
  },
  {
    id: 'manzana',
    name: 'Manzana Rallada',
    category: 'frutas',
    texture: 'suave',
    accepted: false,
    attempts: 2,
    lastTried: '2025-06-18',
    stars: 0,
    emoji: '🍎',
  },
  {
    id: 'yogur',
    name: 'Yogur Natural',
    category: 'lacteos',
    texture: 'cremoso',
    accepted: false,
    attempts: 1,
    lastTried: '2025-06-15',
    stars: 0,
    emoji: '🥛',
  },
  {
    id: 'galletas',
    name: 'Galletas de Avena',
    category: 'snacks',
    texture: 'crujiente',
    accepted: false,
    attempts: 0,
    lastTried: null,
    stars: 0,
    emoji: '🍪',
  },
];

const ACTIONS = [
  { id: 'smell', name: 'Oler', icon: 'blur-on', points: 1 },
  { id: 'touch', name: 'Tocar', icon: 'touch-app', points: 2 },
  { id: 'taste', name: 'Probar', icon: 'star', points: 5 },
  { id: 'finish', name: 'Terminar', icon: 'emoji-events', points: 10 },
];

export default function FoodModuleScreen({ onBack }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [dailyStars, setDailyStars] = useState(0);
  const [todayGoal] = useState(5); // Meta diaria de estrellas

  /**
   * Datos organizados por categorías para mejor navegación
   */
  const foodsByCategory = useMemo(() => {
    const categories = {};
    FOODS_DATA.forEach(food => {
      if (!categories[food.category]) {
        categories[food.category] = [];
      }
      categories[food.category].push(food);
    });
    return categories;
  }, []);

  /**
   * Maneja la selección de un alimento
   */
  const handleFoodSelect = useCallback(food => {
    setSelectedFood(food);
  }, []);

  /**
   * Maneja las acciones con alimentos (oler, tocar, probar)
   */
  const handleFoodAction = useCallback(
    (action, food) => {
      const newStars = dailyStars + action.points;
      setDailyStars(newStars);

      // Feedback positivo inmediato
      let message = '';
      switch (action.id) {
        case 'smell':
          message = `¡Excelente! Oliste ${food.name} 👃✨`;
          break;
        case 'touch':
          message = `¡Muy bien! Tocaste ${food.name} 👋⭐`;
          break;
        case 'taste':
          message = `¡Increíble! Probaste ${food.name} 😋🌟`;
          break;
        case 'finish':
          message = `¡FANTÁSTICO! Terminaste ${food.name} 🏆🎉`;
          break;
      }

      Alert.alert('¡Bien hecho!', message, [
        {
          text: '¡Genial!',
          onPress: () => {
            // Verificar si alcanzó la meta diaria
            if (newStars >= todayGoal) {
              Alert.alert(
                '🎉 ¡META CUMPLIDA! 🎉',
                '¡Conseguiste todas las estrellas de hoy! Eres increíble 🌟',
                [{ text: '¡Hurra!', style: 'default' }]
              );
            }
          },
        },
      ]);

      // TODO: Integrar con sistema de base de datos para persistencia
      // TODO: Implementar logging estructurado para análisis
      // logFoodEvent({
      //   food: food.name,
      //   action: action.id,
      //   points: action.points,
      //   timestamp: new Date(),
      //   userId: 'damian',
      //   context: 'food_module'
      // });
    },
    [dailyStars, todayGoal]
  );

  /**
   * Renderiza una categoría de alimentos
   */
  const renderFoodCategory = useCallback(
    ({ item: category }) => {
      const foods = foodsByCategory[category];

      return (
        <View style={styles.categoryContainer} key={category}>
          <Text style={styles.categoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {foods.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.foodCard,
                  food.accepted && styles.acceptedFood,
                  selectedFood?.id === food.id && styles.selectedFood,
                ]}
                onPress={() => handleFoodSelect(food)}
                activeOpacity={0.8}
                accessibilityLabel={`${food.name}, ${food.accepted ? 'aceptado' : 'nuevo'}`}
                accessibilityHint="Toca para ver opciones de este alimento"
              >
                <Text style={styles.foodEmoji}>{food.emoji}</Text>
                <Text style={styles.foodName}>{food.name}</Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcons
                      key={i}
                      name="star"
                      size={12}
                      color={i < food.stars ? '#FFD700' : '#E0E0E0'}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    },
    [foodsByCategory, selectedFood, handleFoodSelect]
  );

  /**
   * Renderiza las acciones disponibles para el alimento seleccionado
   */
  const renderActions = useCallback(() => {
    if (!selectedFood) return null;

    return (
      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>
          ¿Qué quieres hacer con {selectedFood.name}?
        </Text>
        <View style={styles.actionsGrid}>
          {ACTIONS.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => handleFoodAction(action, selectedFood)}
              activeOpacity={0.8}
              accessibilityLabel={`${action.name} ${selectedFood.name}`}
              accessibilityHint={`Gana ${action.points} estrella${action.points > 1 ? 's' : ''}`}
            >
              <MaterialIcons name={action.icon} size={24} color="#ffffff" />
              <Text style={styles.actionText}>{action.name}</Text>
              <Text style={styles.actionPoints}>+{action.points}⭐</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [selectedFood, handleFoodAction]);

  return (
    <View style={styles.container}>
      {/* Header con progreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel="Regresar al menú principal"
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Alimentación</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Hoy: {dailyStars}/{todayGoal} ⭐
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((dailyStars / todayGoal) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lista de categorías de alimentos */}
        <FlatList
          data={Object.keys(foodsByCategory)}
          renderItem={renderFoodCategory}
          keyExtractor={item => item}
          scrollEnabled={false}
        />

        {/* Acciones para alimento seleccionado */}
        {renderActions()}

        {/* Motivación adicional */}
        <View style={styles.motivationContainer}>
          <MaterialIcons name="emoji-events" size={32} color="#FFD700" />
          <Text style={styles.motivationText}>
            ¡Cada intento es un logro! 🌟
          </Text>
          <Text style={styles.motivationSubtext}>
            Pequeños pasos, grandes avances
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Estilos del módulo de alimentación
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#96CEB4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#96CEB4',
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  categoryContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  foodCard: {
    width: 120,
    height: 130,
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  acceptedFood: {
    borderColor: '#48bb78',
    backgroundColor: '#f0fff4',
  },
  selectedFood: {
    borderColor: '#96CEB4',
    backgroundColor: '#e6fffa',
    transform: [{ scale: 1.05 }],
  },
  foodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 12,
    color: '#2d3748',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  actionsTitle: {
    fontSize: 16,
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: width * 0.4,
    height: 80,
    backgroundColor: '#96CEB4',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  actionPoints: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 2,
  },
  motivationContainer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  motivationSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
  },
});

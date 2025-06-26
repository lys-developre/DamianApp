import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Pantalla del Modo Familia/Terapeuta
 *
 * Panel de administración especializado para:
 * - Personalización profunda de contenidos
 * - Configuración de estrategias terapéuticas
 * - Gestión de pictogramas y frases personalizadas
 * - Ajuste de recompensas y motivadores
 * - Configuración de rutinas y horarios
 * - Exportación e importación de configuraciones
 *
 * Funcionalidades de personalización:
 * - Agregar fotos reales de familiares y lugares conocidos
 * - Editar frases de comunicación específicas
 * - Configurar tiempos de espera y tolerancia
 * - Personalizar recompensas y refuerzos
 * - Ajustar niveles de dificultad
 *
 * @param {Function} onBack - Función para regresar al hub principal
 * @returns {JSX.Element} Panel de administración familiar
 * @author Damian
 * @version 4.0.0
 */

const ADMIN_SECTIONS = [
  {
    id: 'personalization',
    title: 'Personalización',
    icon: 'edit',
    description: 'Fotos, frases y pictogramas',
  },
  {
    id: 'strategies',
    title: 'Estrategias',
    icon: 'psychology',
    description: 'Técnicas de regulación',
  },
  {
    id: 'rewards',
    title: 'Recompensas',
    icon: 'star',
    description: 'Motivadores y refuerzos',
  },
  {
    id: 'schedule',
    title: 'Rutinas',
    icon: 'schedule',
    description: 'Horarios y actividades',
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: 'settings',
    description: 'Ajustes generales',
  },
];

const SAMPLE_SETTINGS = {
  waitTolerance: 5, // minutos
  audioEnabled: true,
  visualFeedback: true,
  autoSave: true,
  exportEnabled: true,
  therapistMode: false,
};

export default function AdminScreen({ onBack }) {
  const [selectedSection, setSelectedSection] = useState('personalization');
  const [settings, setSettings] = useState(SAMPLE_SETTINGS);
  const [newPhrase, setNewPhrase] = useState('');

  /**
   * Maneja la selección de sección
   */
  const handleSectionSelect = useCallback(sectionId => {
    setSelectedSection(sectionId);
  }, []);

  /**
   * Maneja cambios en configuración
   */
  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Maneja la adición de nueva frase
   */
  const handleAddPhrase = useCallback(() => {
    if (newPhrase.trim()) {
      Alert.alert(
        'Frase agregada',
        `"${newPhrase}" se ha añadido a la lista de comunicación`,
        [{ text: 'OK', onPress: () => setNewPhrase('') }]
      );
    }
  }, [newPhrase]);

  /**
   * Renderiza el contenido de la sección seleccionada
   */
  const renderSectionContent = useCallback(() => {
    switch (selectedSection) {
      case 'personalization':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>
              Personalización de Contenido
            </Text>

            <View style={styles.settingGroup}>
              <Text style={styles.groupTitle}>Agregar Nueva Frase</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Te quiero abuela"
                value={newPhrase}
                onChangeText={setNewPhrase}
                accessibilityLabel="Campo para nueva frase"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPhrase}
                activeOpacity={0.8}
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Agregar Frase</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.groupTitle}>Fotos Familiares</Text>
              <TouchableOpacity style={styles.photoButton} activeOpacity={0.8}>
                <MaterialIcons name="photo-camera" size={24} color="#667eea" />
                <Text style={styles.photoButtonText}>Agregar Foto de Mamá</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} activeOpacity={0.8}>
                <MaterialIcons name="photo-camera" size={24} color="#667eea" />
                <Text style={styles.photoButtonText}>Agregar Foto de Papá</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'strategies':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Estrategias Terapéuticas</Text>

            <View style={styles.settingGroup}>
              <Text style={styles.groupTitle}>Tiempo de Tolerancia</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>
                  Espera máxima: {settings.waitTolerance} minutos
                </Text>
                <View style={styles.sliderButtons}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() =>
                      handleSettingChange(
                        'waitTolerance',
                        Math.max(1, settings.waitTolerance - 1)
                      )
                    }
                  >
                    <MaterialIcons name="remove" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() =>
                      handleSettingChange(
                        'waitTolerance',
                        Math.min(15, settings.waitTolerance + 1)
                      )
                    }
                  >
                    <MaterialIcons name="add" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.groupTitle}>Estrategias Activas</Text>
              <View style={styles.strategyItem}>
                <MaterialIcons name="traffic" size={20} color="#4ECDC4" />
                <Text style={styles.strategyText}>Semáforo emocional</Text>
                <Switch
                  value={true}
                  onValueChange={value => {
                    // TODO: Implementar lógica de configuración
                    // updateStrategyConfig('traffic_light', value);
                  }}
                />
              </View>
              <View style={styles.strategyItem}>
                <MaterialIcons
                  name="hourglass-empty"
                  size={20}
                  color="#4ECDC4"
                />
                <Text style={styles.strategyText}>Reloj de espera</Text>
                <Switch
                  value={true}
                  onValueChange={value => {
                    // TODO: Implementar lógica de configuración
                    // updateStrategyConfig('wait_timer', value);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case 'rewards':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Sistema de Recompensas</Text>

            <View style={styles.rewardGrid}>
              <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
                <MaterialIcons name="star" size={32} color="#FFD700" />
                <Text style={styles.rewardText}>Estrellas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
                <MaterialIcons name="emoji-events" size={32} color="#FFD700" />
                <Text style={styles.rewardText}>Trofeos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
                <MaterialIcons name="music-note" size={32} color="#FFD700" />
                <Text style={styles.rewardText}>Música</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
                <MaterialIcons name="play-circle" size={32} color="#FFD700" />
                <Text style={styles.rewardText}>Videos</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'schedule':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Configuración de Rutinas</Text>

            <View style={styles.settingGroup}>
              <Text style={styles.groupTitle}>Horarios Principales</Text>
              <View style={styles.scheduleItem}>
                <MaterialIcons
                  name="breakfast-dining"
                  size={20}
                  color="#96CEB4"
                />
                <Text style={styles.scheduleText}>Desayuno: 8:00 AM</Text>
                <TouchableOpacity style={styles.editButton}>
                  <MaterialIcons name="edit" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
              <View style={styles.scheduleItem}>
                <MaterialIcons name="lunch-dining" size={20} color="#96CEB4" />
                <Text style={styles.scheduleText}>Almuerzo: 12:30 PM</Text>
                <TouchableOpacity style={styles.editButton}>
                  <MaterialIcons name="edit" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'settings':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Configuración General</Text>

            <View style={styles.settingGroup}>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Audio habilitado</Text>
                <Switch
                  value={settings.audioEnabled}
                  onValueChange={value =>
                    handleSettingChange('audioEnabled', value)
                  }
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Feedback visual</Text>
                <Switch
                  value={settings.visualFeedback}
                  onValueChange={value =>
                    handleSettingChange('visualFeedback', value)
                  }
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Guardado automático</Text>
                <Switch
                  value={settings.autoSave}
                  onValueChange={value =>
                    handleSettingChange('autoSave', value)
                  }
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Modo terapeuta</Text>
                <Switch
                  value={settings.therapistMode}
                  onValueChange={value =>
                    handleSettingChange('therapistMode', value)
                  }
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  }, [
    selectedSection,
    settings,
    newPhrase,
    handleAddPhrase,
    handleSettingChange,
  ]);

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

        <Text style={styles.headerTitle}>Modo Familia</Text>

        <TouchableOpacity style={styles.helpButton} activeOpacity={0.8}>
          <MaterialIcons name="help-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Navegación de secciones */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sectionNav}
          contentContainerStyle={styles.sectionNavContent}
        >
          {ADMIN_SECTIONS.map(section => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionCard,
                selectedSection === section.id && styles.selectedSectionCard,
              ]}
              onPress={() => handleSectionSelect(section.id)}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={section.icon}
                size={24}
                color={selectedSection === section.id ? '#ffffff' : '#667eea'}
              />
              <Text
                style={[
                  styles.sectionCardTitle,
                  selectedSection === section.id &&
                    styles.selectedSectionCardTitle,
                ]}
              >
                {section.title}
              </Text>
              <Text
                style={[
                  styles.sectionCardDescription,
                  selectedSection === section.id &&
                    styles.selectedSectionCardDescription,
                ]}
              >
                {section.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contenido de la sección */}
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {renderSectionContent()}
        </ScrollView>
      </View>
    </View>
  );
}

/**
 * Estilos del modo familia/terapeuta
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#667eea',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionCard: {
    width: 120,
    height: 100,
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedSectionCard: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  sectionCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    marginTop: 6,
  },
  selectedSectionCardTitle: {
    color: '#ffffff',
  },
  sectionCardDescription: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
    marginTop: 2,
  },
  selectedSectionCardDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingGroup: {
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#48bb78',
    borderRadius: 10,
    padding: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  photoButtonText: {
    color: '#667eea',
    fontSize: 14,
    marginLeft: 8,
  },
  sliderContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 15,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#2d3748',
    marginBottom: 10,
    textAlign: 'center',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  strategyText: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
    marginLeft: 10,
  },
  rewardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCard: {
    width: '48%',
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rewardText: {
    fontSize: 14,
    color: '#2d3748',
    marginTop: 8,
    fontWeight: '600',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  scheduleText: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
    marginLeft: 10,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    color: '#2d3748',
  },
});

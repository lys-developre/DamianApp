import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TimerImageButton from './TimerImageButton';
import { formatSeconds, imageTimerPresets as timePresets } from '../../utils';
import { useTimerImageButtonsManager } from './hooks/useTimerImageButtonsManager';

/**
 * Componente optimizado para gestión de temporizadores con imagen - Módulo 3
 *
 * MEJORAS MÓDULO 3:
 * - ✅ Integración con React Navigation
 * - ✅ useNavigation hook para navegación nativa
 * - ✅ Eliminación de prop onBack, ahora usa navigation.goBack()
 * - ✅ Navegación profesional y consistente
 *
 * MEJORAS ARQUITECTURA MÓDULO 2:
 * - ✅ Lógica extraída a hook personalizado useTimerImageButtonsManager
 * - ✅ Componente enfocado solo en UI
 * - ✅ React.memo para optimización de rendimiento
 * - ✅ Separación clara de responsabilidades
 *
 * @author Damian App
 * @version 3.0.0 - Navegación Módulo 3
 */
const TimerImageButtonsManager = React.memo(() => {
  const navigation = useNavigation();

  // Mock data temporal (en una app real vendría de Context o Redux)
  const mockTimerImageButtons = [
    {
      id: '1',
      image: 'https://placekitten.com/300/300',
      timer: '02:30:00',
      seconds: 2 * 3600 + 30 * 60,
      isActive: true,
    },
    {
      id: '2',
      image: 'https://placekitten.com/301/301',
      timer: '00:00:00',
      seconds: 0,
      isActive: false,
    },
  ];

  const mockSetTimerImageButtons = () => {
    // Mock setter - en implementación real actualizaría el estado global
    // console.log('Actualizando temporizadores...'); // Comentado para cumplir con ESLint
  };

  // Hook personalizado para toda la lógica de gestión
  const {
    showModal,
    newImage,
    newTimer,
    editId,
    manualDays,
    manualHours,
    manualMinutes,
    manualSeconds,
    openEditModal,
    openCreateModal,
    closeModal,
    pickImage,
    handleAddPreset,
    handleManualTime,
    handleResetTimer,
    handleSave,
    handleDelete,
    setManualDays,
    setManualHours,
    setManualMinutes,
    setManualSeconds,
  } = useTimerImageButtonsManager(
    mockTimerImageButtons,
    mockSetTimerImageButtons
  );

  // Handler para volver usando React Navigation
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Temporizadores</Text>
      <FlatList
        data={mockTimerImageButtons}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 8, alignItems: 'center' }}>
            <TimerImageButton
              image={item.image}
              timer={item.timer}
              isActive={item.isActive}
              onPress={() => {}}
            />
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editBtnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <Text style={styles.addButtonText}>+ Nuevo temporizador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

      {/* Modal para crear/editar temporizador */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editId ? 'Editar' : 'Nuevo'} temporizador
            </Text>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {newImage ? 'Cambiar imagen' : 'Elegir imagen'}
              </Text>
            </TouchableOpacity>
            {newImage ? (
              <Image source={{ uri: newImage }} style={styles.previewImg} />
            ) : null}
            <Text style={styles.presetLabel}>
              Tiempo total:{' '}
              <Text style={{ fontWeight: 'bold', color: '#48bb78' }}>
                {formatSeconds(newTimer)}
              </Text>
            </Text>
            <View style={styles.presetsRow}>
              {timePresets.map(preset => (
                <TouchableOpacity
                  key={preset.label}
                  style={styles.presetBtn}
                  onPress={() => handleAddPreset(preset.seconds)}
                >
                  <Text style={styles.presetBtnText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.manualTimeRow}>
              <TextInput
                style={styles.manualInput}
                placeholder="días"
                keyboardType="numeric"
                value={manualDays}
                onChangeText={setManualDays}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="horas"
                keyboardType="numeric"
                value={manualHours}
                onChangeText={setManualHours}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="min"
                keyboardType="numeric"
                value={manualMinutes}
                onChangeText={setManualMinutes}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="seg"
                keyboardType="numeric"
                value={manualSeconds}
                onChangeText={setManualSeconds}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
            </View>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                handleResetTimer();
                setManualDays('');
                setManualHours('');
                setManualMinutes('');
                setManualSeconds('');
              }}
            >
              <Text style={styles.resetBtnText}>Reiniciar tiempo</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.saveBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

TimerImageButtonsManager.displayName = 'TimerImageButtonsManager';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    minHeight: 160,
    marginBottom: 20,
  },
  editBtn: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#48bb78',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#F59E42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 10,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    width: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imagePickerBtn: {
    backgroundColor: '#45B7D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  presetLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  presetBtn: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    margin: 4,
  },
  presetBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  manualTimeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  manualInput: {
    backgroundColor: '#374151',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
  },
  resetBtn: {
    backgroundColor: '#6B7280',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#48bb78',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#E53E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
});

export default TimerImageButtonsManager;

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
import { useAppContext } from '../../context';
import { useTheme } from '../../theme';
import TimerImageButton from './TimerImageButton';
import { formatSeconds, imageTimerPresets as timePresets } from '../../utils';
import { useTimerImageButtonsManager } from './hooks/useTimerImageButtonsManager';

/**
 * Componente optimizado para gestión de temporizadores con imagen - Módulo 7
 *
 * MEJORAS MÓDULO 7:
 * - ✅ Migración completa al theme system centralizado
 * - ✅ Eliminación de colores hardcodeados
 * - ✅ Mantenimiento del aspecto visual actual
 * - ✅ Preparación para modo oscuro/claro
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
 * @version 4.0.0 - Theme System Módulo 7
 */
const TimerImageButtonsManager = React.memo(() => {
  const navigation = useNavigation();
  const { state, timerImageActions } = useAppContext();
  const { colors } = useTheme();

  // Extraer datos del estado global
  const { timerImageButtons } = state;

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
    timerImageButtons,
    timerImageActions.setTimerImageButtons
  );

  // Handler para volver usando React Navigation
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND_PRIMARY }]}
    >
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        Gestión de Temporizadores
      </Text>
      <FlatList
        data={timerImageButtons}
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
                style={[styles.editBtn, { backgroundColor: colors.SECONDARY }]}
                onPress={() => openEditModal(item)}
              >
                <Text
                  style={[styles.editBtnText, { color: colors.TEXT_PRIMARY }]}
                >
                  Editar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: colors.DANGER }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text
                  style={[styles.deleteBtnText, { color: colors.TEXT_PRIMARY }]}
                >
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.SECONDARY }]}
        onPress={openCreateModal}
      >
        <Text style={[styles.addButtonText, { color: colors.TEXT_PRIMARY }]}>
          + Nuevo temporizador
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.WARNING }]}
        onPress={handleGoBack}
      >
        <Text style={[styles.buttonText, { color: colors.TEXT_PRIMARY }]}>
          Volver
        </Text>
      </TouchableOpacity>

      {/* Modal para crear/editar temporizador */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.BACKGROUND_CARD },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.TEXT_PRIMARY }]}>
              {editId ? 'Editar' : 'Nuevo'} temporizador
            </Text>
            <TouchableOpacity
              style={[
                styles.imagePickerBtn,
                { backgroundColor: colors.PRIMARY },
              ]}
              onPress={pickImage}
            >
              <Text
                style={[styles.imagePickerText, { color: colors.TEXT_PRIMARY }]}
              >
                {newImage ? 'Cambiar imagen' : 'Elegir imagen'}
              </Text>
            </TouchableOpacity>
            {newImage ? (
              <Image source={{ uri: newImage }} style={styles.previewImg} />
            ) : null}
            <Text style={[styles.presetLabel, { color: colors.TEXT_PRIMARY }]}>
              Tiempo total:{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: colors.TEXT_SUCCESS,
                }}
              >
                {formatSeconds(newTimer)}
              </Text>
            </Text>
            <View style={styles.presetsRow}>
              {timePresets.map(preset => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.presetBtn,
                    { backgroundColor: colors.BACKGROUND_SECONDARY },
                  ]}
                  onPress={() => handleAddPreset(preset.seconds)}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      { color: colors.TEXT_PRIMARY },
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.manualTimeRow}>
              <TextInput
                style={[
                  styles.manualInput,
                  {
                    backgroundColor: colors.BACKGROUND_SECONDARY,
                    color: colors.TEXT_PRIMARY,
                    borderColor: colors.BORDER_PRIMARY,
                  },
                ]}
                placeholder="días"
                keyboardType="numeric"
                value={manualDays}
                onChangeText={setManualDays}
                onBlur={handleManualTime}
                placeholderTextColor={colors.TEXT_MUTED}
                maxLength={2}
              />
              <TextInput
                style={[
                  styles.manualInput,
                  {
                    backgroundColor: colors.BACKGROUND_SECONDARY,
                    color: colors.TEXT_PRIMARY,
                    borderColor: colors.BORDER_PRIMARY,
                  },
                ]}
                placeholder="horas"
                keyboardType="numeric"
                value={manualHours}
                onChangeText={setManualHours}
                onBlur={handleManualTime}
                placeholderTextColor={colors.TEXT_MUTED}
                maxLength={2}
              />
              <TextInput
                style={[
                  styles.manualInput,
                  {
                    backgroundColor: colors.BACKGROUND_SECONDARY,
                    color: colors.TEXT_PRIMARY,
                    borderColor: colors.BORDER_PRIMARY,
                  },
                ]}
                placeholder="min"
                keyboardType="numeric"
                value={manualMinutes}
                onChangeText={setManualMinutes}
                onBlur={handleManualTime}
                placeholderTextColor={colors.TEXT_MUTED}
                maxLength={2}
              />
              <TextInput
                style={[
                  styles.manualInput,
                  {
                    backgroundColor: colors.BACKGROUND_SECONDARY,
                    color: colors.TEXT_PRIMARY,
                    borderColor: colors.BORDER_PRIMARY,
                  },
                ]}
                placeholder="seg"
                keyboardType="numeric"
                value={manualSeconds}
                onChangeText={setManualSeconds}
                onBlur={handleManualTime}
                placeholderTextColor={colors.TEXT_MUTED}
                maxLength={2}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.resetBtn,
                { backgroundColor: colors.BACKGROUND_TERTIARY },
              ]}
              onPress={() => {
                handleResetTimer();
                setManualDays('');
                setManualHours('');
                setManualMinutes('');
                setManualSeconds('');
              }}
            >
              <Text
                style={[styles.resetBtnText, { color: colors.TEXT_PRIMARY }]}
              >
                Reiniciar tiempo
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.SECONDARY }]}
                onPress={handleSave}
              >
                <Text
                  style={[styles.saveBtnText, { color: colors.TEXT_PRIMARY }]}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.DANGER }]}
                onPress={closeModal}
              >
                <Text
                  style={[styles.saveBtnText, { color: colors.TEXT_PRIMARY }]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

TimerImageButtonsManager.displayName = 'TimerImageButtonsManager';

// Estilos sin colores hardcodeados - los colores vienen del theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    minHeight: 160,
    marginBottom: 20,
  },
  editBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 10,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imagePickerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePickerText: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    margin: 4,
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  manualTimeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  manualInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
});

export default TimerImageButtonsManager;

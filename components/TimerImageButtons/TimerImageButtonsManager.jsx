import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import TimerImageButton from './TimerImageButton';

const timePresets = [
  { label: '15 min', seconds: 15 * 60 },
  { label: '30 min', seconds: 30 * 60 },
  { label: '1 hora', seconds: 60 * 60 },
  { label: '1 día', seconds: 24 * 60 * 60 },
  { label: '1 semana', seconds: 7 * 24 * 60 * 60 },
  { label: '1 mes', seconds: 30 * 24 * 60 * 60 },
];

function formatSeconds(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let str = '';
  if (days > 0) str += days + 'd ';
  if (hours > 0 || days > 0) str += hours.toString().padStart(2, '0') + ':';
  str += minutes.toString().padStart(2, '0') + ':';
  str += seconds.toString().padStart(2, '0');
  return str.trim();
}

const TimerImageButtonsManager = ({
  onBack,
  timerImageButtons,
  setTimerImageButtons,
}) => {
  // Estado para edición
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newTimer, setNewTimer] = useState(0); // en segundos
  const [editId, setEditId] = useState(null);
  const [manualDays, setManualDays] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualSeconds, setManualSeconds] = useState('');

  // Elimina el estado local de buttons, usa el global
  const buttons = timerImageButtons;

  // Al pulsar editar, carga los datos en el modal
  const openEditModal = item => {
    setEditId(item.id);
    setNewImage(item.image);
    setNewTimer(item.seconds || 0);
    setManualDays('');
    setManualHours('');
    setManualMinutes('');
    setManualSeconds('');
    setShowModal(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImage(result.assets[0].uri);
    }
  };

  const handleAddPreset = seconds => {
    setNewTimer(prev => prev + seconds);
  };

  const handleResetTimer = () => setNewTimer(0);

  const handleManualTime = () => {
    const d = parseInt(manualDays) || 0;
    const h = parseInt(manualHours) || 0;
    const m = parseInt(manualMinutes) || 0;
    const s = parseInt(manualSeconds) || 0;
    setNewTimer(d * 86400 + h * 3600 + m * 60 + s);
  };

  const handleSave = () => {
    if (!newImage || newTimer <= 0) return;
    if (editId) {
      setTimerImageButtons(prev =>
        prev.map(btn =>
          btn.id === editId
            ? {
                ...btn,
                image: newImage,
                timer: formatSeconds(newTimer),
                seconds: newTimer,
                isActive: true,
              }
            : btn
        )
      );
    } else {
      setTimerImageButtons(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          image: newImage,
          timer: formatSeconds(newTimer),
          seconds: newTimer,
          isActive: true,
        },
      ]);
    }
    setShowModal(false);
    setNewImage('');
    setNewTimer(0);
    setEditId(null);
    setManualDays('');
    setManualHours('');
    setManualMinutes('');
    setManualSeconds('');
  };

  const handleDelete = id => {
    Alert.alert(
      'Eliminar temporizador',
      '¿Seguro que deseas eliminar este temporizador?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            setTimerImageButtons(prev => prev.filter(btn => btn.id !== id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de temporizadores con imagen</Text>
      <FlatList
        data={buttons}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center' }}>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setShowModal(true);
          setEditId(null);
          setNewImage('');
          setNewTimer(0);
        }}
      >
        <Text style={styles.addButtonText}>+ Nuevo temporizador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
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
                onChangeText={t => {
                  setManualDays(t);
                }}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="horas"
                keyboardType="numeric"
                value={manualHours}
                onChangeText={t => {
                  setManualHours(t);
                }}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="min"
                keyboardType="numeric"
                value={manualMinutes}
                onChangeText={t => {
                  setManualMinutes(t);
                }}
                onBlur={handleManualTime}
                placeholderTextColor="#aaa"
                maxLength={2}
              />
              <TextInput
                style={styles.manualInput}
                placeholder="seg"
                keyboardType="numeric"
                value={manualSeconds}
                onChangeText={t => {
                  setManualSeconds(t);
                }}
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
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowModal(false);
                  setEditId(null);
                }}
              >
                <Text style={styles.saveBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    color: '#222',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    width: 250,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#48bb78',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  previewImg: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 14,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#45B7D1',
  },
  presetLabel: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  presetBtn: {
    backgroundColor: '#38A169',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  presetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resetBtn: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignSelf: 'center',
    marginTop: 2,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  manualTimeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  manualInput: {
    backgroundColor: '#fff',
    color: '#222',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    width: 54,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  imagePickerBtn: {
    backgroundColor: '#45B7D1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 4,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default TimerImageButtonsManager;

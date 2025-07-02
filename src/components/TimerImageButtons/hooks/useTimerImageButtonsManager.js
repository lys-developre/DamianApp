import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Hook personalizado para gestión de temporizadores con imagen
 *
 * RESPONSABILIDADES:
 * - Gestión de estado del formulario
 * - Lógica de validación de tiempo
 * - Manejo de selección de imágenes
 * - Operaciones CRUD de temporizadores
 *
 * @param {Array} timerImageButtons - Array actual de temporizadores
 * @param {Function} setTimerImageButtons - Setter para actualizar temporizadores
 * @returns {Object} Estados y funciones para gestionar temporizadores
 *
 * @author Damian App
 * @version 1.0.0
 */
export const useTimerImageButtonsManager = (
  timerImageButtons,
  setTimerImageButtons
) => {
  // Estados del formulario
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newTimer, setNewTimer] = useState(0);
  const [editId, setEditId] = useState(null);

  // Estados para input manual de tiempo
  const [manualDays, setManualDays] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualSeconds, setManualSeconds] = useState('');

  /**
   * Abre el modal para editar un temporizador existente
   */
  const openEditModal = useCallback(item => {
    setEditId(item.id);
    setNewImage(item.image);
    setNewTimer(item.seconds || 0);
    setManualDays('');
    setManualHours('');
    setManualMinutes('');
    setManualSeconds('');
    setShowModal(true);
  }, []);

  /**
   * Abre el modal para crear un nuevo temporizador
   */
  const openCreateModal = useCallback(() => {
    setShowModal(true);
    setEditId(null);
    setNewImage('');
    setNewTimer(0);
    setManualDays('');
    setManualHours('');
    setManualMinutes('');
    setManualSeconds('');
  }, []);

  /**
   * Cierra el modal y resetea el estado
   */
  const closeModal = useCallback(() => {
    setShowModal(false);
    setNewImage('');
    setNewTimer(0);
    setEditId(null);
    setManualDays('');
    setManualHours('');
    setManualMinutes('');
    setManualSeconds('');
  }, []);

  /**
   * Selecciona una imagen desde la galería
   */
  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewImage(result.assets[0].uri);
      }
    } catch (_error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  }, []);

  /**
   * Añade tiempo preset al temporizador actual
   */
  const handleAddPreset = useCallback(seconds => {
    setNewTimer(prev => prev + seconds);
  }, []);

  /**
   * Calcula el tiempo total desde los inputs manuales
   */
  const calculateManualTime = useCallback(() => {
    const days = parseInt(manualDays) || 0;
    const hours = parseInt(manualHours) || 0;
    const minutes = parseInt(manualMinutes) || 0;
    const seconds = parseInt(manualSeconds) || 0;

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }, [manualDays, manualHours, manualMinutes, manualSeconds]);

  /**
   * Actualiza el tiempo cuando se cambian los inputs manuales
   */
  const handleManualTime = useCallback(() => {
    const totalSeconds = calculateManualTime();
    setNewTimer(totalSeconds);
  }, [calculateManualTime]);

  /**
   * Resetea el temporizador a 0
   */
  const handleResetTimer = useCallback(() => {
    setNewTimer(0);
  }, []);

  /**
   * Valida y guarda el temporizador (crear o editar)
   */
  const handleSave = useCallback(() => {
    // Validaciones
    if (!newImage.trim()) {
      Alert.alert('Error', 'Selecciona una imagen');
      return;
    }

    if (newTimer <= 0) {
      Alert.alert('Error', 'El temporizador debe ser mayor a 0');
      return;
    }

    const formatSeconds = totalSeconds => {
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
    };

    const timerData = {
      id: editId || Date.now().toString(),
      image: newImage,
      timer: formatSeconds(newTimer),
      seconds: newTimer,
      isActive: false,
    };

    if (editId) {
      // Editar existente
      setTimerImageButtons(prev =>
        prev.map(btn => (btn.id === editId ? timerData : btn))
      );
    } else {
      // Crear nuevo
      setTimerImageButtons(prev => [...prev, timerData]);
    }

    closeModal();
  }, [newImage, newTimer, editId, setTimerImageButtons, closeModal]);

  /**
   * Elimina un temporizador con confirmación
   */
  const handleDelete = useCallback(
    id => {
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
    },
    [setTimerImageButtons]
  );

  return {
    // Estados
    showModal,
    newImage,
    newTimer,
    editId,
    manualDays,
    manualHours,
    manualMinutes,
    manualSeconds,

    // Setters para inputs manuales
    setManualDays,
    setManualHours,
    setManualMinutes,
    setManualSeconds,

    // Funciones
    openEditModal,
    openCreateModal,
    closeModal,
    pickImage,
    handleAddPreset,
    handleManualTime,
    handleResetTimer,
    handleSave,
    handleDelete,
  };
};

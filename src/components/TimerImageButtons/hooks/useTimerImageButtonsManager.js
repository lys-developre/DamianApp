import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { utilsService, businessLogic, validator } from '../../../services';

/**
 * Hook personalizado para gestión de temporizadores con imagen - Módulo 5
 *
 * MEJORAS MÓDULO 5:
 * - ✅ Integración con servicios centralizados
 * - ✅ Validación robusta con ValidationService
 * - ✅ Lógica de negocio centralizada en BusinessLogicService
 * - ✅ Mejor manejo de errores y feedback
 * - ✅ Formateo consistente con UtilsService
 *
 * RESPONSABILIDADES:
 * - Gestión de estado del formulario
 * - Coordinación con servicios de validación y lógica
 * - Manejo de selección de imágenes
 * - Interfaz entre UI y servicios de negocio
 *
 * @param {Array} timerImageButtons - Array actual de temporizadores
 * @param {Function} setTimerImageButtons - Setter para actualizar temporizadores
 * @returns {Object} Estados y funciones para gestionar temporizadores
 *
 * @author Damian App
 * @version 2.0.0 - Servicios Módulo 5
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
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);

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
    // Validar preset usando BusinessLogicService
    const preset = businessLogic.findPresetBySeconds(seconds);
    if (preset) {
      setNewTimer(prev => prev + seconds);
    } else {
      // Validar segundos directamente
      const validation = validator
        .reset()
        .timerDuration(seconds)
        .getValidationResults();
      if (validation.isValid) {
        setNewTimer(prev => prev + seconds);
      } else {
        Alert.alert('Error', 'Preset de tiempo inválido');
      }
    }
  }, []);

  /**
   * Calcula el tiempo total desde los inputs manuales usando UtilsService
   */
  const calculateManualTime = useCallback(() => {
    const timeComponents = {
      days: parseInt(manualDays) || 0,
      hours: parseInt(manualHours) || 0,
      minutes: parseInt(manualMinutes) || 0,
      seconds: parseInt(manualSeconds) || 0,
    };

    // Usar BusinessLogicService para conversión con validación
    const result = businessLogic.convertManualTimeToSeconds(timeComponents);

    if (result.success) {
      return result.seconds;
    } else {
      // Fallback usando UtilsService
      return utilsService.timeComponentsToSeconds(timeComponents);
    }
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
    // Limpiar errores anteriores
    setValidationErrors([]);
    setValidationWarnings([]);

    // Preparar datos para validación
    const timerData = {
      id: editId || utilsService.generateNumericId(timerImageButtons),
      image: newImage,
      seconds: newTimer,
      isActive: false,
    };

    // Usar BusinessLogicService para crear/actualizar con validación completa
    const result = editId
      ? businessLogic.updateTimerImageButton(
          editId,
          timerData,
          timerImageButtons
        )
      : businessLogic.createTimerImageButton(timerData, timerImageButtons);

    if (!result.success) {
      // Mostrar errores de validación
      setValidationErrors(result.errors || []);
      setValidationWarnings(result.warnings || []);

      const errorMessages =
        result.errors?.map(e => e.message).join('\n') || 'Error de validación';
      Alert.alert('Error de validación', errorMessages);
      return;
    }

    // Mostrar warnings si existen (no bloquean el guardado)
    if (result.warnings && result.warnings.length > 0) {
      setValidationWarnings(result.warnings);
      const warningMessages = result.warnings.map(w => w.message).join('\n');
      Alert.alert('Advertencias', warningMessages);
    }

    // Actualizar estado con el timer validado y normalizado
    if (editId) {
      // Editar existente
      setTimerImageButtons(prev =>
        prev.map(btn => (btn.id === editId ? result.timer : btn))
      );
    } else {
      // Crear nuevo
      setTimerImageButtons(prev => [...prev, result.timer]);
    }

    closeModal();
  }, [
    newImage,
    newTimer,
    editId,
    timerImageButtons,
    setTimerImageButtons,
    closeModal,
    setValidationErrors,
    setValidationWarnings,
  ]);

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
    validationErrors,
    validationWarnings,

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

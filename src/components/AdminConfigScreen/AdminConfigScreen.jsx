import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import TimerImageButtonsManager from '../TimerImageButtons/TimerImageButtonsManager';

/**
 * Pantalla de configuración administrativa de Damian APP - Optimizada
 *
 * MEJORAS MÓDULO 2:
 * - ✅ React.memo para optimización de rendimiento
 * - ✅ useCallback para handlers estables
 * - ✅ Separación clara de responsabilidades
 * - ✅ Accesibilidad completa
 *
 * FUNCIONALIDAD: Hub de configuración para familia/terapeutas
 * NAVEGACIÓN: Renderizado condicional entre menú principal y sub-pantallas
 *
 * CARACTERÍSTICAS TÉCNICAS:
 * - useState para navegación local (showTimerImageManager)
 * - useCallback para handlers optimizados
 * - Accesibilidad completa para usuarios con necesidades especiales
 * - Props validation con PropTypes
 *
 * FLUJO DE NAVEGACIÓN:
 * 1. Muestra menú principal con opciones de configuración
 * 2. Al seleccionar opción → renderiza sub-pantalla específica
 * 3. Sub-pantalla puede volver al menú principal
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onBack - Callback para volver a pantalla anterior
 * @param {Array} props.timerImageButtons - Array de temporizadores con imagen
 * @param {Function} props.setTimerImageButtons - Setter para temporizadores
 * @returns {JSX.Element} Pantalla de configuración administrativa
 * @author Damian
 * @version 2.0.0 - Optimizado Módulo 2
 */
const AdminConfigScreen = React.memo(
  ({ onBack, timerImageButtons, setTimerImageButtons }) => {
    const [showTimerImageManager, setShowTimerImageManager] = useState(false);

    // Handlers memoizados para optimización de rendimiento
    const handleBackToMenu = useCallback(
      () => setShowTimerImageManager(false),
      []
    );

    const handleShowTimerManager = useCallback(
      () => setShowTimerImageManager(true),
      []
    );

    // RENDERIZADO CONDICIONAL: Sub-pantalla de gestión de temporizadores
    if (showTimerImageManager) {
      return (
        <TimerImageButtonsManager
          onBack={handleBackToMenu}
          timerImageButtons={timerImageButtons}
          setTimerImageButtons={setTimerImageButtons}
        />
      );
    }

    // RENDERIZADO PRINCIPAL: Menú de configuración administrativa
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Configuración</Text>

        {/* BOTÓN: Gestión de temporizadores con imagen */}
        <TouchableOpacity
          style={styles.configButton}
          onPress={handleShowTimerManager}
          accessibilityRole="button"
          accessibilityLabel="Gestionar imágenes con temporizador"
          accessibilityHint="Abre la pantalla para configurar temporizadores con imágenes"
        >
          <Text style={styles.buttonText}>Imagenes con temporizador</Text>
        </TouchableOpacity>

        {/* BOTÓN: Configuración de temporizador digital */}
        <TouchableOpacity
          style={styles.configButton}
          accessibilityRole="button"
          accessibilityLabel="Configurar temporizador digital"
          accessibilityHint="Abre configuración del temporizador principal"
        >
          <Text style={styles.buttonText}>Configurar temporizador</Text>
        </TouchableOpacity>

        {/* BOTÓN: Configuración de frases motivacionales */}
        <TouchableOpacity
          style={styles.configButton}
          accessibilityRole="button"
          accessibilityLabel="Configurar frases motivacionales"
          accessibilityHint="Personaliza las frases que aparecen durante los temporizadores"
        >
          <Text style={styles.buttonText}>Configurar frases</Text>
        </TouchableOpacity>

        {/* BOTÓN: Volver a pantalla anterior */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          accessibilityHint="Regresa a la pantalla principal de la aplicación"
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

AdminConfigScreen.displayName = 'AdminConfigScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  configButton: {
    backgroundColor: '#45B7D1',
    paddingVertical: 16,
    paddingHorizontal: 20, // Menos padding horizontal para texto largo
    borderRadius: 16,
    marginBottom: 18,
    minWidth: 260,
    maxWidth: 320,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#F59E42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 30,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center', // Centrado para varias líneas
  },
});

// VALIDACIÓN DE PROPS: PropTypes para desarrollo seguro
AdminConfigScreen.propTypes = {
  /**
   * Función callback para volver a la pantalla anterior
   * Se ejecuta cuando el usuario presiona "Volver"
   */
  onBack: PropTypes.func.isRequired,

  /**
   * Array de objetos con temporizadores con imagen
   * Cada objeto debe tener: {id, image, timer, seconds, isActive}
   */
  timerImageButtons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      timer: PropTypes.string.isRequired,
      seconds: PropTypes.number.isRequired,
      isActive: PropTypes.bool.isRequired,
    })
  ).isRequired,

  /**
   * Función setter para actualizar el estado de temporizadores
   * Recibe el nuevo array de temporizadores como parámetro
   */
  setTimerImageButtons: PropTypes.func.isRequired,
};

export default AdminConfigScreen;

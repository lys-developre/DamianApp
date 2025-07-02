import React from 'react';
import { View } from 'react-native';

// Hooks personalizados
import { useSwitches } from './hooks/useSwitches';

// Componentes
import SwitchesHeader from './components/SwitchesHeader';
import SwitchesGrid from './components/SwitchesGrid';
import SwitchesCelebrationModal from './components/SwitchesCelebrationModal';

// Estilos
import { switchesStyles } from './styles/switchesStyles';

/**
 * InteractiveSwitches - Componente de switches interactivos estilo iOS
 *
 * CARACTERÍSTICAS:
 * - 40 switches interactivos estilo iOS nativo
 * - Diseño exacto basado en imagen de referencia iOS
 * - Track redondeado (#E5E5EA/#007AFF), thumb grande (24px)
 * - Distribución: 4 switches por fila (10 filas, 40 total)
 * - Espaciado optimizado para 10 filas completas
 * - Vibración al presionar y al completar todos
 * - Modal de celebración al completar todos los switches
 * - Arquitectura modular con hooks y componentes separados
 *
 * @author Damian App
 * @version 17.0.0 - 40 iOS Switches (4x10 grid)
 */

const InteractiveSwitches = () => {
  // Hook principal para manejar el estado de los switches
  const {
    switches,
    toggleSwitch,
    resetAllSwitches,
    showCelebration,
    closeCelebration,
  } = useSwitches();

  return (
    <View style={switchesStyles.container}>
      {/* CAPAS DEL EFECTO GLASS */}
      <View style={switchesStyles.glassOverlay} />
      <View style={switchesStyles.innerGlassBorder} />

      {/* CONTENIDO PRINCIPAL */}
      <View style={switchesStyles.switchesContent}>
        {/* GRID DE SWITCHES CENTRADO */}
        <SwitchesGrid
          switches={switches}
          onToggle={toggleSwitch}
          styles={switchesStyles}
        />

        {/* BOTÓN DE RESET EN LA PARTE INFERIOR */}
        <SwitchesHeader onReset={resetAllSwitches} styles={switchesStyles} />
      </View>

      {/* MODAL DE CELEBRACIÓN */}
      <SwitchesCelebrationModal
        visible={showCelebration}
        onClose={closeCelebration}
        styles={switchesStyles}
      />
    </View>
  );
};

export default InteractiveSwitches;

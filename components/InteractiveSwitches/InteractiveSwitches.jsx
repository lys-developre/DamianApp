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
 * InteractiveSwitches - Componente de switches interactivos estilo Android
 *
 * CARACTERÍSTICAS:
 * - 40 switches interactivos estilo Android
 * - Efecto glass moderno similar a DigitalTimer
 * - Vibración al presionar y al completar todos
 * - Modal de celebración al completar todos los switches
 * - Arquitectura modular con hooks y componentes separados
 *
 * @author Damian App
 * @version 2.0.0
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

import React from 'react';
import { View } from 'react-native';

// Context global
import { useAppContext } from '../../context';

// Componentes
import SwitchesHeader from './components/SwitchesHeader';
import SwitchesGrid from './components/SwitchesGrid';
import SwitchesCelebrationModal from './components/SwitchesCelebrationModal';

// Estilos
import { switchesStyles } from './styles/switchesStyles';

/**
 * InteractiveSwitches - Componente optimizado de switches interactivos estilo iOS
 *
 * MEJORAS MÓDULO 2:
 * - ✅ React.memo para optimización de rendimiento
 * - ✅ Lógica extraída a hook personalizado useSwitches
 * - ✅ Componentes UI separados y optimizados
 * - ✅ Responsabilidad única: coordinar switches
 *
 * MEJORAS MÓDULO 4:
 * - ✅ Migración a Context API para estado global
 * - ✅ Eliminación de hook local useSwitches
 * - ✅ Estado persistente entre sesiones
 * - ✅ Comunicación reactiva con otros componentes
 *
 * CARACTERÍSTICAS:
 * - 40 switches interactivos estilo iOS nativo
 * - Diseño exacto basado en imagen de referencia iOS
 * - Track redondeado (#E5E5EA/#007AFF), thumb grande (24px)
 * - Distribución: 4 switches por fila (10 filas, 40 total)
 * - Espaciado optimizado para 10 filas completas
 * - Vibración al presionar y al completar todos
 * - Modal de celebración al completar todos los switches
 * - Arquitectura modular con estado global centralizado
 *
 * @author Damian App
 * @version 20.0.0 - Estado Global Módulo 4
 */
const InteractiveSwitches = React.memo(() => {
  // Hook principal para manejar el estado global de switches
  const { state, switchesActions } = useAppContext();

  // Extraer estado de switches del context global
  const { switchesState } = state;
  const { switches, showCelebration } = switchesState;

  // Extraer acciones del context
  const { toggleSwitch, resetAllSwitches, setCelebration } = switchesActions;

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
        onClose={() => setCelebration(false)}
        styles={switchesStyles}
      />
    </View>
  );
});

InteractiveSwitches.displayName = 'InteractiveSwitches';

export default InteractiveSwitches;

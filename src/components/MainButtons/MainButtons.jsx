import React from 'react';
import { View } from 'react-native';
import MainButton from './MainButton';

/**
 * Componente reutilizable optimizado para el grid de botones principales
 *
 * MEJORAS MÓDULO 2:
 * - ✅ React.memo para evitar re-renders innecesarios
 * - ✅ Componente enfocado solo en UI de presentación
 *
 * @param {Array} buttons - Array de props para MainButton
 * @param {object} styles - Objeto de estilos para los botones
 * @author Damian App
 * @version 2.0.0 - Optimizado
 */
const MainButtons = React.memo(({ buttons, styles }) => {
  return (
    <View style={styles.modulesGrid}>
      {buttons.map(({ key, ...btn }) => (
        <MainButton key={key} {...btn} styles={styles} />
      ))}
    </View>
  );
});

MainButtons.displayName = 'MainButtons';

export default MainButtons;

import React from 'react';
import { View } from 'react-native';
import MainButton from './MainButton';

/**
 * Componente reutilizable para el grid de botones principales
 * @param {Array} buttons - Array de props para MainButton
 * @param {object} styles - Objeto de estilos para los botones
 */
export default function MainButtons({ buttons, styles }) {
  return (
    <View style={styles.modulesGrid}>
      {buttons.map(btn => (
        <MainButton key={btn.key} {...btn} styles={styles} />
      ))}
    </View>
  );
}

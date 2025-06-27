import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

/**
 * Componente del grid de switches - ESTILO iOS
 * Implementa 10 switches con diseño iOS nativo
 *
 * @author Damian App
 * @version 12.0.0 - iOS Style Switches
 */

const SwitchesGrid = React.memo(({ switches, onToggle, styles }) => {
  return (
    <View style={styles.gridContainer}>
      {switches.map(switchItem => (
        <TouchableOpacity
          key={switchItem.id}
          style={[
            styles.switchTrack,
            switchItem.isActive && styles.switchTrackActive,
          ]}
          onPress={() => onToggle(switchItem.id)}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              {
                transform: [
                  {
                    translateX: switchItem.isActive ? 20 : 0, // Movimiento correcto para track 46px y thumb 24px
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
});

SwitchesGrid.displayName = 'SwitchesGrid';

export default SwitchesGrid;

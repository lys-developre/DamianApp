import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

/**
 * Componente del modal de celebración para switches completados
 *
 * @author Damian App
 * @version 1.0.0
 */

const SwitchesCelebrationModal = React.memo(({ visible, onClose, styles }) => {
  const { width } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.celebrationModal}>
        <ConfettiCannon
          count={150}
          origin={{ x: width / 2, y: 0 }}
          fadeOut={true}
          autoStart={visible}
          colors={[
            '#FFD700',
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
          ]}
        />

        <View style={styles.celebrationContent}>
          {/* Trofeo Principal */}
          <Text style={styles.celebrationTrophy}>🏆</Text>

          {/* Mensaje de Felicitación */}
          <Text style={styles.celebrationTitle}>¡EXCELENTE!</Text>
          <Text style={styles.celebrationSubtitle}>
            ¡Completaste todos los switches!{'\n'}¡Muy bien hecho! 🌟
          </Text>

          {/* Botón de Continuar */}
          <TouchableOpacity
            style={styles.celebrationButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.celebrationButtonText}>¡Continuar! 🚀</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

SwitchesCelebrationModal.displayName = 'SwitchesCelebrationModal';

export default SwitchesCelebrationModal;

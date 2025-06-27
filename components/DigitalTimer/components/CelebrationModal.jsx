import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

/**
 * Componente del modal de celebración fantástico
 *
 * @author Damian App
 * @version 1.0.0
 */

const CelebrationModal = React.memo(
  ({
    showCelebration,
    modalOpacity,
    trophyScale,
    medallRotation,
    confettiScale,
    closeCelebration,
    styles,
  }) => (
    <Modal
      visible={showCelebration}
      transparent={true}
      animationType="none"
      onRequestClose={closeCelebration}
    >
      <Animated.View
        style={[styles.celebrationModal, { opacity: modalOpacity }]}
      >
        <ConfettiCannon
          count={200}
          origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
          fadeOut={true}
          autoStart={showCelebration}
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
          {/* Trofeo Principal Animado */}
          <Animated.View
            style={[
              styles.trophyContainer,
              {
                transform: [{ scale: trophyScale }],
              },
            ]}
          >
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.numberOne}>#1</Text>
          </Animated.View>

          {/* Mensaje de Felicitación */}
          <Text style={styles.celebrationTitle}>¡INCREÍBLE!</Text>
          <Text style={styles.celebrationSubtitle}>
            Muy bien Damian! Ya tienes mas puntos en paciencia{'\n'} ¡Ganador
            Damian! 🌟
          </Text>

          {/* Medallas Giratorias */}
          <Animated.View
            style={[
              styles.medallContainer,
              {
                transform: [
                  {
                    rotate: medallRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.medal}>🥇</Text>
            <Text style={styles.medal}>🎖️</Text>
            <Text style={styles.medal}>🏅</Text>
          </Animated.View>

          {/* Efectos Adicionales */}
          <Animated.View
            style={[
              styles.celebrationSparkleContainer,
              {
                transform: [{ scale: confettiScale }],
              },
            ]}
          >
            <Text style={styles.celebrationSparkle}>✨</Text>
            <Text style={styles.celebrationSparkle}>🌟</Text>
            <Text style={styles.celebrationSparkle}>💫</Text>
            <Text style={styles.celebrationSparkle}>⭐</Text>
          </Animated.View>

          {/* Botón de Continuar */}
          <TouchableOpacity
            style={styles.celebrationButton}
            onPress={closeCelebration}
            activeOpacity={0.8}
          >
            <Text style={styles.celebrationButtonText}>¡Continuar! 🚀</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  )
);

CelebrationModal.displayName = 'CelebrationModal';

export default CelebrationModal;

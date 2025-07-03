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
import {
  useUIConfig,
  useAccessibilityConfig,
  useHapticsConfig,
} from '../../../hooks/useConfig';

/**
 * Componente del modal de celebración fantástico
 *
 * @author Damian App
 * @version 2.0.0 - Con configuración avanzada
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
  }) => {
    // Hooks de configuración
    const uiConfig = useUIConfig();
    const accessibilityConfig = useAccessibilityConfig();
    const hapticsConfig = useHapticsConfig();

    // Verificar si las animaciones están habilitadas
    const animationsEnabled =
      uiConfig.animations?.enabled !== false &&
      !accessibilityConfig.reduceAnimations;

    // Función para manejar el cierre con haptics
    const handleClose = async () => {
      // Solo ejecutar haptics si está habilitado
      if (hapticsConfig.enabled) {
        try {
          const { hapticsService } = await import('../services/hapticsService');
          await hapticsService.light(); // Feedback ligero al cerrar
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }
      }
      closeCelebration();
    };

    return (
      <Modal
        visible={showCelebration}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <Animated.View
          style={[styles.celebrationModal, { opacity: modalOpacity }]}
        >
          {/* Solo mostrar confetti si las animaciones están habilitadas */}
          {animationsEnabled && (
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
          )}

          <View style={styles.celebrationContent}>
            {/* Trofeo Principal Animado */}
            <Animated.View
              style={[
                styles.trophyContainer,
                {
                  transform: [
                    {
                      scale: animationsEnabled ? trophyScale : 1,
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.numberOne}>#1</Text>
            </Animated.View>

            {/* Mensaje de Felicitación */}
            <Text style={styles.celebrationTitle}>¡MUY BIEN DAMIAN!</Text>
            <Text style={styles.celebrationSubtitle}>
              Ya tienes mas puntos en paciencia{'\n'} ¡Ganador Damian! 🌟
            </Text>

            {/* Medallas Giratorias */}
            <Animated.View
              style={[
                styles.medallContainer,
                {
                  transform: [
                    {
                      rotate: animationsEnabled
                        ? medallRotation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          })
                        : '0deg',
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
                  transform: [
                    {
                      scale: animationsEnabled ? confettiScale : 1,
                    },
                  ],
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
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationButtonText}>¡Continuar! 🚀</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    );
  }
);

CelebrationModal.displayName = 'CelebrationModal';

export default CelebrationModal;

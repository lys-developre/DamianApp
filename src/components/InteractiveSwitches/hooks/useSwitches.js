import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado de los switches interactivos
 *
 * FUNCIONALIDADES:
 * - Estado de 40 switches independientes (duplicado)
 * - Toggle individual de cada switch con vibración
 * - Reset de todos los switches
 * - Celebración cuando todos están activos
 * - Integración con haptics para feedback
 *
 * @author Damian App
 * @version 2.0.0
 */

export const useSwitches = () => {
  // Estado inicial: 40 switches estilo iOS
  const [switches, setSwitches] = useState(
    Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      isActive: false,
      label: `Switch ${index + 1}`,
    }))
  );

  // Estado de celebración
  const [showCelebration, setShowCelebration] = useState(false);

  /**
   * Alterna el estado de un switch específico con vibración
   */
  const toggleSwitch = useCallback(
    async switchId => {
      // Importar haptics dinámicamente para evitar problemas de dependencias
      try {
        const { hapticsService } = await import(
          '../../DigitalTimer/services/hapticsService'
        );
        await hapticsService.light(); // Vibración suave al presionar
      } catch (error) {
        console.warn('Haptics no disponible:', error);
      }

      setSwitches(prevSwitches => {
        const newSwitches = prevSwitches.map(switchItem => {
          if (switchItem.id === switchId) {
            return {
              ...switchItem,
              isActive: !switchItem.isActive,
            };
          }
          return switchItem;
        });

        // Verificar si todos los switches están activos
        const allActive = newSwitches.every(sw => sw.isActive);
        if (allActive && !showCelebration) {
          // Activar celebración
          setShowCelebration(true);
          // Vibración de celebración
          setTimeout(async () => {
            try {
              const { hapticsService } = await import(
                '../../DigitalTimer/services/hapticsService'
              );
              await hapticsService.celebration();
            } catch (error) {
              console.warn('Haptics no disponible:', error);
            }
          }, 100);
        }

        return newSwitches;
      });
    },
    [showCelebration]
  );

  /**
   * Reinicia todos los switches en cadena (uno por uno)
   */
  const resetAllSwitches = useCallback(() => {
    setShowCelebration(false);

    setSwitches(prevSwitches => {
      // Encontrar todos los switches activos
      const activeSwitches = prevSwitches
        .map((sw, index) => ({ ...sw, originalIndex: index }))
        .filter(sw => sw.isActive);

      if (activeSwitches.length === 0) return prevSwitches;

      // Reiniciar en cadena con delay
      activeSwitches.forEach((switchItem, index) => {
        setTimeout(() => {
          setSwitches(currentSwitches =>
            currentSwitches.map(sw =>
              sw.id === switchItem.id ? { ...sw, isActive: false } : sw
            )
          );
        }, index * 100); // 100ms de delay entre cada switch
      });

      return prevSwitches; // No cambiar el estado inmediatamente
    });
  }, []);

  /**
   * Cierra la celebración
   */
  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  /**
   * Obtiene el número de switches activos
   */
  const getActiveCount = useCallback(() => {
    return switches.filter(switchItem => switchItem.isActive).length;
  }, [switches]);

  return {
    switches,
    toggleSwitch,
    resetAllSwitches,
    getActiveCount,
    showCelebration,
    closeCelebration,
  };
};

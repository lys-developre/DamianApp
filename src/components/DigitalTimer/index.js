/**
 * Barrel exports para el módulo DigitalTimer
 * Facilita las importaciones desde otros componentes
 *
 * @author Damian App
 * @version 1.0.0
 */

// Componente principal
export { default } from './DigitalTimer';

// Componentes individuales (por si se necesitan por separado)
export { default as TimeDisplay } from './components/TimeDisplay';
export { default as ControlButtons } from './components/ControlButtons';
export { default as TimePresets } from './components/TimePresets';
export { default as MotivationalHeader } from './components/MotivationalHeader';
export { default as CelebrationModal } from './components/CelebrationModal';

// Hooks personalizados
export { useTimer } from './hooks/useTimer';
export { useTimerAnimations } from './hooks/useTimerAnimations';

// Servicios - Importar desde ubicación centralizada
export { hapticsService } from '../../services/media/haptics';
export { audioService } from '../../services/media/audio';

// Utilidades
export * from './utils/timerUtils';

// Constantes
export { motivationalPhrases } from './constants/motivationalPhrases';

// Estilos
export { timerStyles } from './styles/timerStyles';

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

// Servicios
export { hapticsService } from './services/hapticsService';
export { audioService } from './services/audioService';

// Utilidades
export * from './utils/timerUtils';

// Constantes
export { timePresets } from './constants/timePresets';
export { motivationalPhrases } from './constants/motivationalPhrases';

// Estilos
export { timerStyles } from './styles/timerStyles';

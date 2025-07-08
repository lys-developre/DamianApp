/**
 * Configuration exports centralizados
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 8
 */

// Exportar configuración
export {
  DEFAULT_CONFIG,
  CONFIG_VALIDATORS,
  PRESET_CONFIGS,
} from '../config/appConfig';

// Exportar servicio
export { default as configService } from '../services/core/config';

// Exportar hooks
export {
  useConfig,
  useConfigValue,
  useUIConfig,
  useAudioConfig,
  useHapticsConfig,
  useAccessibilityConfig,
  useConfigMetrics,
  default,
} from '../hooks/useConfig';

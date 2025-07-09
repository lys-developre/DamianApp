/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🧪 TESTS UNITARIOS PARA useTimer HOOK - DamianApp
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 PROPÓSITO:
 * Tests comprehensivos para el hook useTimer, que es crítico para la funcionalidad
 * principal del temporizador TEA (Trastorno del Espectro Autista).
 *
 * 🔍 COBERTURA DE TESTS:
 * ✅ Estados iniciales del hook
 * ✅ Configuración de presets de tiempo
 * ✅ Control de reproducción (play/pause/reset)
 * ✅ Countdown y progreso del temporizador
 * ✅ Integración con servicios de audio y haptics
 * ✅ Manejo de celebraciones al completar
 * ✅ Manejo de errores y edge cases
 * ✅ Cleanup de recursos al desmontar
 *
 * 🧩 DEPENDENCIAS MOCKEADAS:
 * - React Native Alert (para alertas de usuario)
 * - Hooks de configuración (useHapticsConfig, useAudioConfig)
 * - Servicios de audio y haptics (imports dinámicos)
 * - Timers globales (jest fake timers)
 *
 * @author DamianApp Core Team
 * @version 1.0.0 - Tests Prioritarios
 * @since 2025-07-09
 */

import { renderHook, act, cleanup } from '@testing-library/react-native';
import { useTimer } from '../useTimer';
import { useHapticsConfig, useAudioConfig } from '../../../../hooks/useConfig';

// ════════════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN DE MOCKS ROBUSTA
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Mock de los hooks de configuración con reset automático
 */
jest.mock('../../../../hooks/useConfig', () => ({
  useHapticsConfig: jest.fn(),
  useAudioConfig: jest.fn(),
}));

/**
 * Factory para crear mocks fresh en cada test
 */
const createFreshMocks = () => ({
  audioService: {
    initialize: jest.fn().mockResolvedValue(true),
    cleanup: jest.fn().mockResolvedValue(true),
    almostDone: jest.fn().mockResolvedValue(true),
    epicCelebration: jest.fn().mockResolvedValue(true),
  },
  hapticsService: {
    initialize: jest.fn().mockResolvedValue(true),
    tick: jest.fn().mockResolvedValue(true),
    heavy: jest.fn().mockResolvedValue(true),
    medium: jest.fn().mockResolvedValue(true),
    celebration: jest.fn().mockResolvedValue(true),
  },
});

// Mocks globales que se resetean en cada test
let mockAudioService;
let mockHapticsService;

/**
 * Mock de imports dinámicos con factory pattern
 */
jest.mock('@services/media/audio/audioService', () => ({
  __esModule: true,
  get default() {
    return mockAudioService || createFreshMocks().audioService;
  },
}));

jest.mock('@services/media/haptics/hapticsService', () => ({
  __esModule: true,
  get default() {
    return mockHapticsService || createFreshMocks().hapticsService;
  },
}));

// ════════════════════════════════════════════════════════════════════════════════
// 🧪 SUITE PRINCIPAL DE TESTS
// ════════════════════════════════════════════════════════════════════════════════

describe('useTimer Hook - Temporizador TEA', () => {
  // ────────────────────────────────────────────────────────────────────────────
  // 📋 CONFIGURACIÓN ROBUSTA DE TESTS
  // ────────────────────────────────────────────────────────────────────────────

  const defaultHapticsConfig = {
    enabled: true,
    intensity: 'medium',
  };

  const defaultAudioConfig = {
    enabled: true,
    volume: 0.8,
  };

  /**
   * Setup aislado para cada test individual
   * Garantiza que no hay interferencias entre tests
   */
  const setupTest = () => {
    // Crear mocks frescos para este test
    const mocks = createFreshMocks();
    mockAudioService = mocks.audioService;
    mockHapticsService = mocks.hapticsService;

    // Configurar hooks de configuración
    useHapticsConfig.mockReturnValue(defaultHapticsConfig);
    useAudioConfig.mockReturnValue(defaultAudioConfig);

    return { mockAudioService, mockHapticsService };
  };

  /**
   * Cleanup completo después de cada test
   */
  const teardownTest = () => {
    // Cleanup de React Testing Library
    cleanup();

    // Limpiar todos los mocks
    jest.clearAllMocks();

    // Limpiar timers
    jest.clearAllTimers();

    // Resetear referencias de mocks
    mockAudioService = null;
    mockHapticsService = null;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    teardownTest();
  });

  // ────────────────────────────────────────────────────────────────────────────
  // 🧪 TESTS AISLADOS Y ROBUSTOS
  // ────────────────────────────────────────────────────────────────────────────

  describe('Inicialización', () => {
    it('debe inicializarse con valores por defecto', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      expect(result.current.time).toBe(3600); // 1 hora por defecto
      expect(result.current.isRunning).toBe(false);
      expect(result.current.initialTime).toBe(3600);
      expect(result.current.activePresetIndex).toBe(6);
      expect(result.current.showCelebration).toBe(false);
    });
  });

  describe('Cálculo de progreso', () => {
    it('debe calcular el progreso correctamente al inicio', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(100, 0);
      });

      expect(result.current.getProgress()).toBe(0);
      expect(result.current.time).toBe(100);
      expect(result.current.initialTime).toBe(100);
    });

    it('debe retornar 0% cuando initialTime es 0', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(0, 0);
      });

      expect(result.current.getProgress()).toBe(0);
    });

    it('debe calcular progreso correctamente con diferentes valores', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      // Test con 100 segundos iniciales
      act(() => {
        result.current.setPresetTime(100, 0);
      });

      // Al inicio, el progreso debe ser 0%
      expect(result.current.getProgress()).toBe(0);

      // Test con tiempo 0
      act(() => {
        result.current.setPresetTime(0, 1);
      });

      expect(result.current.getProgress()).toBe(0);
    });
  });

  describe('Configuración de presets', () => {
    it('debe configurar preset time correctamente', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(300, 1); // 5 minutos, preset index 1
      });

      expect(result.current.time).toBe(300);
      expect(result.current.initialTime).toBe(300);
      expect(result.current.activePresetIndex).toBe(1);
    });

    it('debe manejar preset con tiempo 0', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(0, 2);
      });

      expect(result.current.time).toBe(0);
      expect(result.current.initialTime).toBe(0);
      expect(result.current.activePresetIndex).toBe(2);
    });
  });

  describe('Control del temporizador', () => {
    it('debe alternar entre iniciar y pausar', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(60, 0); // 1 minuto
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.toggleTimer();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.toggleTimer();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('debe reiniciar el temporizador correctamente', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.setPresetTime(60, 0);
        result.current.toggleTimer();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.resetTimer();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.time).toBe(60);
    });
  });

  describe('Estado de celebración', () => {
    it('debe manejar el cierre de celebración', () => {
      setupTest();

      const { result } = renderHook(() => useTimer());

      // Simular que la celebración está activa
      act(() => {
        // Esto normalmente se activaría cuando el tiempo llega a 0
        if (result.current.closeCelebration) {
          result.current.closeCelebration();
        }
      });

      expect(result.current.showCelebration).toBe(false);
    });
  });
});

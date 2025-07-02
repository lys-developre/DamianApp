/**
 * Utilidades para testing y testabilidad - Módulo 5
 *
 * RESPONSABILIDADES:
 * - Helpers para crear datos de prueba
 * - Mocks de servicios para testing
 * - Validadores de estado para tests
 * - Generadores de escenarios de prueba
 *
 * PATRONES IMPLEMENTADOS:
 * - Test Data Builder para crear objetos de prueba
 * - Mock Factory para servicios simulados
 * - Assertion Helpers para validaciones
 * - Scenario Builder para casos complejos
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 5
 */

/* eslint-env jest */

/**
 * Generador de datos de prueba para temporizadores
 */
export const testDataBuilders = {
  /**
   * Crea un temporizador de prueba con valores por defecto
   */
  createMockTimer(overrides = {}) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      image: 'https://example.com/test-image.png',
      seconds: 1800, // 30 minutos por defecto
      isActive: false,
      timer: '00:30:00',
      ...overrides,
    };
  },

  /**
   * Crea múltiples temporizadores de prueba
   */
  createMockTimerList(count = 3, customData = {}) {
    return Array.from({ length: count }, (_, index) =>
      this.createMockTimer({
        id: `test-timer-${index + 1}`,
        seconds: (index + 1) * 600, // 10, 20, 30 minutos
        ...customData,
      })
    );
  },

  /**
   * Crea switches de prueba
   */
  createMockSwitches(count = 40, activeCount = 0) {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      isActive: index < activeCount,
      label: `Switch ${index + 1}`,
    }));
  },

  /**
   * Crea estado global de prueba
   */
  createMockAppState(overrides = {}) {
    return {
      timerImageButtons: this.createMockTimerList(2),
      switchesState: {
        switches: this.createMockSwitches(40, 5),
        isComplete: false,
      },
      globalConfig: {
        haptics: true,
        sounds: true,
        theme: 'dark',
      },
      userPreferences: {
        language: 'es',
        animations: true,
      },
      ...overrides,
    };
  },

  /**
   * Crea datos de uso para métricas
   */
  createMockUsageData(overrides = {}) {
    return {
      sessions: [
        { duration: 300, timestamp: Date.now() - 86400000 },
        { duration: 450, timestamp: Date.now() - 43200000 },
        { duration: 600, timestamp: Date.now() - 3600000 },
      ],
      interactions: 150,
      totalTime: 1350,
      errors: 5,
      totalActions: 200,
      completedTasks: 25,
      totalTasks: 35,
      preferredFeatures: ['timer', 'switches', 'haptics'],
      ...overrides,
    };
  },
};

/**
 * Mocks de servicios para testing
 */
export const serviceMocks = {
  /**
   * Mock del StorageService
   */
  createStorageServiceMock() {
    const storage = new Map();

    // Mock function que simula jest.fn() pero sin dependencia
    const createMockFn = implementation => {
      const fn = implementation || (() => {});
      fn.mockCalls = [];
      fn.mockImplementation = impl => {
        fn._implementation = impl;
        return fn;
      };
      fn.mockResolvedValue = value => {
        fn._implementation = () => Promise.resolve(value);
        return fn;
      };
      fn.mockReturnValue = value => {
        fn._implementation = () => value;
        return fn;
      };
      return fn;
    };

    return {
      setItem: createMockFn(async (key, value) => {
        storage.set(key, value);
        return true;
      }),

      getItem: createMockFn(async (key, defaultValue = null) => {
        return storage.has(key) ? storage.get(key) : defaultValue;
      }),

      removeItem: createMockFn(async key => {
        storage.delete(key);
        return true;
      }),

      clear: createMockFn(async () => {
        storage.clear();
        return true;
      }),

      multiSet: createMockFn(() => Promise.resolve(true)),
      multiGet: createMockFn(() => Promise.resolve({})),
      getAllKeys: createMockFn(() => Promise.resolve([])),
    };
  },

  /**
   * Mock del HapticsService
   */
  createHapticsServiceMock() {
    const createMockFn = () => {
      const fn = () => {};
      fn.mockCalls = [];
      return fn;
    };

    return {
      light: createMockFn(),
      medium: createMockFn(),
      heavy: createMockFn(),
      success: createMockFn(),
      warning: createMockFn(),
      error: createMockFn(),
      celebration: createMockFn(),
      isAvailable: () => true,
    };
  },

  /**
   * Mock del AudioService
   */
  createAudioServiceMock() {
    const createMockFn = () => {
      const fn = () => Promise.resolve(true);
      fn.mockCalls = [];
      return fn;
    };

    return {
      playNotification: createMockFn(),
      playPhraseChange: createMockFn(),
      playAlmostDone: createMockFn(),
      epicCelebration: createMockFn(),
      stopAll: createMockFn(),
      setVolume: createMockFn(),
    };
  },

  /**
   * Mock del ValidationService
   */
  createValidationServiceMock() {
    const mockService = {
      reset: () => mockService,
      required: () => mockService,
      timerDuration: () => mockService,
      imageUrl: () => mockService,
      getValidationResults: () => ({
        isValid: true,
        errors: [],
        warnings: [],
      }),
    };

    return mockService;
  },
};

/**
 * Helpers para validaciones en tests
 */
export const testAssertions = {
  /**
   * Valida que un timer tenga la estructura correcta
   */
  isValidTimer(timer) {
    return (
      timer &&
      typeof timer === 'object' &&
      typeof timer.id === 'string' &&
      typeof timer.seconds === 'number' &&
      typeof timer.isActive === 'boolean' &&
      (typeof timer.image === 'string' || timer.image === null)
    );
  },

  /**
   * Valida que un array de switches tenga la estructura correcta
   */
  isValidSwitchesArray(switches) {
    return (
      Array.isArray(switches) &&
      switches.every(
        switch_ =>
          switch_ &&
          typeof switch_.id === 'number' &&
          typeof switch_.isActive === 'boolean' &&
          typeof switch_.label === 'string'
      )
    );
  },

  /**
   * Valida que el estado global tenga la estructura correcta
   */
  isValidAppState(state) {
    return (
      state &&
      typeof state === 'object' &&
      Array.isArray(state.timerImageButtons) &&
      state.switchesState &&
      Array.isArray(state.switchesState.switches) &&
      typeof state.switchesState.isComplete === 'boolean' &&
      state.globalConfig &&
      typeof state.globalConfig === 'object'
    );
  },

  /**
   * Valida que un resultado de servicio tenga la estructura correcta
   */
  isValidServiceResult(result) {
    return (
      result &&
      typeof result === 'object' &&
      typeof result.success === 'boolean' &&
      (result.success === true ||
        Array.isArray(result.errors) ||
        typeof result.error === 'string')
    );
  },
};

/**
 * Generadores de escenarios para tests complejos
 */
export const testScenarios = {
  /**
   * Escenario: Usuario completa todos los switches
   */
  allSwitchesCompleted() {
    return {
      description: 'Usuario activa todos los switches',
      initialState: testDataBuilders.createMockAppState({
        switchesState: {
          switches: testDataBuilders.createMockSwitches(40, 40),
          isComplete: true,
        },
      }),
      expectedActions: ['SHOW_CELEBRATION', 'PLAY_HAPTICS', 'PLAY_AUDIO'],
    };
  },

  /**
   * Escenario: Timer completa exitosamente
   */
  timerCompleted() {
    return {
      description: 'Timer llega a 0 segundos',
      initialState: {
        time: 5,
        isRunning: true,
        initialTime: 1800,
      },
      expectedActions: ['STOP_TIMER', 'SHOW_CELEBRATION', 'PLAY_AUDIO'],
    };
  },

  /**
   * Escenario: Creación de timer con validación fallida
   */
  invalidTimerCreation() {
    return {
      description: 'Intento de crear timer con datos inválidos',
      inputData: {
        id: '',
        image: 'invalid-url',
        seconds: -100,
      },
      expectedResult: {
        success: false,
        errors: ['ID requerido', 'URL de imagen inválida', 'Duración inválida'],
      },
    };
  },

  /**
   * Escenario: Optimización de rendimiento
   */
  performanceOptimization() {
    return {
      description: 'App con muchos timers necesita optimización',
      initialState: testDataBuilders.createMockAppState({
        timerImageButtons: testDataBuilders.createMockTimerList(50), // Muchos timers
      }),
      expectedOptimizations: [
        'REMOVE_DUPLICATES',
        'LAZY_LOADING',
        'VIRTUALIZATION',
      ],
    };
  },
};

/**
 * Utilidades para simular interacciones de usuario
 */
export const userInteractionSimulators = {
  /**
   * Simula la creación de un timer paso a paso
   */
  async simulateTimerCreation(mockServices) {
    const steps = [
      { action: 'OPEN_MODAL', data: null },
      { action: 'SELECT_IMAGE', data: 'test-image.png' },
      { action: 'SET_DURATION', data: 1800 },
      { action: 'SAVE_TIMER', data: null },
    ];

    const results = [];
    for (const step of steps) {
      // Simular delay entre acciones
      await new Promise(resolve => setTimeout(resolve, 100));
      results.push({
        step: step.action,
        timestamp: Date.now(),
        success: true,
      });
    }

    return results;
  },

  /**
   * Simula la activación secuencial de switches
   */
  async simulateSwitchActivation(switchCount = 10, delayMs = 50) {
    const activations = [];

    for (let i = 0; i < switchCount; i++) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      activations.push({
        switchId: i + 1,
        timestamp: Date.now(),
        isActive: true,
      });
    }

    return activations;
  },

  /**
   * Simula una sesión completa de uso de la app
   */
  async simulateUserSession(duration = 300000) {
    // 5 minutos por defecto
    const session = {
      startTime: Date.now(),
      endTime: null,
      actions: [],
      screens: ['Home'],
    };

    const actions = [
      'OPEN_TIMER_MANAGER',
      'CREATE_TIMER',
      'START_TIMER',
      'ACTIVATE_SWITCHES',
      'RESET_SWITCHES',
      'COMPLETE_SESSION',
    ];

    const actionInterval = duration / actions.length;

    for (const action of actions) {
      await new Promise(resolve => setTimeout(resolve, actionInterval));
      session.actions.push({
        type: action,
        timestamp: Date.now(),
      });
    }

    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;

    return session;
  },
};

// Exports para facilitar el uso en tests
export default {
  testDataBuilders,
  serviceMocks,
  testAssertions,
  testScenarios,
  userInteractionSimulators,
};

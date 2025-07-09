import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageService, configService } from '../services';

/**
 * Context principal de la aplicación Damian APP - Módulo 5
 *
 * RESPONSABILIDADES:
 * - Gestión centralizada del estado global
 * - Persistencia automática con StorageService
 * - Comunicación entre módulos independientes
 * - Configuraciones globales de la aplicación
 * - Estado reactivo entre componentes
 *
 * MEJORAS MÓDULO 5:
 * - ✅ Integración con StorageService centralizado
 * - ✅ Mejor manejo de errores en persistencia
 * - ✅ Operaciones batch para mejor rendimiento
 * - ✅ Validación de datos antes de persistir
 *
 * ESTADO CENTRALIZADO:
 * - timerImageButtons: Temporizadores con imagen
 * - switchesState: Estado de switches interactivos
 * - globalConfig: Configuraciones de la app
 * - userPreferences: Preferencias personalizadas
 *
 * @author Damian App
 * @version 2.0.0 - Servicios Módulo 5
 */

// Clave para StorageService
const STORAGE_KEY = 'app_state';

// Estado inicial de la aplicación
const initialState = {
  // Temporizadores con imagen (migrado desde HomeScreen)
  timerImageButtons: [
    {
      id: '1',
      image: 'https://placekitten.com/300/300',
      timer: '02:30:00',
      seconds: 2 * 3600 + 30 * 60, // 2h 30m
      isActive: true,
    },
    {
      id: '2',
      image: 'https://placekitten.com/301/301',
      timer: '00:00:00',
      seconds: 0,
      isActive: false,
    },
  ],

  // Estado de switches (se conectará con useSwitches)
  switchesState: {
    switches: Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      isActive: false,
      label: `Switch ${index + 1}`,
    })),
    showCelebration: false,
  },

  // Preferencias del usuario/terapeuta
  userPreferences: {
    lastUsedTimer: null,
    favoriteTimers: [],
    customPhrases: [],
    sessionHistory: [],
  },

  // Estado de carga y persistencia
  isLoading: true,
  isInitialized: false,
};

// Tipos de acciones para el reducer
const ActionTypes = {
  // Inicialización
  INITIALIZE_STATE: 'INITIALIZE_STATE',
  SET_LOADING: 'SET_LOADING',

  // Timer Image Buttons
  ADD_TIMER_IMAGE_BUTTON: 'ADD_TIMER_IMAGE_BUTTON',
  UPDATE_TIMER_IMAGE_BUTTON: 'UPDATE_TIMER_IMAGE_BUTTON',
  DELETE_TIMER_IMAGE_BUTTON: 'DELETE_TIMER_IMAGE_BUTTON',
  SET_TIMER_IMAGE_BUTTONS: 'SET_TIMER_IMAGE_BUTTONS',

  // Switches
  UPDATE_SWITCHES_STATE: 'UPDATE_SWITCHES_STATE',
  TOGGLE_SWITCH: 'TOGGLE_SWITCH',
  RESET_ALL_SWITCHES: 'RESET_ALL_SWITCHES',
  RESET_SWITCHES_CASCADE: 'RESET_SWITCHES_CASCADE',
  SET_SWITCHES_CELEBRATION: 'SET_SWITCHES_CELEBRATION',

  // Preferencias de usuario
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  ADD_SESSION_HISTORY: 'ADD_SESSION_HISTORY',
  ADD_FAVORITE_TIMER: 'ADD_FAVORITE_TIMER',
  REMOVE_FAVORITE_TIMER: 'REMOVE_FAVORITE_TIMER',
};

/**
 * Reducer principal para gestionar todas las acciones del estado global
 */
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_STATE:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isInitialized: true,
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    // Timer Image Buttons Actions
    case ActionTypes.SET_TIMER_IMAGE_BUTTONS:
      return {
        ...state,
        timerImageButtons: action.payload,
      };

    case ActionTypes.ADD_TIMER_IMAGE_BUTTON:
      return {
        ...state,
        timerImageButtons: [...state.timerImageButtons, action.payload],
      };

    case ActionTypes.UPDATE_TIMER_IMAGE_BUTTON:
      return {
        ...state,
        timerImageButtons: state.timerImageButtons.map(timer =>
          timer.id === action.payload.id
            ? { ...timer, ...action.payload.updates }
            : timer
        ),
      };

    case ActionTypes.DELETE_TIMER_IMAGE_BUTTON:
      return {
        ...state,
        timerImageButtons: state.timerImageButtons.filter(
          timer => timer.id !== action.payload
        ),
      };

    // Switches Actions
    case ActionTypes.UPDATE_SWITCHES_STATE:
      return {
        ...state,
        switchesState: {
          ...state.switchesState,
          ...action.payload,
        },
      };

    case ActionTypes.TOGGLE_SWITCH:
      const updatedSwitches = state.switchesState.switches.map(switchItem =>
        switchItem.id === action.payload
          ? { ...switchItem, isActive: !switchItem.isActive }
          : switchItem
      );

      // La celebración se controlará desde las acciones según la configuración
      const shouldShowCelebration = false; // Se controla desde switchesActions

      return {
        ...state,
        switchesState: {
          ...state.switchesState,
          switches: updatedSwitches,
          showCelebration: shouldShowCelebration,
        },
      };

    case ActionTypes.RESET_ALL_SWITCHES:
      return {
        ...state,
        switchesState: {
          ...state.switchesState,
          switches: state.switchesState.switches.map(switchItem => ({
            ...switchItem,
            isActive: false,
          })),
          showCelebration: false,
        },
      };

    case ActionTypes.RESET_SWITCHES_CASCADE:
      // Esta acción se usa para el reset individual de cada switch en cascada
      return {
        ...state,
        switchesState: {
          ...state.switchesState,
          switches: state.switchesState.switches.map(switchItem =>
            switchItem.id === action.payload
              ? { ...switchItem, isActive: false }
              : switchItem
          ),
        },
      };

    case ActionTypes.SET_SWITCHES_CELEBRATION:
      return {
        ...state,
        switchesState: {
          ...state.switchesState,
          showCelebration: action.payload,
        },
      };

    // Global Config Actions
    case ActionTypes.UPDATE_GLOBAL_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...state.globalConfig,
          ...action.payload,
        },
      };

    case ActionTypes.UPDATE_TIMER_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...state.globalConfig,
          timer: {
            ...state.globalConfig.timer,
            ...action.payload,
          },
        },
      };

    case ActionTypes.UPDATE_SWITCHES_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...state.globalConfig,
          switches: {
            ...state.globalConfig.switches,
            ...action.payload,
          },
        },
      };

    case ActionTypes.UPDATE_ACCESSIBILITY_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...state.globalConfig,
          accessibility: {
            ...state.globalConfig.accessibility,
            ...action.payload,
          },
        },
      };

    case ActionTypes.UPDATE_THEME_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...state.globalConfig,
          theme: {
            ...state.globalConfig.theme,
            ...action.payload,
          },
        },
      };

    // User Preferences Actions
    case ActionTypes.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload,
        },
      };

    case ActionTypes.ADD_SESSION_HISTORY:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          sessionHistory: [
            action.payload,
            ...state.userPreferences.sessionHistory,
          ].slice(0, 50), // Mantener últimas 50 sesiones
        },
      };

    case ActionTypes.ADD_FAVORITE_TIMER:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          favoriteTimers: [
            ...state.userPreferences.favoriteTimers,
            action.payload,
          ],
        },
      };

    case ActionTypes.REMOVE_FAVORITE_TIMER:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          favoriteTimers: state.userPreferences.favoriteTimers.filter(
            id => id !== action.payload
          ),
        },
      };

    default:
      return state;
  }
};

// Crear el Context
const AppContext = createContext();

/**
 * Provider del Context principal con persistencia automática
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Guarda el estado usando StorageService con mejor manejo de errores
   */
  const saveStateToStorage = async currentState => {
    try {
      // Excluir propiedades que no necesitan persistencia
      const { isLoading, isInitialized, ...stateToSave } = currentState;

      const success = await storageService.setItem(STORAGE_KEY, stateToSave, {
        useCache: true,
        debug: __DEV__,
      });

      if (!success && __DEV__) {
        console.warn('⚠️ Estado no pudo ser guardado completamente');
      }
    } catch (error) {
      console.warn('❌ Error saving state:', error);
    }
  };

  /**
   * Carga el estado usando StorageService con validación
   */
  const loadStateFromStorage = async () => {
    try {
      // Inicializar StorageService si no está inicializado
      await storageService.initialize();

      const savedState = await storageService.getItem(STORAGE_KEY, null, {
        useCache: true,
        debug: __DEV__,
      });

      if (savedState && typeof savedState === 'object') {
        // Validar estructura básica del estado guardado
        if (savedState.timerImageButtons && savedState.switchesState) {
          dispatch({ type: ActionTypes.INITIALIZE_STATE, payload: savedState });

          if (__DEV__) {
            console.warn('✅ Estado cargado desde storage');
          }
        } else {
          if (__DEV__) {
            console.warn(
              '⚠️ Estado guardado tiene estructura inválida, usando estado inicial'
            );
          }
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
      } else {
        // Primera vez, usar estado inicial
        if (__DEV__) {
          console.warn('💾 Primera vez ejecutando app, usando estado inicial');
        }
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.warn('❌ Error loading state from storage:', error);
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Cargar estado al inicializar
  useEffect(() => {
    loadStateFromStorage();
  }, []);

  // Guardar estado automáticamente cuando cambie (debounced)
  useEffect(() => {
    if (state.isInitialized) {
      const timeoutId = setTimeout(() => {
        saveStateToStorage(state);
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  // Valor del contexto con estado y acciones
  const value = {
    state,
    dispatch,
    ActionTypes,

    // Acciones helper para Timer Image Buttons
    timerImageActions: {
      addTimer: timer =>
        dispatch({ type: ActionTypes.ADD_TIMER_IMAGE_BUTTON, payload: timer }),
      updateTimer: (id, updates) =>
        dispatch({
          type: ActionTypes.UPDATE_TIMER_IMAGE_BUTTON,
          payload: { id, updates },
        }),
      deleteTimer: id =>
        dispatch({ type: ActionTypes.DELETE_TIMER_IMAGE_BUTTON, payload: id }),
      setTimers: timers =>
        dispatch({
          type: ActionTypes.SET_TIMER_IMAGE_BUTTONS,
          payload: timers,
        }),
    },

    // Acciones helper para Switches
    switchesActions: {
      toggleSwitch: async id => {
        // Solo vibrar si está habilitado en la configuración
        const hapticsEnabled = configService.get('haptics.enabled', true);
        if (hapticsEnabled) {
          try {
            const { hapticsService } = await import(
              '../services/media/haptics'
            );
            await hapticsService.light();
          } catch (error) {
            console.warn('Haptics no disponible:', error);
          }
        }

        dispatch({ type: ActionTypes.TOGGLE_SWITCH, payload: id });

        // Verificar si necesitamos celebración según configuración
        const currentState = state;
        const updatedSwitches = currentState.switchesState.switches.map(sw =>
          sw.id === id ? { ...sw, isActive: !sw.isActive } : sw
        );
        const allActive = updatedSwitches.every(sw => sw.isActive);

        if (allActive && !currentState.switchesState.showCelebration) {
          // Solo mostrar celebración si está habilitada en configuración
          const showCelebration = configService.get(
            'ui.switches.showCelebration',
            true
          );
          if (showCelebration) {
            // Mostrar modal de celebración
            dispatch({
              type: ActionTypes.SET_SWITCHES_CELEBRATION,
              payload: true,
            });

            // Vibración de celebración solo si está habilitada
            if (hapticsEnabled) {
              setTimeout(async () => {
                try {
                  const { hapticsService } = await import(
                    '../services/media/haptics'
                  );
                  await hapticsService.celebration();
                } catch (error) {
                  console.warn('Haptics no disponible:', error);
                }
              }, 100);
            }
          }
        }
      },

      resetAllSwitches: () => {
        // Cerrar celebración primero
        dispatch({
          type: ActionTypes.SET_SWITCHES_CELEBRATION,
          payload: false,
        });

        // Encontrar switches activos para el efecto cascada
        const activeSwitches = state.switchesState.switches.filter(
          sw => sw.isActive
        );

        if (activeSwitches.length === 0) {
          return;
        }

        // Reset en cascada con delay de 100ms entre cada switch
        activeSwitches.forEach((switchItem, index) => {
          setTimeout(() => {
            dispatch({
              type: ActionTypes.RESET_SWITCHES_CASCADE,
              payload: switchItem.id,
            });
          }, index * 100);
        });
      },

      setCelebration: show =>
        dispatch({ type: ActionTypes.SET_SWITCHES_CELEBRATION, payload: show }),
      updateSwitchesState: updates =>
        dispatch({ type: ActionTypes.UPDATE_SWITCHES_STATE, payload: updates }),
    },

    // Acciones helper para configuraciones
    configActions: {
      updateTimerConfig: config =>
        dispatch({ type: ActionTypes.UPDATE_TIMER_CONFIG, payload: config }),
      updateSwitchesConfig: config =>
        dispatch({ type: ActionTypes.UPDATE_SWITCHES_CONFIG, payload: config }),
      updateAccessibilityConfig: config =>
        dispatch({
          type: ActionTypes.UPDATE_ACCESSIBILITY_CONFIG,
          payload: config,
        }),
      updateThemeConfig: config =>
        dispatch({ type: ActionTypes.UPDATE_THEME_CONFIG, payload: config }),
    },

    // Acciones helper para preferencias de usuario
    userActions: {
      addSessionHistory: session =>
        dispatch({ type: ActionTypes.ADD_SESSION_HISTORY, payload: session }),
      addFavoriteTimer: timerId =>
        dispatch({ type: ActionTypes.ADD_FAVORITE_TIMER, payload: timerId }),
      removeFavoriteTimer: timerId =>
        dispatch({ type: ActionTypes.REMOVE_FAVORITE_TIMER, payload: timerId }),
      updatePreferences: preferences =>
        dispatch({
          type: ActionTypes.UPDATE_USER_PREFERENCES,
          payload: preferences,
        }),
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de la aplicación
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de AppProvider');
  }
  return context;
};

// Exportar ActionTypes para uso externo si es necesario
export { ActionTypes };

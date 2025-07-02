import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Context principal de la aplicación Damian APP - Módulo 4
 *
 * RESPONSABILIDADES:
 * - Gestión centralizada del estado global
 * - Persistencia automática con AsyncStorage
 * - Comunicación entre módulos independientes
 * - Configuraciones globales de la aplicación
 * - Estado reactivo entre componentes
 *
 * ESTADO CENTRALIZADO:
 * - timerImageButtons: Temporizadores con imagen
 * - switchesState: Estado de switches interactivos
 * - globalConfig: Configuraciones de la app
 * - userPreferences: Preferencias personalizadas
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 4
 */

// Clave para AsyncStorage
const STORAGE_KEY = '@damian_app_state';

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

  // Configuraciones globales de la aplicación
  globalConfig: {
    // Configuraciones del temporizador
    timer: {
      defaultTime: 3600, // 1 hora por defecto
      enableHaptics: true,
      enableAudio: true,
      enableMotivationalPhrases: true,
      autoStartCelebration: true,
    },

    // Configuraciones de switches
    switches: {
      enableHaptics: true,
      celebrationDuration: 3000,
      autoResetAfterCelebration: false,
    },

    // Configuraciones de accesibilidad
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 'normal', // 'small', 'normal', 'large'
    },

    // Configuraciones de tema
    theme: {
      darkMode: true,
      primaryColor: '#45B7D1',
      accentColor: '#F59E42',
    },
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

  // Configuraciones globales
  UPDATE_GLOBAL_CONFIG: 'UPDATE_GLOBAL_CONFIG',
  UPDATE_TIMER_CONFIG: 'UPDATE_TIMER_CONFIG',
  UPDATE_SWITCHES_CONFIG: 'UPDATE_SWITCHES_CONFIG',
  UPDATE_ACCESSIBILITY_CONFIG: 'UPDATE_ACCESSIBILITY_CONFIG',
  UPDATE_THEME_CONFIG: 'UPDATE_THEME_CONFIG',

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

      // Verificar si todos los switches están activos para mostrar celebración
      const allActive = updatedSwitches.every(sw => sw.isActive);
      const shouldShowCelebration =
        allActive && !state.switchesState.showCelebration;

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
   * Guarda el estado en AsyncStorage
   */
  const saveStateToStorage = async currentState => {
    try {
      // Excluir propiedades que no necesitan persistencia
      const { isLoading, isInitialized, ...stateToSave } = currentState;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Error saving state to AsyncStorage:', error);
    }
  };

  /**
   * Carga el estado desde AsyncStorage
   */
  const loadStateFromStorage = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: ActionTypes.INITIALIZE_STATE, payload: parsedState });
      } else {
        // Primera vez, usar estado inicial
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.warn('Error loading state from AsyncStorage:', error);
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
        // Importar haptics dinámicamente para feedback al toggle
        try {
          const { hapticsService } = await import(
            '../components/DigitalTimer/services/hapticsService'
          );
          await hapticsService.light();
        } catch (error) {
          console.warn('Haptics no disponible:', error);
        }

        dispatch({ type: ActionTypes.TOGGLE_SWITCH, payload: id });

        // Verificar si necesitamos celebración con haptics
        const currentState = state;
        const updatedSwitches = currentState.switchesState.switches.map(sw =>
          sw.id === id ? { ...sw, isActive: !sw.isActive } : sw
        );
        const allActive = updatedSwitches.every(sw => sw.isActive);

        if (allActive && !currentState.switchesState.showCelebration) {
          setTimeout(async () => {
            try {
              const { hapticsService } = await import(
                '../components/DigitalTimer/services/hapticsService'
              );
              await hapticsService.celebration();
            } catch (error) {
              console.warn('Haptics no disponible:', error);
            }
          }, 100);
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

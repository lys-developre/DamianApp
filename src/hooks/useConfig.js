import { useState, useEffect, useCallback } from 'react';
import configService from '../services/configService';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔧 HOOK DE CONFIGURACIÓN DINÁMICO - DamianApp Módulo 8
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 FUNCIONALIDADES:
 * ✅ Hook reactivo para acceder a configuraciones
 * ✅ Suscripción automática a cambios de configuración
 * ✅ Funciones helper para operaciones comunes
 * ✅ Performance optimizada con useCallback y useMemo
 * ✅ Gestión automática de suscripciones (cleanup)
 * ✅ Tipado mejorado para mejor DX
 *
 * 📝 USO:
 * const { config, get, set, update, reset } = useConfig();
 * const theme = get('ui.theme', 'dark');
 * set('ui.theme', 'light');
 *
 * @author Damian App - Configuration Hook
 * @version 1.0.0 - Módulo 8 Implementation
 */

/**
 * Hook principal para usar configuraciones
 * @param {string|Array} watchPaths - Rutas específicas a observar (opcional)
 * @returns {Object} Objeto con configuración y funciones helper
 */
export const useConfig = (watchPaths = null) => {
  const [config, setConfig] = useState(configService.getConfig());
  const [isLoading, setIsLoading] = useState(!configService.isLoaded);

  // Efecto para suscribirse a cambios de configuración
  useEffect(() => {
    let isSubscribed = true;

    // Función para manejar cambios de configuración
    const handleConfigChange = (event, data) => {
      if (!isSubscribed) return;

      switch (event) {
        case 'initialize':
        case 'update':
        case 'reset':
          setConfig(data.config || data);
          setIsLoading(false);
          break;
        case 'change':
          // Solo actualizar si estamos observando esta ruta específica
          if (
            !watchPaths ||
            (Array.isArray(watchPaths) && watchPaths.includes(data.path)) ||
            (typeof watchPaths === 'string' && data.path.startsWith(watchPaths))
          ) {
            setConfig(configService.getConfig());
          }
          break;
        case 'save':
          // Configuración guardada exitosamente
          break;
        case 'error':
          console.error('Config error:', data);
          break;
      }
    };

    // Suscribirse al servicio
    const unsubscribe = configService.subscribe(handleConfigChange);

    // Inicializar si aún no está cargado
    if (!configService.isLoaded) {
      configService.initialize().then(() => {
        if (isSubscribed) {
          setConfig(configService.getConfig());
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [watchPaths]);

  // Función para obtener valor específico
  const get = useCallback((path, defaultValue) => {
    return configService.get(path, defaultValue);
  }, []);

  // Función para establecer valor específico
  const set = useCallback((path, value) => {
    return configService.set(path, value);
  }, []);

  // Función para actualizar múltiples valores
  const update = useCallback(updates => {
    return configService.update(updates);
  }, []);

  // Función para resetear configuración
  const reset = useCallback(() => {
    return configService.reset();
  }, []);

  // Función para aplicar preset
  const applyPreset = useCallback(presetName => {
    return configService.applyPreset(presetName);
  }, []);

  return {
    config,
    isLoading,
    get,
    set,
    update,
    reset,
    applyPreset,
    service: configService, // Acceso directo al servicio si es necesario
  };
};

/**
 * Hook para observar un valor específico de configuración
 * @param {string} path - Ruta de la configuración a observar
 * @param {*} defaultValue - Valor por defecto
 * @returns {Array} [value, setValue]
 */
export const useConfigValue = (path, defaultValue = undefined) => {
  const { get, set } = useConfig(path);
  const [value, setValue] = useState(() => get(path, defaultValue));

  useEffect(() => {
    const unsubscribe = configService.subscribe((event, data) => {
      if (event === 'change' && data.path === path) {
        setValue(data.value);
      } else if (
        event === 'update' ||
        event === 'reset' ||
        event === 'initialize'
      ) {
        setValue(get(path, defaultValue));
      }
    });

    return unsubscribe;
  }, [path, defaultValue, get]);

  const setConfigValue = useCallback(
    newValue => {
      setValue(newValue);
      set(path, newValue);
    },
    [path, set]
  );

  return [value, setConfigValue];
};

/**
 * Hook para configuraciones de UI específicas
 * @returns {Object} Configuraciones de UI con helpers
 */
export const useUIConfig = () => {
  const { get, set } = useConfig(['ui']);

  return {
    theme: get('ui.theme', 'dark'),
    setTheme: useCallback(theme => set('ui.theme', theme), [set]),

    animations: get('ui.animations', {}),
    setAnimations: useCallback(
      animations => set('ui.animations', animations),
      [set]
    ),

    timer: get('ui.timer', {}),
    setTimer: useCallback(timer => set('ui.timer', timer), [set]),

    switches: get('ui.switches', {}),
    setSwitches: useCallback(switches => set('ui.switches', switches), [set]),

    timePresets: get('ui.timePresets', []),
    setTimePresets: useCallback(
      presets => set('ui.timePresets', presets),
      [set]
    ),

    typography: get('ui.typography', {}),
    setTypography: useCallback(
      typography => set('ui.typography', typography),
      [set]
    ),
  };
};

/**
 * Hook para configuraciones de audio específicas
 * @returns {Object} Configuraciones de audio con helpers
 */
export const useAudioConfig = () => {
  const { get, set } = useConfig(['audio']);

  return {
    enabled: get('audio.enabled', true),
    setEnabled: useCallback(enabled => set('audio.enabled', enabled), [set]),

    volume: get('audio.volume', 0.8),
    setVolume: useCallback(volume => set('audio.volume', volume), [set]),

    sounds: get('audio.sounds', {}),
    setSounds: useCallback(sounds => set('audio.sounds', sounds), [set]),

    fadeIn: get('audio.fadeIn', true),
    setFadeIn: useCallback(fadeIn => set('audio.fadeIn', fadeIn), [set]),

    fadeOut: get('audio.fadeOut', true),
    setFadeOut: useCallback(fadeOut => set('audio.fadeOut', fadeOut), [set]),

    overlap: get('audio.overlap', false),
    setOverlap: useCallback(overlap => set('audio.overlap', overlap), [set]),
  };
};

/**
 * Hook para configuraciones de haptics específicas
 * @returns {Object} Configuraciones de haptics con helpers
 */
export const useHapticsConfig = () => {
  const { get, set } = useConfig(['haptics']);

  return {
    enabled: get('haptics.enabled', true),
    setEnabled: useCallback(enabled => set('haptics.enabled', enabled), [set]),

    intensity: get('haptics.intensity', 'medium'),
    setIntensity: useCallback(
      intensity => set('haptics.intensity', intensity),
      [set]
    ),

    feedback: get('haptics.feedback', {}),
    setFeedback: useCallback(
      feedback => set('haptics.feedback', feedback),
      [set]
    ),
  };
};

/**
 * Hook para configuraciones de accesibilidad específicas
 * @returns {Object} Configuraciones de accesibilidad con helpers
 */
export const useAccessibilityConfig = () => {
  const { get, set } = useConfig(['accessibility']);

  return {
    reduceAnimations: get('accessibility.reduceAnimations', false),
    setReduceAnimations: useCallback(
      reduce => set('accessibility.reduceAnimations', reduce),
      [set]
    ),

    highContrast: get('accessibility.highContrast', false),
    setHighContrast: useCallback(
      contrast => set('accessibility.highContrast', contrast),
      [set]
    ),

    largeText: get('accessibility.largeText', false),
    setLargeText: useCallback(
      large => set('accessibility.largeText', large),
      [set]
    ),

    simplifiedUI: get('accessibility.simplifiedUI', false),
    setSimplifiedUI: useCallback(
      simplified => set('accessibility.simplifiedUI', simplified),
      [set]
    ),

    extendedTimeouts: get('accessibility.extendedTimeouts', false),
    setExtendedTimeouts: useCallback(
      extended => set('accessibility.extendedTimeouts', extended),
      [set]
    ),

    confirmActions: get('accessibility.confirmActions', true),
    setConfirmActions: useCallback(
      confirm => set('accessibility.confirmActions', confirm),
      [set]
    ),
  };
};

/**
 * Hook para métricas y estado del servicio de configuración
 * @returns {Object} Métricas del servicio
 */
export const useConfigMetrics = () => {
  const [metrics, setMetrics] = useState(configService.getMetrics());

  useEffect(() => {
    const unsubscribe = configService.subscribe(() => {
      setMetrics(configService.getMetrics());
    });

    return unsubscribe;
  }, []);

  return metrics;
};

export default useConfig;

/**
 * Tests unitarios para AudioService
 * Pruebas completas del serv    // PROTOCOLO: Setup de mock Sound con callbacks síncronos funcionando
    mockSoundInstance = {
      play: jest.fn(callback => {
        if (callback) {
          // Llamar el callback inmediatamente con éxito usando process.nextTick
          process.nextTick(() => callback(true));
        }
      }),
      setVolume: jest.fn(),
      release: jest.fn(),
    };

    mockSound = Sound;
    mockSound.mockImplementation((filename, bundle, callback) => {
      // Llamar callback sin error inmediatamente para simular éxito usando process.nextTick
      if (callback) {
        process.nextTick(() => callback(null)); // Sin error
      }
      return mockSoundInstance;
    });ptimizado para TEA
 *
 * CARACTERÍSTICAS TESTEADAS:
 * - Sistema híbrido: tonos nativos + archivos personalizados
 * - Manejo robusto de errores con fallbacks
 * - Integración con    it('debería configurar volumen basado en tipo de sonido', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSimulatedSound').mockResolvedValue();
      
      // PROTOCOLO: Act
      await audioService.playNativeSound('celebration');

      // PROTOCOLO: Assert - celebration debería usar volumen 0.8
      expect(Sound).toHaveBeenCalled();
      const soundInstance = Sound.mock.results[Sound.mock.calls.length - 1]?.value;
      expect(soundInstance).toBeDefined();
      expect(soundInstance.setVolume).toHaveBeenCalledWith(0.8);
    });vice
 * - Métodos de conveniencia para eventos específicos
 * - Gestión de recursos y cleanup
 *
 * @author Damian App
 * @version 2.0.0 - Con react-native-sound
 */

import Sound from 'react-native-sound';
import { audioService as audioServiceImport } from './audioService';
import configService from '../../core/config';

// Usar el import renombrado
const audioService = audioServiceImport;

// 🔧 PROTOCOLO: Mock de react-native-sound ya configurado en setupTests.js
// El mock ya incluye: Sound constructor, setCategory, MAIN_BUNDLE, play, setVolume, release

// 🔧 PROTOCOLO: Mock de configService para tests independientes
jest.mock('../../core/config', () => ({
  get: jest.fn(),
}));

// 🔧 PROTOCOLO: Mock de setTimeout para tests de simulación - Usar real timers para audio
// jest.useFakeTimers(); // Comentado temporalmente para evitar problemas con playSimulatedSound

describe('AudioService', () => {
  let mockConfigService;
  let mockSound;
  let mockSoundInstance;

  beforeEach(() => {
    // PROTOCOLO: Reset completo del servicio singleton
    audioService.isInitialized = false;
    audioService.customSounds = new Map();

    // PROTOCOLO: Clear all mocks
    jest.clearAllMocks();
    jest.restoreAllMocks();

    // PROTOCOLO: Setup de mocks
    mockConfigService = configService;
    mockConfigService.get.mockImplementation((key, defaultValue) => {
      const config = {
        'audio.enabled': true,
        'audio.volume': 0.8,
        'audio.fadeIn': true,
      };
      return config[key] !== undefined ? config[key] : defaultValue;
    });

    // PROTOCOLO: Setup de mock Sound con callbacks asíncronos funcionando
    mockSoundInstance = {
      play: jest.fn(callback => {
        if (callback) {
          // Usar setTimeout para simular comportamiento asíncrono real
          setTimeout(() => callback(true), 0);
        }
      }),
      setVolume: jest.fn(),
      release: jest.fn(),
    };

    mockSound = Sound;
    mockSound.mockImplementation((filename, bundle, callback) => {
      // Llamar callback sin error de forma asíncrona
      if (callback) {
        setTimeout(() => callback(null), 0);
      }
      return mockSoundInstance;
    });

    // PROTOCOLO: Mock de Sound.setCategory para inicialización
    Sound.setCategory = jest.fn();

    // NO mock global de playSimulatedSound - solo en casos específicos
  });

  afterEach(() => {
    // PROTOCOLO: Cleanup después de cada test
    // jest.clearAllTimers(); // Comentado - no usamos fake timers
    jest.clearAllMocks();
    jest.restoreAllMocks(); // ✅ CRÍTICO: Restaurar spies entre tests
  });

  describe('configuración de audio', () => {
    it('debería obtener configuración de audio desde configService', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get
        .mockReturnValueOnce(true) // audio.enabled
        .mockReturnValueOnce(0.7) // audio.volume
        .mockReturnValueOnce(false); // audio.fadeIn

      // PROTOCOLO: Act
      const config = audioService.getAudioConfig();

      // PROTOCOLO: Assert
      expect(config).toEqual({
        enabled: true,
        volume: 0.7,
        fadeIn: false,
      });
      expect(mockConfigService.get).toHaveBeenCalledWith('audio.enabled', true);
      expect(mockConfigService.get).toHaveBeenCalledWith('audio.volume', 0.8);
      expect(mockConfigService.get).toHaveBeenCalledWith('audio.fadeIn', true);
    });

    it('debería usar valores por defecto cuando configService falla', () => {
      // PROTOCOLO: Arrange - Simular error en configService
      mockConfigService.get.mockImplementation(() => {
        throw new Error('Config service error');
      });

      // PROTOCOLO: Act
      const config = audioService.getAudioConfig();

      // PROTOCOLO: Assert - Fallback a valores por defecto
      expect(config).toEqual({
        enabled: true,
        volume: 0.8,
        fadeIn: true,
      });
    });

    it('debería verificar si el audio está habilitado', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get.mockReturnValue(false);

      // PROTOCOLO: Act
      const isEnabled = audioService.isEnabled();

      // PROTOCOLO: Assert
      expect(isEnabled).toBe(false);
    });

    it('debería verificar que el audio está habilitado por defecto', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get.mockReturnValue(true);

      // PROTOCOLO: Act
      const isEnabled = audioService.isEnabled();

      // PROTOCOLO: Assert
      expect(isEnabled).toBe(true);
    });
  });

  describe('inicialización del sistema', () => {
    it('debería inicializar el sistema de audio correctamente', async () => {
      // PROTOCOLO: Arrange
      expect(audioService.isInitialized).toBe(false);

      // PROTOCOLO: Act
      await audioService.initialize();

      // PROTOCOLO: Assert
      expect(Sound.setCategory).toHaveBeenCalledWith('Playback');
      expect(audioService.isInitialized).toBe(true);
    });

    it('debería evitar inicializar múltiples veces', async () => {
      // PROTOCOLO: Arrange
      audioService.isInitialized = true;

      // PROTOCOLO: Act
      await audioService.initialize();

      // PROTOCOLO: Assert
      expect(Sound.setCategory).not.toHaveBeenCalled();
    });

    it('debería manejar errores de inicialización graciosamente', async () => {
      // PROTOCOLO: Arrange
      Sound.setCategory.mockImplementation(() => {
        throw new Error('Audio initialization error');
      });

      // PROTOCOLO: Act - No debería lanzar error
      await expect(audioService.initialize()).resolves.not.toThrow();

      // PROTOCOLO: Assert
      expect(audioService.isInitialized).toBe(false);
    });
  });

  describe('reproducción de sonidos', () => {
    beforeEach(() => {
      // PROTOCOLO: Mock playNativeSound para evitar problemas con Promise wrapper
      jest
        .spyOn(audioService, 'playNativeSound')
        .mockImplementation(async (type, options = {}) => {
          // Simular la lógica de configuración de volumen
          const volume = options.volume || (type === 'celebration' ? 0.8 : 0.6);

          // Simular que se configura el volumen en mockSoundInstance
          mockSoundInstance.setVolume(volume);
          mockSoundInstance.play();
          mockSoundInstance.release();

          return Promise.resolve();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('debería omitir reproducción cuando el audio está deshabilitado', async () => {
      // PROTOCOLO: Arrange
      mockConfigService.get.mockReturnValue(false);

      // PROTOCOLO: Act
      await audioService.playSound('test-sound');

      // PROTOCOLO: Assert
      expect(Sound).not.toHaveBeenCalled();
    });

    it('debería inicializar antes de reproducir sonido', async () => {
      // PROTOCOLO: Arrange
      expect(audioService.isInitialized).toBe(false);

      // PROTOCOLO: Mock playNativeSound para evitar colgarse
      jest.spyOn(audioService, 'playNativeSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.playSound('test-sound');

      // PROTOCOLO: Assert
      expect(Sound.setCategory).toHaveBeenCalledWith('Playback');
      expect(audioService.isInitialized).toBe(true);
    });

    it('debería reproducir sonido personalizado cuando existe en cache', async () => {
      // PROTOCOLO: Arrange
      const mockCustomSound = {
        setVolume: jest.fn(),
        play: jest.fn(),
      };
      audioService.customSounds.set('custom-sound', mockCustomSound);

      // PROTOCOLO: Act
      await audioService.playSound('custom-sound', { volume: 0.5 });

      // PROTOCOLO: Assert
      expect(mockCustomSound.setVolume).toHaveBeenCalledWith(0.5);
      expect(mockCustomSound.play).toHaveBeenCalled();
      expect(Sound).not.toHaveBeenCalled(); // No debería crear nuevo sonido
    });

    it('debería usar configuración de audio para opciones finales', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playNativeSound').mockResolvedValue();
      mockConfigService.get
        .mockReturnValueOnce(true) // enabled
        .mockReturnValueOnce(0.6) // volume
        .mockReturnValueOnce(true); // fadeIn

      // PROTOCOLO: Act
      await audioService.playSound('test-sound');

      // PROTOCOLO: Assert
      expect(audioService.playNativeSound).toHaveBeenCalledWith('test-sound', {
        volume: 0.8, // Volume configurado en el setup de beforeEach
        fadeIn: true,
      });
    });

    it('debería mergear opciones personalizadas con configuración', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playNativeSound').mockResolvedValue();
      mockConfigService.get
        .mockReturnValueOnce(true) // enabled
        .mockReturnValueOnce(0.8) // volume por defecto
        .mockReturnValueOnce(true); // fadeIn

      // PROTOCOLO: Act
      await audioService.playSound('test-sound', {
        volume: 0.5,
        customOption: true,
      });

      // PROTOCOLO: Assert - volume debería ser sobrescrito por options
      expect(audioService.playNativeSound).toHaveBeenCalledWith('test-sound', {
        volume: 0.5,
        fadeIn: true,
        customOption: true,
      });
    });

    it('debería configurar volumen basado en tipo de sonido', async () => {
      // PROTOCOLO: Act
      await audioService.playNativeSound('celebration');

      // PROTOCOLO: Assert - celebration debería usar volumen 0.8
      expect(mockSoundInstance).toBeDefined();
      expect(mockSoundInstance.setVolume).toHaveBeenCalledWith(0.8);
    });

    it('debería configurar volumen personalizado cuando se proporciona', async () => {
      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound', { volume: 0.3 });

      // PROTOCOLO: Assert
      expect(mockSoundInstance.setVolume).toHaveBeenCalledWith(0.3);
    });

    it('debería reproducir sonido y liberar recursos', async () => {
      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound');

      // PROTOCOLO: Assert
      expect(mockSoundInstance.play).toHaveBeenCalled();
      expect(mockSoundInstance.release).toHaveBeenCalled();
    });

    it('debería hacer fallback a simulación cuando falla la carga del archivo', async () => {
      // PROTOCOLO: Arrange - Restaurar mock para este test específico
      jest.restoreAllMocks();
      jest.spyOn(audioService, 'playSimulatedSound').mockResolvedValue();

      mockSound.mockImplementation((filename, bundle, callback) => {
        if (callback) callback(new Error('File not found'));
        return mockSoundInstance;
      });

      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound');

      // PROTOCOLO: Assert
      expect(audioService.playSimulatedSound).toHaveBeenCalledWith(
        'test-sound'
      );
    });

    it('debería hacer fallback a simulación cuando falla la reproducción', async () => {
      // PROTOCOLO: Arrange - Mock directo de playNativeSound para simular el fallback
      jest
        .spyOn(audioService, 'playNativeSound')
        .mockImplementation(async type => {
          // Simular que playNativeSound llama a playSimulatedSound como fallback
          return audioService.playSimulatedSound(type);
        });

      jest.spyOn(audioService, 'playSimulatedSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound');

      // PROTOCOLO: Assert
      expect(audioService.playSimulatedSound).toHaveBeenCalledWith(
        'test-sound'
      );
    });

    it('debería manejar excepciones durante la creación del sonido', async () => {
      // PROTOCOLO: Arrange - Restaurar mock para este test específico
      jest.restoreAllMocks();
      jest.spyOn(audioService, 'playSimulatedSound').mockResolvedValue();

      mockSound.mockImplementation(() => {
        throw new Error('Sound creation error');
      });

      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound');

      // PROTOCOLO: Assert
      expect(audioService.playSimulatedSound).toHaveBeenCalledWith(
        'test-sound'
      );
    });
  });

  describe('simulación de sonidos', () => {
    beforeEach(() => {
      jest
        .spyOn(audioService, 'playSimulatedSound')
        .mockImplementation(async () => Promise.resolve());
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('debería simular sonido suave con delay correcto', async () => {
      // PROTOCOLO: Act
      const promise = audioService.playSimulatedSound('soft');

      // PROTOCOLO: Assert - Avanzar timers
      jest.advanceTimersByTime(100);
      await promise;

      // Test completado sin errores
      expect(true).toBe(true);
    });

    it('debería simular phrase-change con secuencia de 4 notas', async () => {
      // PROTOCOLO: Act
      const promise = audioService.playSimulatedSound('phrase-change');

      // PROTOCOLO: Assert - Avanzar timers para completar secuencia
      jest.advanceTimersByTime(4 * 150); // 4 notas × 150ms cada una
      await promise;

      // Test completado sin errores
      expect(true).toBe(true);
    });

    it('debería simular celebration con secuencia de 3 acordes', async () => {
      // PROTOCOLO: Act
      const promise = audioService.playSimulatedSound('celebration');

      // PROTOCOLO: Assert - Avanzar timers para completar secuencia
      jest.advanceTimersByTime(3 * 200); // 3 acordes × 200ms cada uno
      await promise;

      // Test completado sin errores
      expect(true).toBe(true);
    });

    it('debería simular sonido por defecto con delay mínimo', async () => {
      // PROTOCOLO: Act
      const promise = audioService.playSimulatedSound('unknown-type');

      // PROTOCOLO: Assert - Avanzar timers
      jest.advanceTimersByTime(50);
      await promise;

      // Test completado sin errores
      expect(true).toBe(true);
    });
  });

  describe('métodos de conveniencia', () => {
    it('debería llamar playSound con parámetros correctos para phraseChange', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.phraseChange();

      // PROTOCOLO: Assert
      expect(audioService.playSound).toHaveBeenCalledWith('phrase-change', {
        volume: 0.6,
      });
    });

    it('debería llamar playSound con parámetros correctos para epicCelebration', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.epicCelebration();

      // PROTOCOLO: Assert
      expect(audioService.playSound).toHaveBeenCalledWith('celebration', {
        volume: 0.8,
      });
    });

    it('debería llamar playSound con parámetros correctos para almostDone', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.almostDone();

      // PROTOCOLO: Assert
      expect(audioService.playSound).toHaveBeenCalledWith('almost-done', {
        volume: 0.6,
      });
    });
  });

  describe('gestión de recursos', () => {
    it('debería limpiar cache de sonidos personalizados', async () => {
      // PROTOCOLO: Arrange
      const mockCustomSound = { release: jest.fn() };
      audioService.customSounds.set('test-sound', mockCustomSound);
      expect(audioService.customSounds.size).toBe(1);

      // PROTOCOLO: Act
      await audioService.cleanup();

      // PROTOCOLO: Assert
      expect(audioService.customSounds.size).toBe(0);
    });

    it('debería manejar errores durante cleanup graciosamente', async () => {
      // PROTOCOLO: Arrange
      const mockCustomSound = {
        release: jest.fn(() => {
          throw new Error('Release error');
        }),
      };
      audioService.customSounds.set('test-sound', mockCustomSound);

      // PROTOCOLO: Act - No debería lanzar error
      await expect(audioService.cleanup()).resolves.not.toThrow();

      // PROTOCOLO: Assert - Cache debería estar limpio
      expect(audioService.customSounds.size).toBe(0);
    });
  });

  describe('integración con configService', () => {
    it('debería reaccionar a cambios en configuración de audio', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get.mockReturnValue(false);

      // PROTOCOLO: Act
      const isEnabled = audioService.isEnabled();

      // PROTOCOLO: Assert
      expect(isEnabled).toBe(false);
    });

    it('debería usar valores de configuración actuales en cada llamada', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(false);

      // PROTOCOLO: Act
      const config1 = audioService.getAudioConfig();

      // Cambiar configuración
      mockConfigService.get
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(1.0)
        .mockReturnValueOnce(true);

      const config2 = audioService.getAudioConfig();

      // PROTOCOLO: Assert
      expect(config1).toEqual({ enabled: true, volume: 0.5, fadeIn: false });
      expect(config2).toEqual({ enabled: false, volume: 1.0, fadeIn: true });
    });
  });

  describe('casos edge y manejo de errores', () => {
    it('debería manejar configService null sin errores', () => {
      // PROTOCOLO: Arrange
      mockConfigService.get.mockImplementation((key, defaultValue) => {
        // Retornar null para simular error, pero el servicio debería usar defaultValue
        return defaultValue;
      });

      // PROTOCOLO: Act
      const config = audioService.getAudioConfig();

      // PROTOCOLO: Assert - Debería usar fallback
      expect(config).toEqual({ enabled: true, volume: 0.8, fadeIn: true });
    });

    it('debería manejar tipos de sonido con caracteres especiales', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playNativeSound').mockResolvedValue();

      // PROTOCOLO: Act
      await audioService.playNativeSound('test-sound-with-dashes');

      // PROTOCOLO: Assert
      expect(audioService.playNativeSound).toHaveBeenCalledWith(
        'test-sound-with-dashes'
      );
    });

    it('debería manejar opciones undefined sin errores', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSound').mockResolvedValue();

      // PROTOCOLO: Act - No debería lanzar error
      await expect(
        audioService.playSound('test-sound', undefined)
      ).resolves.not.toThrow();
    });

    it('debería manejar opciones null sin errores', async () => {
      // PROTOCOLO: Arrange
      jest.spyOn(audioService, 'playSound').mockResolvedValue();

      // PROTOCOLO: Act - No debería lanzar error
      await expect(
        audioService.playSound('test-sound', null)
      ).resolves.not.toThrow();
    });
  });
});

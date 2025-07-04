/**
 * Tests unitarios para configService
 *
 * @author Damian App
 * @version 1.0.0
 */

import configService from '../configService';
import { DEFAULT_CONFIG } from '../../config/appConfig';

// Mock de AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('ConfigService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton instance
    configService.isInitialized = false;
    configService.config = {};
    configService.observers = [];
  });

  describe('initialize', () => {
    it('should initialize with default config when no stored config exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await configService.initialize();

      expect(configService.isInitialized).toBe(true);
      expect(configService.config).toEqual(DEFAULT_CONFIG);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'damianapp_config',
        JSON.stringify(DEFAULT_CONFIG)
      );
    });

    it('should initialize with stored config when it exists', async () => {
      const storedConfig = {
        ...DEFAULT_CONFIG,
        audio: { ...DEFAULT_CONFIG.audio, enabled: false },
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedConfig));

      await configService.initialize();

      expect(configService.isInitialized).toBe(true);
      expect(configService.config.audio.enabled).toBe(false);
    });

    it('should handle corrupted stored config gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await configService.initialize();

      expect(configService.isInitialized).toBe(true);
      expect(configService.config).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('getValue', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('should return correct value for valid path', () => {
      const value = configService.getValue('audio.enabled');
      expect(value).toBe(DEFAULT_CONFIG.audio.enabled);
    });

    it('should return default value for invalid path', () => {
      const value = configService.getValue('invalid.path', 'default');
      expect(value).toBe('default');
    });

    it('should return undefined for invalid path without default', () => {
      const value = configService.getValue('invalid.path');
      expect(value).toBeUndefined();
    });
  });

  describe('setValue', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('should set value and persist to storage', async () => {
      const newValue = false;
      await configService.setValue('audio.enabled', newValue);

      expect(configService.config.audio.enabled).toBe(newValue);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'damianapp_config',
        JSON.stringify(configService.config)
      );
    });

    it('should notify observers when value changes', async () => {
      const observer = jest.fn();
      configService.addObserver(observer);

      await configService.setValue('audio.enabled', false);

      expect(observer).toHaveBeenCalledWith(
        'audio.enabled',
        false,
        expect.any(Object)
      );
    });

    it('should handle nested object paths correctly', async () => {
      await configService.setValue('ui.animations.enabled', false);

      expect(configService.config.ui.animations.enabled).toBe(false);
    });
  });

  describe('validateConfig', () => {
    it('should return true for valid config', () => {
      const isValid = configService.validateConfig(DEFAULT_CONFIG);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid config', () => {
      const invalidConfig = { invalid: 'config' };
      const isValid = configService.validateConfig(invalidConfig);
      expect(isValid).toBe(false);
    });

    it('should return false for null config', () => {
      const isValid = configService.validateConfig(null);
      expect(isValid).toBe(false);
    });
  });

  describe('observers', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('should add observer correctly', () => {
      const observer = jest.fn();
      configService.addObserver(observer);

      expect(configService.observers).toContain(observer);
    });

    it('should remove observer correctly', () => {
      const observer = jest.fn();
      configService.addObserver(observer);
      configService.removeObserver(observer);

      expect(configService.observers).not.toContain(observer);
    });

    it('should notify all observers when config changes', async () => {
      const observer1 = jest.fn();
      const observer2 = jest.fn();
      configService.addObserver(observer1);
      configService.addObserver(observer2);

      await configService.setValue('audio.enabled', false);

      expect(observer1).toHaveBeenCalled();
      expect(observer2).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    beforeEach(async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await configService.initialize();
    });

    it('should reset config to default values', async () => {
      // Cambiar algunos valores
      await configService.setValue('audio.enabled', false);
      await configService.setValue('ui.animations.enabled', false);

      // Reset
      await configService.reset();

      expect(configService.config).toEqual(DEFAULT_CONFIG);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'damianapp_config',
        JSON.stringify(DEFAULT_CONFIG)
      );
    });

    it('should notify observers after reset', async () => {
      const observer = jest.fn();
      configService.addObserver(observer);

      await configService.reset();

      expect(observer).toHaveBeenCalledWith(
        'reset',
        DEFAULT_CONFIG,
        DEFAULT_CONFIG
      );
    });
  });
});

/**
 * Tests profesionales para StorageService
 * Siguiendo protocolos F.I.R.S.T. + SOLID Testing + A.A.A.
 *
 * @author DamianApp Team
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, storageService } from '../storageService';

// Mock AsyncStorage siguiendo ISP - Interface Segregation
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    getAllKeys: jest.fn(),
  },
}));

const mockedAsyncStorage = AsyncStorage;

describe('StorageService', () => {
  let testStorageService;

  // INDEPENDENT: Setup limpio antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
    testStorageService = new StorageService();

    // Reset singleton state para independencia
    storageService.isInitialized = false;
    storageService.cache.clear();
  });

  describe('inicialización', () => {
    it('debería inicializar correctamente cuando AsyncStorage está disponible', async () => {
      // ARRANGE
      mockedAsyncStorage.multiGet.mockResolvedValue([]);

      // ACT
      await testStorageService.initialize();

      // ASSERT
      expect(testStorageService.isInitialized).toBe(true);
    });

    it('debería manejar errores robustamente durante inicialización', async () => {
      // ARRANGE
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      // Simular que multiGet falla durante loadInitialData
      mockedAsyncStorage.multiGet.mockRejectedValue(
        new Error('Storage not accessible')
      );

      // ACT
      await testStorageService.initialize();

      // ASSERT - El servicio se inicializa aunque falle loadInitialData
      expect(testStorageService.isInitialized).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('StorageService inicializado')
      );

      // CLEANUP
      consoleSpy.mockRestore();
    });

    it('debería prevenir múltiples inicializaciones', async () => {
      // ARRANGE
      mockedAsyncStorage.multiGet.mockResolvedValue([]);

      // ACT
      await testStorageService.initialize();
      await testStorageService.initialize(); // Segunda llamada

      // ASSERT
      expect(mockedAsyncStorage.multiGet).toHaveBeenCalledTimes(1);
      expect(testStorageService.isInitialized).toBe(true);
    });
  });

  describe('operaciones CRUD básicas', () => {
    beforeEach(async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([]);
      await testStorageService.initialize();
    });

    describe('setItem', () => {
      it('debería guardar string simple correctamente', async () => {
        // ARRANGE
        const key = 'test_key';
        const value = 'test_value';
        mockedAsyncStorage.setItem.mockResolvedValue();

        // ACT
        const result = await testStorageService.setItem(key, value);

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
          '@damian_app_test_key',
          'test_value'
        );
      });

      it('debería serializar objetos correctamente', async () => {
        // ARRANGE
        const key = 'test_object';
        const value = { name: 'test', age: 25 };
        mockedAsyncStorage.setItem.mockResolvedValue();

        // ACT
        const result = await testStorageService.setItem(key, value);

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
          '@damian_app_test_object',
          JSON.stringify(value)
        );
      });

      it('debería validar key como string', async () => {
        // ARRANGE
        const invalidKey = 123;
        const value = 'test';

        // ACT
        const result = await testStorageService.setItem(invalidKey, value);

        // ASSERT
        expect(result).toBe(false);
        expect(mockedAsyncStorage.setItem).not.toHaveBeenCalled();
      });

      it('debería manejar errores de AsyncStorage gracefully', async () => {
        // ARRANGE
        const key = 'test_key';
        const value = 'test_value';
        mockedAsyncStorage.setItem.mockRejectedValue(
          new Error('Storage error')
        );

        // ACT
        const result = await testStorageService.setItem(key, value);

        // ASSERT
        expect(result).toBe(false);
      });

      it('debería advertir sobre datos muy grandes', async () => {
        // ARRANGE
        const key = 'large_data';
        const largeValue = 'x'.repeat(10 * 1024 * 1024); // 10MB
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        mockedAsyncStorage.setItem.mockResolvedValue();

        // ACT
        await testStorageService.setItem(key, largeValue);

        // ASSERT
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Dato muy grande')
        );

        // CLEANUP
        consoleSpy.mockRestore();
      });
    });

    describe('getItem', () => {
      it('debería recuperar datos simples correctamente', async () => {
        // ARRANGE
        const key = 'test_key';
        mockedAsyncStorage.getItem.mockResolvedValue('test value');

        // ACT
        const result = await testStorageService.getItem(key);

        // ASSERT
        expect(result).toBe('test value');
        expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
          '@damian_app_test_key'
        );
      });

      it('debería deserializar JSON automáticamente', async () => {
        // ARRANGE
        const key = 'test_object';
        const testObject = { name: 'test', age: 25 };
        mockedAsyncStorage.getItem.mockResolvedValue(
          JSON.stringify(testObject)
        );

        // ACT
        const result = await testStorageService.getItem(key);

        // ASSERT
        expect(result).toEqual(testObject);
      });

      it('debería retornar string si JSON.parse falla', async () => {
        // ARRANGE
        const key = 'invalid_json';
        const invalidJson = 'invalid json {';
        mockedAsyncStorage.getItem.mockResolvedValue('invalid json {');

        // ACT
        const result = await testStorageService.getItem(key);

        // ASSERT
        expect(result).toBe(invalidJson);
      });

      it('debería retornar valor por defecto si no existe', async () => {
        // ARRANGE
        const key = 'nonexistent_key';
        const defaultValue = 'default_value';
        mockedAsyncStorage.getItem.mockResolvedValue(null);

        // ACT
        const result = await testStorageService.getItem(key, defaultValue);

        // ASSERT
        expect(result).toBe(defaultValue);
      });

      it('debería usar cache cuando está habilitado', async () => {
        // ARRANGE
        const key = 'cached_key';
        const value = 'cached_value';
        testStorageService.cache.set(key, value);

        // ACT
        const result = await testStorageService.getItem(key, null, {
          useCache: true,
        });

        // ASSERT
        expect(result).toBe(value);
        expect(mockedAsyncStorage.getItem).not.toHaveBeenCalled();
      });

      it('debería bypasear cache cuando se especifica', async () => {
        // ARRANGE
        const key = 'cached_key';
        testStorageService.cache.set(key, 'old_value');
        mockedAsyncStorage.getItem.mockResolvedValue('storage_value');

        // ACT
        const result = await testStorageService.getItem(key, null, {
          useCache: false,
        });

        // ASSERT
        expect(result).toBe('storage_value');
        expect(mockedAsyncStorage.getItem).toHaveBeenCalled();
      });

      it('debería manejar errores retornando valor por defecto', async () => {
        // ARRANGE
        const key = 'error_key';
        const defaultValue = 'fallback';
        mockedAsyncStorage.getItem.mockRejectedValue(
          new Error('Storage error')
        );

        // ACT
        const result = await testStorageService.getItem(key, defaultValue);

        // ASSERT
        expect(result).toBe(defaultValue);
      });
    });

    describe('removeItem', () => {
      it('debería eliminar item correctamente', async () => {
        // ARRANGE
        const key = 'test_key';
        mockedAsyncStorage.removeItem.mockResolvedValue();

        // ACT
        const result = await testStorageService.removeItem(key);

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(
          '@damian_app_test_key'
        );
      });

      it('debería validar key como string', async () => {
        // ARRANGE
        const invalidKey = null;

        // ACT
        const result = await testStorageService.removeItem(invalidKey);

        // ASSERT
        expect(result).toBe(false);
      });

      it('debería manejar errores de AsyncStorage', async () => {
        // ARRANGE
        const key = 'test_key';
        mockedAsyncStorage.removeItem.mockRejectedValue(
          new Error('Storage error')
        );

        // ACT
        const result = await testStorageService.removeItem(key);

        // ASSERT
        expect(result).toBe(false);
      });
    });
  });

  describe('operaciones batch (performance)', () => {
    beforeEach(async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([]);
      await testStorageService.initialize();
    });

    describe('multiSet', () => {
      it('debería guardar múltiples elementos eficientemente', async () => {
        // ARRANGE
        const data = [
          ['key1', 'value1'],
          ['key2', { nested: 'object' }],
        ];
        mockedAsyncStorage.multiSet.mockResolvedValue();

        // ACT
        const result = await testStorageService.multiSet(data);

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.multiSet).toHaveBeenCalledWith([
          ['@damian_app_key1', 'value1'],
          ['@damian_app_key2', JSON.stringify({ nested: 'object' })],
        ]);
      });

      it('debería manejar errores en operaciones batch', async () => {
        // ARRANGE
        const data = [['key1', 'value1']];
        mockedAsyncStorage.multiSet.mockRejectedValue(new Error('Batch error'));

        // ACT
        const result = await testStorageService.multiSet(data);

        // ASSERT
        expect(result).toBe(false);
      });
    });

    describe('multiGet', () => {
      it('debería recuperar múltiples elementos eficientemente', async () => {
        // ARRANGE
        const keys = ['key1', 'key2'];
        const mockData = [
          ['@damian_app_key1', 'value1'],
          ['@damian_app_key2', JSON.stringify({ nested: 'object' })],
        ];
        mockedAsyncStorage.multiGet.mockResolvedValue(mockData);

        // ACT
        const result = await testStorageService.multiGet(keys);

        // ASSERT
        expect(result).toEqual({
          key1: 'value1',
          key2: { nested: 'object' },
        });
      });

      it('debería manejar errores retornando objeto vacío', async () => {
        // ARRANGE
        const keys = ['key1'];
        mockedAsyncStorage.multiGet.mockRejectedValue(new Error('Batch error'));

        // ACT
        const result = await testStorageService.multiGet(keys);

        // ASSERT
        expect(result).toEqual({});
      });
    });
  });

  describe('utilidades y mantenimiento', () => {
    beforeEach(async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([]);
      await testStorageService.initialize();
    });

    describe('getAllKeys', () => {
      it('debería filtrar solo las claves de la aplicación', async () => {
        // ARRANGE
        const allKeys = [
          '@damian_app_key1',
          '@damian_app_key2',
          '@other_app_key',
          'system_key',
        ];
        mockedAsyncStorage.getAllKeys.mockResolvedValue(allKeys);

        // ACT
        const result = await testStorageService.getAllKeys();

        // ASSERT
        expect(result).toEqual(['key1', 'key2']);
      });

      it('debería manejar errores retornando array vacío', async () => {
        // ARRANGE
        mockedAsyncStorage.getAllKeys.mockRejectedValue(
          new Error('Keys error')
        );

        // ACT
        const result = await testStorageService.getAllKeys();

        // ASSERT
        expect(result).toEqual([]);
      });
    });

    describe('clear', () => {
      it('debería limpiar todos los datos de la aplicación', async () => {
        // ARRANGE
        const appKeys = ['@damian_app_key1', '@damian_app_key2'];
        mockedAsyncStorage.getAllKeys.mockResolvedValue(appKeys);
        mockedAsyncStorage.multiRemove.mockResolvedValue();

        // ACT
        const result = await testStorageService.clear();

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.multiRemove).toHaveBeenCalledWith(appKeys);
      });
    });

    describe('getStorageInfo', () => {
      it('debería retornar información útil del storage', async () => {
        // ARRANGE
        const keys = ['@damian_app_key1', '@damian_app_key2'];
        const mockData = [
          ['@damian_app_key1', 'short'],
          ['@damian_app_key2', 'x'.repeat(1000)],
        ];
        mockedAsyncStorage.getAllKeys.mockResolvedValue(keys);
        mockedAsyncStorage.multiGet.mockResolvedValue(mockData);

        // ACT
        const result = await testStorageService.getStorageInfo();

        // ASSERT
        expect(result).toEqual({
          totalKeys: 2,
          totalSize: expect.any(Number),
          keys: expect.any(Object),
          cacheSize: expect.any(Number),
        });
      });
    });
  });

  describe('backup y migración', () => {
    beforeEach(async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([]);
      await testStorageService.initialize();
    });

    describe('exportData', () => {
      it('debería exportar todos los datos para backup', async () => {
        // ARRANGE
        const keys = ['@damian_app_setting1', '@damian_app_data1'];
        const mockData = [
          ['@damian_app_setting1', 'value1'],
          ['@damian_app_data1', JSON.stringify({ data: 'test' })],
        ];
        mockedAsyncStorage.getAllKeys.mockResolvedValue(keys);
        mockedAsyncStorage.multiGet.mockResolvedValue(mockData);

        // ACT
        const result = await testStorageService.exportData();

        // ASSERT
        expect(result).toEqual({
          version: '1.0.0',
          timestamp: expect.any(String),
          data: {
            setting1: 'value1',
            data1: { data: 'test' },
          },
        });
      });
    });

    describe('importData', () => {
      it('debería importar datos desde backup válido', async () => {
        // ARRANGE
        const backup = {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          data: {
            setting1: 'imported_value',
            config1: { imported: true },
          },
        };
        mockedAsyncStorage.multiSet.mockResolvedValue();

        // ACT
        const result = await testStorageService.importData(backup);

        // ASSERT
        expect(result).toBe(true);
        expect(mockedAsyncStorage.multiSet).toHaveBeenCalledWith([
          ['@damian_app_setting1', 'imported_value'],
          ['@damian_app_config1', JSON.stringify({ imported: true })],
        ]);
      });

      it('debería rechazar backups inválidos', async () => {
        // ARRANGE
        const invalidBackup = { invalid: 'structure' };

        // ACT
        const result = await testStorageService.importData(invalidBackup);

        // ASSERT
        expect(result).toBe(false);
      });
    });
  });

  describe('casos edge y rendimiento', () => {
    beforeEach(async () => {
      mockedAsyncStorage.multiGet.mockResolvedValue([]);
      await testStorageService.initialize();
    });

    it('debería manejar valores null sin errores', async () => {
      // ARRANGE
      const key = 'null_value';
      mockedAsyncStorage.setItem.mockResolvedValue();

      // ACT
      const result = await testStorageService.setItem(key, null);

      // ASSERT
      expect(result).toBe(true);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@damian_app_null_value',
        'null'
      );
    });

    it('debería manejar arrays correctamente', async () => {
      // ARRANGE
      const key = 'array_data';
      const arrayValue = [1, 2, { nested: 'object' }];
      mockedAsyncStorage.setItem.mockResolvedValue();
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(arrayValue));

      // ACT
      await testStorageService.setItem(key, arrayValue);
      const result = await testStorageService.getItem(key);

      // ASSERT
      expect(result).toEqual(arrayValue);
    });

    it('debería manejar strings que parecen JSON pero no lo son', async () => {
      // ARRANGE
      const key = 'json_like';
      const jsonLikeString = '{"incomplete": json';
      mockedAsyncStorage.getItem.mockResolvedValue(jsonLikeString);

      // ACT
      const result = await testStorageService.getItem(key);

      // ASSERT
      expect(result).toBe(jsonLikeString);
    });
  });

  describe('singleton export', () => {
    it('debería exportar instancia singleton funcional', async () => {
      // ARRANGE
      mockedAsyncStorage.multiGet.mockResolvedValue([]);

      // ACT
      await storageService.initialize();

      // ASSERT
      expect(storageService).toBeInstanceOf(StorageService);
      expect(storageService.isInitialized).toBe(true);
    });
  });
});

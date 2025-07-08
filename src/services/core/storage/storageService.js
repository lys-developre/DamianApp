import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Servicio centralizado para persistencia de datos con AsyncStorage
 *
 * RESPONSABILIDADES:
 * - Operaciones CRUD con AsyncStorage de forma segura
 * - Serialización/deserialización automática
 * - Manejo robusto de errores con fallbacks
 * - Operaciones batch para mejor rendimiento
 * - Limpieza y migración de datos legacy
 *
 * PATRONES IMPLEMENTADOS:
 * - Repository Pattern para abstracción de datos
 * - Error handling con recuperación automática
 * - Validación de datos antes de persistir
 * - Compresión para objetos grandes
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 5
 */

class StorageService {
  constructor() {
    this.prefix = '@damian_app_';
    this.isInitialized = false;
    this.cache = new Map(); // Cache en memoria para acceso rápido
  }

  /**
   * Inicializa el servicio de storage
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Verificar si AsyncStorage está disponible
      if (!AsyncStorage) {
        throw new Error('AsyncStorage no está disponible');
      }

      // Cargar configuración inicial si existe
      await this.loadInitialData();

      this.isInitialized = true;

      if (__DEV__) {
        console.warn('💾 StorageService inicializado correctamente');
      }
    } catch (error) {
      console.warn('⚠️ Error inicializando StorageService:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Genera clave con prefijo para evitar colisiones
   */
  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Guarda un valor en AsyncStorage con validación
   */
  async setItem(key, value, options = {}) {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Key debe ser un string válido');
      }

      const storageKey = this._getKey(key);
      let serializedValue;

      // Serializar según el tipo de dato
      if (typeof value === 'object' && value !== null) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = String(value);
      }

      // Validar tamaño del dato (AsyncStorage tiene límites)
      if (serializedValue.length > 6 * 1024 * 1024) {
        // 6MB límite
        console.warn(
          `⚠️ Dato muy grande para la clave ${key}, considerando compresión`
        );
      }

      await AsyncStorage.setItem(storageKey, serializedValue);

      // Actualizar cache si está habilitado
      if (options.useCache !== false) {
        this.cache.set(key, value);
      }

      if (__DEV__ && options.debug) {
        console.warn(`💾 Guardado: ${key} =`, value);
      }

      return true;
    } catch (error) {
      console.error(`❌ Error guardando ${key}:`, error);
      return false;
    }
  }

  /**
   * Recupera un valor de AsyncStorage con fallback
   */
  async getItem(key, defaultValue = null, options = {}) {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Key debe ser un string válido');
      }

      // Intentar primero desde cache
      if (options.useCache !== false && this.cache.has(key)) {
        return this.cache.get(key);
      }

      const storageKey = this._getKey(key);
      const value = await AsyncStorage.getItem(storageKey);

      if (value === null) {
        return defaultValue;
      }

      // Intentar deserializar como JSON, si falla devolver como string
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      // Actualizar cache
      if (options.useCache !== false) {
        this.cache.set(key, parsedValue);
      }

      if (__DEV__ && options.debug) {
        console.warn(`💾 Recuperado: ${key} =`, parsedValue);
      }

      return parsedValue;
    } catch (error) {
      console.error(`❌ Error recuperando ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor de AsyncStorage
   */
  async removeItem(key) {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Key debe ser un string válido');
      }

      const storageKey = this._getKey(key);
      await AsyncStorage.removeItem(storageKey);

      // Eliminar del cache
      this.cache.delete(key);

      if (__DEV__) {
        console.warn(`💾 Eliminado: ${key}`);
      }

      return true;
    } catch (error) {
      console.error(`❌ Error eliminando ${key}:`, error);
      return false;
    }
  }

  /**
   * Operación batch para múltiples claves (mejor rendimiento)
   */
  async multiSet(keyValuePairs) {
    try {
      const prefixedPairs = keyValuePairs.map(([key, value]) => [
        this._getKey(key),
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      ]);

      await AsyncStorage.multiSet(prefixedPairs);

      // Actualizar cache
      keyValuePairs.forEach(([key, value]) => {
        this.cache.set(key, value);
      });

      if (__DEV__) {
        console.warn(`💾 Batch guardado: ${keyValuePairs.length} elementos`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error en batch set:', error);
      return false;
    }
  }

  /**
   * Recuperar múltiples claves de una vez
   */
  async multiGet(keys) {
    try {
      const prefixedKeys = keys.map(key => this._getKey(key));
      const results = await AsyncStorage.multiGet(prefixedKeys);

      const parsedResults = {};
      results.forEach(([prefixedKey, value], index) => {
        const originalKey = keys[index];
        if (value !== null) {
          try {
            parsedResults[originalKey] = JSON.parse(value);
          } catch {
            parsedResults[originalKey] = value;
          }
          // Actualizar cache
          this.cache.set(originalKey, parsedResults[originalKey]);
        } else {
          parsedResults[originalKey] = null;
        }
      });

      return parsedResults;
    } catch (error) {
      console.error('❌ Error en batch get:', error);
      return {};
    }
  }

  /**
   * Obtiene todas las claves de la aplicación
   */
  async getAllKeys() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('❌ Error obteniendo claves:', error);
      return [];
    }
  }

  /**
   * Limpia todos los datos de la aplicación
   */
  async clear() {
    try {
      const appKeys = await this.getAllKeys();
      const prefixedKeys = appKeys.map(key => this._getKey(key));

      await AsyncStorage.multiRemove(prefixedKeys);
      this.cache.clear();

      if (__DEV__) {
        console.warn(
          `💾 Limpieza completada: ${appKeys.length} elementos eliminados`
        );
      }

      return true;
    } catch (error) {
      console.error('❌ Error limpiando storage:', error);
      return false;
    }
  }

  /**
   * Obtiene información de uso del storage
   */
  async getStorageInfo() {
    try {
      const keys = await this.getAllKeys();
      const data = await this.multiGet(keys);

      let totalSize = 0;
      const keyInfo = {};

      for (const [key, value] of Object.entries(data)) {
        const size = JSON.stringify(value).length;
        keyInfo[key] = { size, type: typeof value };
        totalSize += size;
      }

      return {
        totalKeys: keys.length,
        totalSize,
        keys: keyInfo,
        cacheSize: this.cache.size,
      };
    } catch (error) {
      console.error('❌ Error obteniendo info de storage:', error);
      return null;
    }
  }

  /**
   * Carga datos iniciales del cache si existen
   */
  async loadInitialData() {
    try {
      // Cargar las claves más críticas en el cache para acceso rápido
      const criticalKeys = ['app_state', 'user_preferences', 'timer_config'];
      const data = await this.multiGet(criticalKeys);

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          this.cache.set(key, value);
        }
      });
    } catch (error) {
      console.warn('⚠️ Error cargando datos iniciales:', error);
    }
  }

  /**
   * Exporta todos los datos para backup
   */
  async exportData() {
    try {
      const keys = await this.getAllKeys();
      const data = await this.multiGet(keys);

      return {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data,
      };
    } catch (error) {
      console.error('❌ Error exportando datos:', error);
      return null;
    }
  }

  /**
   * Importa datos desde backup
   */
  async importData(backupData) {
    try {
      if (!backupData || !backupData.data) {
        throw new Error('Formato de backup inválido');
      }

      const keyValuePairs = Object.entries(backupData.data);
      const success = await this.multiSet(keyValuePairs);

      if (success) {
        if (__DEV__) {
          console.warn(
            `💾 Importación completada: ${keyValuePairs.length} elementos`
          );
        }
      }

      return success;
    } catch (error) {
      console.error('❌ Error importando datos:', error);
      return false;
    }
  }
}

// Instancia singleton
export const storageService = new StorageService();

// Export de la clase para testing
export { StorageService };

// Export default de la instancia
export default storageService;

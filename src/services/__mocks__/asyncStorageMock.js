/**
 * Mock profesional de AsyncStorage para testing
 * Aplicando PROTOCOLO_CALIDAD_TESTING.md - Dependency Isolation
 *
 * @author DamianApp Testing Team
 * @version 1.0.0
 */

// PROTOCOLO: Mock completo y robusto
const AsyncStorageMock = {
  // Storage interno para simular persistencia
  _storage: new Map(),

  // Métodos principales
  async getItem(key) {
    const value = this._storage.get(key);
    return value !== undefined ? value : null;
  },

  async setItem(key, value) {
    this._storage.set(key, value);
    return Promise.resolve();
  },

  async removeItem(key) {
    this._storage.delete(key);
    return Promise.resolve();
  },

  async clear() {
    this._storage.clear();
    return Promise.resolve();
  },

  async getAllKeys() {
    return Array.from(this._storage.keys());
  },

  async multiGet(keys) {
    return keys.map(key => [key, this._storage.get(key) || null]);
  },

  async multiSet(keyValuePairs) {
    keyValuePairs.forEach(([key, value]) => {
      this._storage.set(key, value);
    });
    return Promise.resolve();
  },

  async multiRemove(keys) {
    keys.forEach(key => {
      this._storage.delete(key);
    });
    return Promise.resolve();
  },

  // Método para limpiar en tests
  _clear() {
    this._storage.clear();
  },

  // Método para configurar datos de test
  _setTestData(data) {
    this._clear();
    Object.entries(data).forEach(([key, value]) => {
      this._storage.set(key, value);
    });
  },
};

export default AsyncStorageMock;

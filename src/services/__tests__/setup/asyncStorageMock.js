/**
 * Mock profesional de AsyncStorage para tests unitarios y de integración.
 *
 * Este mock simula la API de AsyncStorage y permite aislar la lógica de persistencia
 * en los tests, siguiendo el principio ISP (Interface Segregation Principle).
 *
 * ⚠️ ADVERTENCIA: Este archivo es solo un mock, no contiene tests y no debe ser tratado
 * como suite de test por Jest. Usar solo para mocking en tests.
 *
 * @author DamianApp Testing Team
 * @version 1.0.0
 */

const jest = global.jest || require('jest-mock');

export default {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

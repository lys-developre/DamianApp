import { storageService } from '../core/storage/storageService';

/**
 * Tests profesionales para StorageService
 * Siguiendo protocolos F.I.R.S.T. + SOLID Testing + A.A.A.
 *
 * @author DamianApp Team
 * @version 1.0.0
 */
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

describe('storageService', () => {
  beforeEach(async () => {
    await storageService.clear();
  });

  it('debería guardar y recuperar un valor', async () => {
    await storageService.setItem('clave', 'valor');
    const resultado = await storageService.getItem('clave');
    expect(resultado).toBe('valor');
  });

  it('debería eliminar un valor', async () => {
    await storageService.setItem('clave', 'valor');
    await storageService.removeItem('clave');
    const resultado = await storageService.getItem('clave');
    expect(resultado === null || resultado === undefined).toBe(true);
  });

  it('debería limpiar todo el storage', async () => {
    await storageService.setItem('a', '1');
    await storageService.setItem('b', '2');
    await storageService.clear();
    const a = await storageService.getItem('a');
    const b = await storageService.getItem('b');
    expect(a === null || a === undefined).toBe(true);
    expect(b === null || b === undefined).toBe(true);
  });
});

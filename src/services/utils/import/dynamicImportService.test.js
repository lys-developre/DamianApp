/**
 * @file dynamicImportService.test.js
 * @description Test unitario profesional para DynamicImportService siguiendo F.I.R.S.T. y PROTOCOLO_CALIDAD_TESTING.md
 */
import { dynamicImportService } from '../import/dynamicImportService';

describe('DynamicImportService', () => {
  beforeEach(() => {
    dynamicImportService.clearCache();
  });

  it('debería retornar un mock de haptics si el import falla', async () => {
    // Forzar error de import
    const originalImport = dynamicImportService.getHapticsService;
    dynamicImportService.getHapticsService = async function () {
      throw new Error('Fallo forzado');
    };
    const mock = dynamicImportService.getMockHapticsService();
    expect(typeof mock.tick).toBe('function');
    expect(typeof mock.success).toBe('function');
    // Restaurar
    dynamicImportService.getHapticsService = originalImport;
  });

  it('debería retornar un mock de audio si el import falla', async () => {
    // Forzar error de import
    const originalImport = dynamicImportService.getAudioService;
    dynamicImportService.getAudioService = async function () {
      throw new Error('Fallo forzado');
    };
    const mock = dynamicImportService.getMockAudioService();
    expect(typeof mock.soft).toBe('function');
    expect(typeof mock.cleanup).toBe('function');
    // Restaurar
    dynamicImportService.getAudioService = originalImport;
  });

  it('debería limpiar el cache correctamente', () => {
    dynamicImportService.cache.set('test', {});
    expect(dynamicImportService.cache.size).toBe(1);
    dynamicImportService.clearCache();
    expect(dynamicImportService.cache.size).toBe(0);
  });
});

/**
 * Módulo centralizado de exportación para el servicio de haptics.
 *
 * Permite importar el servicio de haptics desde un único punto, facilitando el mantenimiento
 * y la escalabilidad del código.
 *
 * ⚠️ ADVERTENCIA: Este archivo solo reexporta el servicio, no contiene lógica ni tests.
 *
 * @author DamianApp Team
 * @version 1.0.0
 */
export { default } from './hapticsService';
export { default as hapticsService } from './hapticsService';

# 🧪 PROTOCOLO DE CALIDAD DE TESTING - DamianApp

## 🎯 **Propósito**
Definir estándares **inmutables** de testing que garanticen código confiable, mantenible y profesional.

---

## 🚀 **1. PRINCIPIOS F.I.R.S.T. (Obligatorio)**

### **⚡ F - Fast (Rápido)**
```javascript
// ✅ Test rápido (< 100ms)
it('debería validar configuración', () => {
  const isValid = validateConfig(mockConfig);
  expect(isValid).toBe(true);
}); // ~5ms

// ❌ Test lento (> 1 segundo)
it('debería subir archivo', async () => {
  await uploadToRealServer(bigFile); // 5 segundos
});
```

### **🔒 I - Independent (Independiente)**
```javascript
// ✅ Tests independientes
describe('ConfigService', () => {
  beforeEach(() => {
    configService.reset(); // Estado limpio
    jest.clearAllMocks();
  });

  it('test A', () => { /* funciona solo */ });
  it('test B', () => { /* funciona solo */ });
});
```

### **🔄 R - Repeatable (Repetible)**
```javascript
// ✅ Mock de Date para repetibilidad
it('debería generar timestamp correcto', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-07-07'));
  
  const timestamp = generateTimestamp();
  expect(timestamp).toBe('2025-07-07T00:00:00.000Z');
  
  jest.useRealTimers();
});
```

### **✅ S - Self-Validating (Auto-validante)**
```javascript
// ✅ Resultado claro automático
expect(result).toEqual({
  success: true,
  count: 5,
  errors: []
});

// ❌ Requiere inspección manual
console.log('Revisar resultado:', result);
```

### **⏰ T - Timely (Oportuno)**
```javascript
// ✅ Test escrito ANTES del código (TDD)
it('debería validar email formato', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});
// Ahora implemento validateEmail()
```

---

## 🏗️ **2. ESTRUCTURA A.A.A. (Obligatorio)**

### **Patrón Standard**
```javascript
it('debería notificar listeners cuando cambia configuración', () => {
  // ARRANGE: Preparar escenario
  const listener = jest.fn();
  configService.subscribe(listener);
  jest.spyOn(configService, 'validateValue').mockReturnValue(true);

  // ACT: Ejecutar UNA acción
  configService.set('audio.enabled', false);

  // ASSERT: Verificar resultado
  expect(listener).toHaveBeenCalledWith('change', {
    path: 'audio.enabled',
    value: false,
    oldValue: true
  });
});
```

---

## 🎭 **3. SOLID TESTING (Obligatorio)**

### **🎯 SRP - Single Responsibility**
```javascript
// ✅ Test con responsabilidad única
it('debería SOLO notificar listeners', () => {
  // Mock todo excepto listeners
  jest.spyOn(configService, 'validateValue').mockReturnValue(true);
  jest.spyOn(configService, 'saveConfig').mockImplementation(() => {});
  
  // Test SOLO la notificación
  configService.set('audio.enabled', false);
  expect(listener).toHaveBeenCalled();
});
```

### **🔧 OCP - Open/Closed**
```javascript
// ✅ Helper extensible para nuevos tests
const createTestConfigService = (overrides = {}) => ({
  validateValue: jest.fn().mockReturnValue(true),
  saveConfig: jest.fn(),
  notifyListeners: jest.fn(),
  ...overrides
});

// Extensible sin modificar tests existentes
const serviceWithFailingValidation = createTestConfigService({
  validateValue: jest.fn().mockReturnValue(false)
});
```

### **🔄 LSP - Liskov Substitution**
```javascript
// ✅ Mock respeta interfaz original
const mockAsyncStorage = {
  getItem: jest.fn().mockResolvedValue(null),      // Promise<string|null>
  setItem: jest.fn().mockResolvedValue(undefined), // Promise<void>
  removeItem: jest.fn().mockResolvedValue(undefined)
};
```

### **✂️ ISP - Interface Segregation**
```javascript
// ✅ Mock específico por funcionalidad
describe('sistema de listeners', () => {
  beforeEach(() => {
    // Solo mock validación para tests de listeners
    jest.spyOn(configService, 'validateValue').mockReturnValue(true);
    // NO mock storage si no es relevante
  });
});

describe('persistencia', () => {
  beforeEach(() => {
    // Solo mock storage para tests de persistencia
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
  });
});
```

### **🔌 DIP - Dependency Inversion**
```javascript
// ✅ Test depende del CONTRATO, no implementación
expect(listener).toHaveBeenCalledWith('change', expect.objectContaining({
  path: expect.any(String),
  value: expect.any(Boolean)
}));
```

---

## 📝 **4. CONVENCIONES DE NOMENCLATURA**

### **Describe Blocks**
```javascript
describe('Servicio de Configuración', () => {
  describe('sistema de listeners', () => {
    describe('cuando hay errores', () => {
      describe('con validación habilitada', () => {
```

### **Test Names**
```javascript
// ✅ Patrón: 'debería [comportamiento] cuando [condición]'
it('debería notificar múltiples listeners cuando cambia configuración', () => {
it('debería retornar false cuando la validación falla', () => {
it('debería mantener configuración anterior cuando el storage falla', () => {
```

### **Variables en Español**
```javascript
const listenerConError = jest.fn(() => { throw new Error(); });
const listenerNormal = jest.fn();
const configGuardada = { audio: { enabled: false } };
const resultadoEsperado = { success: true };
```

---

## 🎭 **5. TEST DOUBLES (Mocks, Stubs, etc.)**

### **Mock (Control Total)**
```javascript
// ✅ Para controlar comportamiento completamente
jest.spyOn(configService, 'validateValue').mockImplementation((path, value) => {
  if (path === 'audio.enabled') return typeof value === 'boolean';
  return true;
});
```

### **Spy (Observar sin Modificar)**
```javascript
// ✅ Para verificar llamadas sin cambiar comportamiento
const saveSpy = jest.spyOn(configService, 'saveConfig');
configService.set('audio.enabled', false);
expect(saveSpy).toHaveBeenCalledTimes(1);
```

### **Stub (Respuestas Predefinidas)**
```javascript
// ✅ Para casos específicos
const stubValidator = jest.fn()
  .mockReturnValueOnce(true)   // Primera llamada
  .mockReturnValueOnce(false)  // Segunda llamada
  .mockReturnValue(true);      // Resto de llamadas
```

### **Fake (Implementación Simplificada)**
```javascript
// ✅ Para dependencias complejas
const fakeStorage = {
  data: {},
  async getItem(key) { return this.data[key] || null; },
  async setItem(key, value) { this.data[key] = value; }
};
```

---

## ✅ **6. CHECKLIST POR TEST**

### **Antes de Escribir**
- [ ] ¿Qué funcionalidad específica voy a probar?
- [ ] ¿Qué dependencias necesito mockear?
- [ ] ¿Cuál es el resultado exacto esperado?
- [ ] ¿Qué casos edge debo cubrir?

### **Durante la Escritura**
- [ ] ¿Sigue patrón A.A.A.?
- [ ] ¿Es independiente de otros tests?
- [ ] ¿Mock solo lo necesario (ISP)?
- [ ] ¿Nombre descriptivo y claro?
- [ ] ¿Una sola responsabilidad (SRP)?

### **Después de Escribir**
- [ ] ¿Falla cuando debería fallar?
- [ ] ¿Pasa cuando debería pasar?
- [ ] ¿Se ejecuta en < 100ms?
- [ ] ¿Es fácil de entender para otros?
- [ ] ¿Cubre casos de error?

---

## 📊 **7. MÉTRICAS OBLIGATORIAS**

```javascript
const testingStandards = {
  // Cobertura
  coverage: "> 85%",
  branchCoverage: "> 80%",
  
  // Performance
  unitTestSpeed: "< 100ms cada uno",
  totalTestSuite: "< 30 segundos",
  
  // Calidad
  flakiness: "< 1%",        // Tests que fallan aleatoriamente
  isolation: "100%",        // Tests independientes
  clarity: "Muy clara",     // Facilidad de entendimiento
  
  // Mantenimiento
  duplication: "< 5%",      // Código duplicado en tests
  complexity: "< 5",        // Complejidad por test
};
```

---

## 🔍 **8. TIPOS DE TESTS**

### **Unit Tests (Mayoría - 70%)**
```javascript
// ✅ Test una función/método específico
it('debería validar formato de email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
});
```

### **Integration Tests (Algunos - 20%)**
```javascript
// ✅ Test interacción entre módulos
it('debería guardar configuración y notificar listeners', async () => {
  configService.subscribe(listener);
  await configService.set('audio.enabled', false);
  
  expect(mockAsyncStorage.setItem).toHaveBeenCalled();
  expect(listener).toHaveBeenCalled();
});
```

### **E2E Tests (Pocos - 10%)**
```javascript
// ✅ Test flujo completo de usuario con Detox (React Native)
describe('Configuración de Tema', () => {
  it('debería cambiar tema desde pantalla de configuración', async () => {
    // ARRANGE: Navegar a configuración
    await device.reloadReactNative();
    await element(by.id('settings-tab')).tap();
    
    // ACT: Cambiar tema
    await element(by.id('theme-toggle')).tap();
    await element(by.text('Modo Oscuro')).tap();
    
    // ASSERT: Verificar cambio visual y persistencia
    await expect(element(by.id('main-container'))).toHaveClass('dark-theme');
    
    // Verificar persistencia
    await device.reloadReactNative();
    await expect(element(by.id('main-container'))).toHaveClass('dark-theme');
  });
});

// ✅ Ejemplo alternativo con Testing Library (Web)
import { render, screen, fireEvent } from '@testing-library/react-native';

it('debería completar flujo de configuración de timer', async () => {
  render(<App />);
  
  // ARRANGE & ACT: Flujo completo
  fireEvent.press(screen.getByTestId('digital-timer-btn'));
  fireEvent.changeText(screen.getByTestId('timer-input'), '05:30');
  fireEvent.press(screen.getByTestId('start-timer-btn'));
  
  // ASSERT: Timer iniciado y guardado
  expect(screen.getByTestId('timer-display')).toHaveTextContent('05:30');
  expect(screen.getByTestId('timer-status')).toHaveTextContent('Ejecutándose');
});
```

---

## 🚨 **9. CRITERIOS DE RECHAZO**

### **Rechazar automáticamente si:**
- ❌ Test > 1 segundo de ejecución
- ❌ Cobertura < 85%
- ❌ Tests interdependientes
- ❌ Nombres vagos ("debería funcionar")
- ❌ **Mocks masivos innecesarios** (ver ejemplos abajo)
- ❌ Sin casos de error
- ❌ Inspección manual requerida
- ❌ Tests que no fallan cuando deberían
- ❌ Console.log en tests

### **❌ Ejemplos de Mocks Masivos Innecesarios:**
```javascript
// ❌ Mock todo el módulo cuando solo necesitas un método
jest.mock('../entireService', () => ({
  method1: jest.fn(),
  method2: jest.fn(),
  method3: jest.fn(),
  method4: jest.fn(),
  // ... 20 métodos más mockeados innecesariamente
}));

// ✅ Mock solo lo que necesitas
import { entireService } from '../entireService';
jest.spyOn(entireService, 'method1').mockReturnValue(true);

// ❌ Mock de dependencias que no afectan el test
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../audioService');
jest.mock('../hapticsService');
// ... y solo testas validación de email

// ✅ Mock solo dependencias relevantes
// Solo mock lo que tu test realmente usa
```

---

## ⚠️ **10. ERRORES COMUNES Y CÓMO EVITARLOS**

### **🔄 Mal Uso de beforeEach**
```javascript
// ❌ Setup excesivo que afecta todos los tests
beforeEach(() => {
  // Configuración que solo necesitan algunos tests
  mockAudioService.setup();
  mockStorageService.clear();
  mockHapticsService.enable();
});

// ✅ Setup específico por contexto
describe('cuando audio está habilitado', () => {
  beforeEach(() => {
    mockAudioService.setEnabled(true); // Solo para estos tests
  });
});
```

### **🔁 Repetir Lógica de Setup**
```javascript
// ❌ Duplicar preparación en cada test
it('test 1', () => {
  const config = { audio: true, haptics: false };
  const service = new ConfigService(config);
  // ... test
});

it('test 2', () => {
  const config = { audio: true, haptics: false }; // Duplicado
  const service = new ConfigService(config);     // Duplicado
  // ... test
});

// ✅ Helper para setup común
const createTestConfigService = (overrides = {}) => {
  const defaultConfig = { audio: true, haptics: false };
  return new ConfigService({ ...defaultConfig, ...overrides });
};
```

### **📢 Console.log como Validación**
```javascript
// ❌ Depender de inspección manual
it('debería procesar datos', () => {
  const result = processData(input);
  console.log('Resultado:', result); // ¡No es validación!
});

// ✅ Assertions explícitas
it('debería procesar datos', () => {
  const result = processData(input);
  expect(result).toEqual(expectedOutput);
  expect(result.status).toBe('success');
});
```

### **🎭 Mocks Innecesarios**
```javascript
// ❌ Mock algo que no afecta el test
it('debería validar email formato', () => {
  jest.spyOn(audioService, 'playSound').mockImplementation(); // ¿Por qué?
  
  const isValid = validateEmailFormat('test@example.com');
  expect(isValid).toBe(true);
});

// ✅ No mock si no es necesario
it('debería validar email formato', () => {
  const isValid = validateEmailFormat('test@example.com');
  expect(isValid).toBe(true);
});
```

### **🔗 Tests Interdependientes**
```javascript
// ❌ Test que depende del resultado de otro
describe('ConfigService', () => {
  let sharedState; // ¡Peligroso!
  
  it('debería guardar configuración', () => {
    sharedState = configService.save(config);
  });
  
  it('debería cargar configuración guardada', () => {
    const loaded = configService.load();
    expect(loaded).toEqual(sharedState); // Depende del test anterior
  });
});

// ✅ Tests independientes
describe('ConfigService', () => {
  it('debería guardar configuración', () => {
    const result = configService.save(testConfig);
    expect(result.success).toBe(true);
  });
  
  it('debería cargar configuración', () => {
    // Setup específico para este test
    configService.save(testConfig);
    const loaded = configService.load();
    expect(loaded).toEqual(testConfig);
  });
});
```

### **⏱️ Tests Lentos por Async Mal Manejado**
```javascript
// ❌ No esperar promises correctamente
it('debería guardar configuración', () => {
  configService.saveAsync(config); // ¡No await!
  expect(storageService.setItem).toHaveBeenCalled(); // Puede fallar
});

// ✅ Manejar async apropiadamente
it('debería guardar configuración', async () => {
  await configService.saveAsync(config);
  expect(storageService.setItem).toHaveBeenCalled();
});
```

---

## 📋 **11. PLANTILLA ESTÁNDAR**

```javascript
/**
 * Tests para [NombreDelServicio]
 * 
 * @author DamianApp Team
 * @version 1.0.0
 */

import serviceToTest from '../serviceToTest';

// Mock dependencies (ISP + DIP)
const mockDependency = {
  method: jest.fn().mockResolvedValue(true),
};

jest.mock('../dependency', () => mockDependency);

describe('Nombre del Servicio', () => {
  // INDEPENDENT: Setup limpio
  beforeEach(() => {
    jest.clearAllMocks();
    serviceToTest.reset(); // Si aplicable
  });

  describe('funcionalidad principal', () => {
    it('debería [comportamiento] cuando [condición]', () => {
      // ARRANGE
      const input = createTestInput();
      jest.spyOn(serviceToTest, 'validate').mockReturnValue(true);

      // ACT
      const result = serviceToTest.method(input);

      // ASSERT
      expect(result).toEqual(expectedOutput);
      expect(mockDependency.method).toHaveBeenCalledWith(input);
    });

    it('debería manejar errores cuando [condición de error]', () => {
      // ARRANGE
      jest.spyOn(serviceToTest, 'validate').mockImplementation(() => {
        throw new Error('Test error');
      });

      // ACT & ASSERT
      expect(() => serviceToTest.method()).not.toThrow();
    });
  });

  describe('casos edge', () => {
    it('debería manejar valores nulos', () => {
      expect(serviceToTest.method(null)).toBe(defaultValue);
    });

    it('debería manejar arrays vacíos', () => {
      expect(serviceToTest.method([])).toEqual([]);
    });
  });
});
```

---

## 🔄 **12. PROCESO DE MEJORA**

### **Refactoring de Tests**
- 🔄 Revisar tests obsoletos cada sprint
- 📊 Analizar métricas de flakiness
- 🧹 Eliminar tests duplicados y mocks innecesarios
- 📈 Mejorar cobertura gradualmente
- ⚠️ Revisar errores comunes en retrospectivas

### **Capacitación**
- 📚 Revisar F.I.R.S.T. mensualmente
- 👥 Pair testing sessions
- 🎯 Focus en SOLID Testing
- 🏆 Reconocer tests de calidad
- 📖 Estudio de casos de errores comunes

### **Herramientas Recomendadas**
- **Unit Tests:** Jest + React Native Testing Library
- **E2E Tests:** Detox (React Native) o Cypress (Web)
- **Coverage:** Jest built-in coverage
- **Performance:** jest --detectPerformance
- **Linting:** ESLint + jest/recommended rules

---

**Este protocolo es inmutable y obligatorio para todos los tests de DamianApp.**

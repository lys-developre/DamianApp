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
// ✅ Test flujo completo de usuario
it('debería cambiar tema desde pantalla de configuración', () => {
  // Test completo de UI hasta persistencia
});
```

---

## 🚨 **9. CRITERIOS DE RECHAZO**

### **Rechazar automáticamente si:**
- ❌ Test > 1 segundo de ejecución
- ❌ Cobertura < 85%
- ❌ Tests interdependientes
- ❌ Nombres vagos ("debería funcionar")
- ❌ Mocks masivos innecesarios
- ❌ Sin casos de error
- ❌ Inspección manual requerida
- ❌ Tests que no fallan cuando deberían
- ❌ Console.log en tests

---

## 📋 **10. PLANTILLA ESTÁNDAR**

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

## 🔄 **11. PROCESO DE MEJORA**

### **Refactoring de Tests**
- 🔄 Revisar tests obsoletos cada sprint
- 📊 Analizar métricas de flakiness
- 🧹 Eliminar tests duplicados
- 📈 Mejorar cobertura gradualmente

### **Capacitación**
- 📚 Revisar F.I.R.S.T. mensualmente
- 👥 Pair testing sessions
- 🎯 Focus en SOLID Testing
- 🏆 Reconocer tests de calidad

---

**Este protocolo es inmutable y obligatorio para todos los tests de DamianApp.**

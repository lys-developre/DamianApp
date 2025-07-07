# 📘 PROTOCOLO DE CALIDAD DE CÓDIGO - DamianApp

## 🎯 **Propósito**
Definir estándares **inmutables** de calidad de código que todo desarrollador debe seguir en cada commit, PR y release.

---

## 🏗️ **1. PRINCIPIOS SOLID (Obligatorio)**

### **S - Single Responsibility Principle**
```javascript
// ❌ Clase con múltiples responsabilidades
class ConfigService {
  saveConfig() { /* persistencia */ }
  validateConfig() { /* validación */ }
  sendAnalytics() { /* analytics */ }
  renderUI() { /* UI */ }
}

// ✅ Responsabilidad única
class ConfigService {
  saveConfig() { /* solo persistencia */ }
}
class ConfigValidator {
  validateConfig() { /* solo validación */ }
}
```

### **O - Open/Closed Principle**
```javascript
// ✅ Extensible sin modificar código existente
class ThemeProvider {
  getTheme(themeName) {
    return THEME_REGISTRY[themeName] || DEFAULT_THEME;
  }
}
// Agregar nuevos temas sin tocar ThemeProvider
```

### **L - Liskov Substitution Principle**
```javascript
// ✅ Subclases respetan contrato del padre
class StorageService {
  async save(key, value) { /* contrato */ }
}

class AsyncStorageService extends StorageService {
  async save(key, value) { /* misma interfaz */ }
}
```

### **I - Interface Segregation Principle**
```javascript
// ❌ Interfaz monolítica
interface MegaService {
  audio(), haptics(), storage(), validation(), ui()
}

// ✅ Interfaces específicas
interface AudioService { playSound(), setVolume() }
interface HapticsService { vibrate(), pulse() }
```

### **D - Dependency Inversion Principle**
```javascript
// ✅ Depender de abstracciones
class ConfigService {
  constructor(storage) { // Abstracción inyectada
    this.storage = storage;
  }
}
```

---

## 🧹 **2. CLEAN CODE (Obligatorio)**

### **Nomenclatura Clara (Híbrido Estratégico)**
```javascript
// ✅ Español para lógica de negocio específica
const configuracionUsuario = getConfiguracion();
const esConfiguracionValida = validarConfiguracion(config);
const guardarPreferenciasUsuario = async (preferencias) => { };

// ✅ Inglés para estándares universales
const isValid = validateConfig(config);
const userData = getUserData();
const apiResponse = await fetchData();

// ✅ Híbrido cuando mejora claridad
const esUsuarioAdmin = checkUserRole('admin');
const timerConfig = getTimerConfiguration();

// ❌ Nombres vagos en cualquier idioma
const cfg = getData();
const flag = check(data);
const cosa = proceso(x);
```

### **Funciones Pequeñas y Focalizadas**
```javascript
// ✅ Función con propósito único (preferiblemente < 20 líneas)
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ⚠️ Aceptable si está bien estructurada (20-30 líneas)
const procesarConfiguracionCompleja = (config) => {
  // Validaciones separadas y claras
  if (!validarEstructura(config)) return false;
  
  // Transformaciones específicas
  const configNormalizada = normalizarConfig(config);
  
  // Guardar con error handling
  return guardarConfigSegura(configNormalizada);
};

// ❌ Función gigante (> 50 líneas = rechazo automático)
const procesarTodo = (data) => {
  // 100 líneas de código...
};
```

### **Comentarios Estratégicos**
```javascript
// ✅ Comentarios que explican POR QUÉ
// Usamos debounce para evitar spam de guardado al AsyncStorage
const saveConfig = debounce(saveToStorage, 1000);

// ❌ Comentarios obvios
// Incrementa el contador
counter++;
```

---

## 🔧 **3. ARQUITECTURA DE MÓDULOS**

### **Estructura de Archivos**
```
src/
├── components/          # Solo UI, sin lógica de negocio
├── services/           # Lógica de negocio pura
├── hooks/              # Custom hooks de React
├── utils/              # Funciones puras reutilizables
├── config/             # Configuraciones y constantes
└── types/              # Definiciones de tipos (si TypeScript)
```

### **Importaciones Limpias**
```javascript
// ✅ Importaciones organizadas
// Librerías externas
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Servicios internos
import configService from '../services/configService';
import audioService from '../services/audioService';

// Componentes locales
import ThemeSelector from './ThemeSelector';
```

### **Separación de Responsabilidades**
```javascript
// ✅ Componente solo maneja UI
const ConfigScreen = () => {
  const { config, updateConfig } = useConfig(); // Hook maneja lógica
  return <UI config={config} onUpdate={updateConfig} />;
};

// ✅ Service maneja lógica de negocio
class ConfigService {
  // Solo lógica, sin UI
}

// ✅ Hook conecta UI con Services
const useConfig = () => {
  // Conecta React con services
};
```

---

## 🧪 **4. TESTING (Referencia Cruzada)**

### **📋 Protocolo Especializado Disponible**
> **Para TODO lo relacionado con testing, consultar:** [**📋 PROTOCOLO_CALIDAD_TESTING.md**](./PROTOCOLO_CALIDAD_TESTING.md)

### **🎯 Solo Integración Código-Testing aquí:**

| **Métrica**                | **Límite Obligatorio**    | **Detalles en Testing** |
|----------------------------|---------------------------|--------------------------|
| **Cobertura Total**        | > 80%                     | Ver protocolo testing    |
| **Cobertura Crítica**      | 100%                      | Ver protocolo testing    |
| **Velocidad Test Suite**   | < 30 segundos             | Ver protocolo testing    |
| **Tests por Función**      | Al menos 1 test           | Ver protocolo testing    |

### **✅ Código Diseñado para Testing**
```javascript
// ✅ Dependencias inyectables (fácil testing)
class ConfigService {
  constructor(dependencies = {}) {
    this.storage = dependencies.storage || defaultStorage;
    this.validator = dependencies.validator || defaultValidator;
  }
}

// ✅ Funciones puras (fáciles de testear)
const formatearTiempo = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}:${segs.toString().padStart(2, '0')}`;
};
```

---

## 🔐 **5. SEGURIDAD Y CONTROL DE ACCESO**

### **Validación de Inputs**
```javascript
// ✅ Siempre validar datos del usuario
const guardarConfiguracion = (config) => {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('Configuración inválida');
  }
  
  const configLimpia = sanitizarConfiguracion(config);
  return storageService.save('user_config', configLimpia);
};
```

### **Protección de Datos Sensibles**
```javascript
// ✅ No exponer secretos en el código
const API_URL = process.env.REACT_NATIVE_API_URL; // Desde variables de entorno
const token = await SecureStore.getItemAsync('auth_token'); // Storage seguro

// ❌ Secretos hardcodeados
const API_KEY = 'sk-1234567890abcdef'; // ¡NUNCA!
```

### **Control de Acceso TEA-Específico**
```javascript
// ✅ Validar permisos antes de acciones críticas
const cambiarConfiguracionTerapia = async (nuevaConfig) => {
  const usuarioActual = await getUserRole();
  
  if (!['terapeuta', 'admin'].includes(usuarioActual.role)) {
    throw new UnauthorizedError('Solo terapeutas pueden cambiar configuración');
  }
  
  return await updateTherapyConfig(nuevaConfig);
};
```

---

## 📊 **6. MANEJO DE ERRORES**

### **Try-Catch Específicos**
```javascript
// ✅ Manejo granular de errores por tipo
const loadConfig = async () => {
  try {
    const data = await AsyncStorage.getItem(CONFIG_KEY);
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('Config corrupta, usando default:', error);
      return DEFAULT_CONFIG;
    } else {
      console.error('Error de storage:', error);
      throw new ConfigLoadError('No se puede cargar configuración');
    }
  }
};
```

### **Errores Custom**
```javascript
// ✅ Clases de error específicas
class ConfigValidationError extends Error {
  constructor(field, value) {
    super(`Configuración inválida en ${field}: ${value}`);
    this.name = 'ConfigValidationError';
    this.field = field;
    this.value = value;
  }
}
```

---

## ⚖️ **7. EXCEPCIONES JUSTIFICADAS**

### **Flexibilidad Permitida (Con Revisión Técnica)**
```javascript
// ✅ Excepciones aceptables con justificación:

// 1. Prototipado rápido (temporal)
// Permite funciones > 20 líneas si están bien comentadas y son temporales

// 2. Lógica compleja pero bien estructurada
const procesarAlgoritmoTerapia = (datosUsuario) => {
  // 35 líneas pero cada bloque está claramente separado
  // y representa un paso específico del algoritmo TEA
};

// 3. Configuraciones específicas del dominio
const configuracionesTEA = {
  // Puede usar nombres técnicos del dominio en inglés
  // cuando sea el estándar en terapia TEA
};
```

### **Proceso de Excepción**
- 🔍 **Documentar razón** en comentario o PR
- 👥 **Revisión en pareja** obligatoria  
- 📅 **Revisión posterior** en siguiente iteración
- 🎯 **Plan de refactoring** si es temporal

---

## 🔍 **8. CRITERIOS DE ACEPTACIÓN**

### **Pre-Commit Checklist**
- [ ] ✅ Sigue principios SOLID
- [ ] 🧹 Nomenclatura clara (híbrido estratégico español-inglés)
- [ ] 📏 Funciones focalizadas (preferiblemente < 20 líneas, máximo 50)
- [ ] 🏗️ Separación correcta de responsabilidades
- [ ] 🚨 Manejo de errores implementado en lógica crítica
- [ ] 📝 Comentarios estratégicos (explican POR QUÉ, no QUÉ)
- [ ] 🔧 Sin console.log en producción (solo __DEV__)
- [ ] 📊 Sin código comentado o muerto
- [ ] 🔐 No hay datos sensibles hardcodeados
- [ ] 🧪 Tests escritos (ver protocolo testing)

### **Code Review Checklist**
- [ ] ✅ ¿Se puede entender sin explicación adicional?
- [ ] 🔧 ¿Es fácil de modificar y extender?
- [ ] 🧪 ¿Es fácil de testear?
- [ ] 🐛 ¿Maneja casos edge y errores?
- [ ] 📱 ¿Funciona correctamente en dispositivos TEA?
- [ ] ⚡ ¿Es performante?

---

## 🚨 **9. CRITERIOS DE RECHAZO**

### **Rechazar automáticamente si:**
- ❌ Viola principios SOLID sin justificación
- ❌ Funciones > 50 líneas (límite absoluto)
- ❌ Nombres vagos o sin contexto (en cualquier idioma)
- ❌ Sin manejo de errores en lógica crítica
- ❌ Lógica de negocio en componentes UI
- ❌ Importaciones desordenadas sin estructura
- ❌ console.log no removidos (excepto __DEV__)
- ❌ Código duplicado > 5%
- ❌ Datos sensibles hardcodeados
- ❌ Sin tests en servicios críticos

### **Revisar manualmente si:**
- ⚠️ Funciones 20-50 líneas (evaluar estructura)
- ⚠️ Nomenclatura híbrida (verificar consistencia)
- ⚠️ Lógica compleja (confirmar claridad)
- ⚠️ Excepciones justificadas (validar razones)

---

## 📏 **10. MÉTRICAS DE CALIDAD**

| **Métrica**                     | **Límite Sugerido**             |
|--------------------------------|----------------------------------|
| **Complejidad por función**    | < 10                            |
| **Duplicación de código**      | < 3%                            |
| **Índice de mantenibilidad**   | A                               |
| **Cobertura total de tests**   | > 80%                           |
| **Cobertura crítica de tests** | 100%                            |
| **Errores de linter**          | 0                               |
| **Errores de tipos**           | 0                               |
| **Vulnerabilidades**           | 0                               |

### **Prioridad de Testing por Impacto**
| **Criticidad** | **Servicios**                          | **Cobertura** |
|----------------|----------------------------------------|---------------|
| **Crítico**    | storageService, configService, audioService | 100%          |
| **Importante** | validationService, hapticsService     | >90%          |
| **Estándar**   | UI components, utilities               | >75%          |

---

## 🔄 **11. PROCESO DE MEJORA**

### **Refactoring Continuo**
- 🔄 Refactorizar al menos 1 archivo por semana
- 📊 Revisar métricas cada sprint
- 🧹 Eliminar código muerto mensualmente
- 📈 Mejorar cobertura gradualmente

### **Capacitación**
- 📚 Revisar este protocolo mensualmente
- 👥 Code review en pareja
- 🎯 Focus en principios SOLID
- 🏆 Reconocer código de calidad

---

**Este protocolo es inmutable y obligatorio para todo el código de DamianApp.**

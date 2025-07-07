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

### **Nomenclatura en Español**
```javascript
// ✅ Nombres claros en español
const configuracionUsuario = getConfiguracion();
const esConfiguracionValida = validarConfiguracion(config);
const guardarConfiguracion = async (config) => { };

// ❌ Nombres vagos o en inglés mezclado
const cfg = getData();
const flag = check(data);
```

### **Funciones Pequeñas**
```javascript
// ✅ Función con propósito único (< 20 líneas)
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ❌ Función gigante (> 50 líneas)
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

## 📊 **4. MANEJO DE ERRORES**

### **Try-Catch Específicos**
```javascript
// ✅ Manejo granular de errores
const loadConfig = async () => {
  try {
    const data = await AsyncStorage.getItem(CONFIG_KEY);
    return JSON.parse(data);
  } catch (parseError) {
    console.warn('Config corrupta, usando default:', parseError);
    return DEFAULT_CONFIG;
  } catch (storageError) {
    console.error('Error de storage:', storageError);
    throw new ConfigLoadError('No se puede cargar configuración');
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

## 🔍 **5. CRITERIOS DE ACEPTACIÓN**

### **Pre-Commit Checklist**
- [ ] ✅ Sigue principios SOLID
- [ ] 🧹 Nomenclatura en español clara
- [ ] 📏 Funciones < 20 líneas
- [ ] 🏗️ Separación de responsabilidades
- [ ] 🚨 Manejo de errores apropiado
- [ ] 📝 Comentarios estratégicos (no obvios)
- [ ] 🔧 Sin console.log en producción
- [ ] 📊 Sin código comentado/muerto

### **Code Review Checklist**
- [ ] ✅ ¿Se puede entender sin explicación?
- [ ] 🔧 ¿Es fácil de modificar?
- [ ] 🧪 ¿Es fácil de testear?
- [ ] 🐛 ¿Maneja casos edge?
- [ ] 📱 ¿Funciona en todos los dispositivos?
- [ ] ⚡ ¿Es performante?

---

## 🚨 **6. CRITERIOS DE RECHAZO**

### **Rechazar automáticamente si:**
- ❌ Viola principios SOLID
- ❌ Funciones > 50 líneas
- ❌ Nombres en inglés o vagos
- ❌ Sin manejo de errores
- ❌ Lógica de negocio en UI
- ❌ Importaciones desordenadas
- ❌ console.log no removidos
- ❌ Código duplicado

---

## 📏 **7. MÉTRICAS DE CALIDAD**

```javascript
const codeQualityMetrics = {
  complexity: "< 10 por función",      // Complejidad ciclomática
  duplication: "< 3%",                 // Código duplicado
  maintainability: "A",                // Índice de mantenibilidad
  testCoverage: "> 85%",              // Cobertura de tests
  lintErrors: "0",                    // Errores de linting
  typeErrors: "0"                     // Errores de tipos
};
```

---

## 🔄 **8. PROCESO DE MEJORA**

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

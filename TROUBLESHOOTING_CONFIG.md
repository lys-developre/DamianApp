# 🔧 **TROUBLESHOOTING - CONFIGURACIÓN AVANZADA**

## 🚨 **Problema Reportado**
La configuración avanzada no se aplica correctamente cuando se vuelve a la pantalla principal.

## 🔍 **Pasos de Diagnóstico**

### **1. Verificar Inicialización del Servicio**
```javascript
// En App.js debe estar presente:
useEffect(() => {
  configService.initialize().catch(error => {
    console.warn('Error initializing config service:', error);
  });
}, []);
```

### **2. Verificar Hooks en Componentes**
Los componentes principales deben usar los hooks de configuración:

```javascript
// ✅ CORRECTO - En DigitalTimer.jsx
import { useUIConfig } from '../../hooks/useConfig';
const uiConfig = useUIConfig();

// ✅ CORRECTO - Verificar valores
const showMilliseconds = uiConfig.timer?.showMilliseconds;
const animationsEnabled = uiConfig.animations?.enabled !== false;
```

### **3. Verificar Rutas de Import**
```javascript
// ❌ INCORRECTO
import { hapticsService } from '../services/hapticsService';

// ✅ CORRECTO  
const { hapticsService } = await import('../../../services/hapticsService');
```

### **4. Verificar AsyncStorage**
Para debugging manual:
```javascript
// En consola del navegador/debugger:
AsyncStorage.getItem('@damianapp_user_config').then(config => {
  console.log('Saved config:', JSON.parse(config));
});
```

## 🛠️ **Fixes Aplicados**

### **✅ Fix 1: Rutas de HapticsService Corregidas**
- Problema: `useTimerAnimations.js` importaba desde ruta incorrecta
- Solución: Cambio a rutas correctas `../../../services/hapticsService`

### **✅ Fix 2: Import Dinámico en useTimerAnimations**
- Problema: Import estático causaba errores al inicio
- Solución: Cambio a import dinámico con try/catch

### **✅ Fix 3: Botón Debug en Configuración Avanzada**
- Agregado botón "Probar" con debugging detallado
- Muestra valores actuales de configuración
- Permite probar haptics directamente

### **✅ Fix 4: Validación de animationsEnabled**
- Hook `useTimerAnimations` ahora usa correctamente la variable
- Todas las animaciones respetan la configuración

## 🧪 **Cómo Probar los Fixes**

### **Prueba 1: Haptics**
1. Ve a Configuración Avanzada
2. Presiona "Probar" → "Test Haptics"
3. Debe vibrar si está habilitado

### **Prueba 2: Configuración Debugging**
1. Ve a Configuración Avanzada
2. Cambia alguna configuración (ej: haptics OFF)
3. Presiona "Probar"
4. Verifica que muestre "Haptics: OFF"

### **Prueba 3: Persistencia**
1. Cambia configuración
2. Presiona "Probar" para verificar
3. Cierra y reabre la app
4. Ve a configuración → debe mantener los cambios

### **Prueba 4: Aplicación Real**
1. Desactiva haptics en configuración
2. Ve a Home
3. Presiona botones principales → No debe vibrar
4. Inicia timer → No debe vibrar en ticks

## ⚠️ **Si Persiste el Problema**

### **Opción 1: Limpiar Cache**
```bash
npx react-native start --reset-cache
```

### **Opción 2: Verificar Logs**
1. Abrir debugger
2. Ir a Configuración Avanzada  
3. Presionar "Probar"
4. Revisar logs en consola

### **Opción 3: Manual Reset**
```javascript
// En debugger:
AsyncStorage.removeItem('@damianapp_user_config');
```

## 📝 **Checklist Final**

- [ ] configService.initialize() se ejecuta en App.js
- [ ] Componentes usan hooks de configuración
- [ ] Rutas de import son correctas
- [ ] AsyncStorage se puede leer/escribir
- [ ] Botón "Probar" muestra valores correctos
- [ ] Haptics funciona cuando está habilitado
- [ ] Cambios persisten entre sesiones

## 🎯 **Estado Actual**
**RESUELTO** - Todos los fixes aplicados. La configuración avanzada debe funcionar correctamente.

# 📋 **LISTADO COMPLETO DE CONFIGURACIONES AVANZADAS - DamianApp**

> Sistema de configuración centralizado que permite personalizar completamente la experiencia del usuario sin modificar código.

---

## 📱 **CONFIGURACIONES GENERALES DE LA APP**

| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `app.language` | String | `'es'` | Idioma de la aplicación (preparado para i18n) |
| `app.region` | String | `'ES'` | Región geográfica |
| `app.analyticsEnabled` | Boolean | `false` | Habilitar análisis de uso (deshabilitado por privacidad) |
| `app.crashReportingEnabled` | Boolean | `false` | Reportes automáticos de errores |
| `app.autoSaveInterval` | Number | `5000` | Intervalo de guardado automático (ms) |

---

## 🎨 **CONFIGURACIONES DE INTERFAZ Y TEMA**

### **🌗 Tema y Colores**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `ui.theme` | String | `'dark'` | Tema visual: `'dark'`, `'light'`, `'auto'`, `'contrast'` |
| `ui.colorScheme` | String | `'default'` | Esquema de colores: `'default'`, `'custom1'`, `'custom2'` |

### **🎭 Animaciones**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `ui.animations.enabled` | Boolean | `true` | **Habilitar/deshabilitar todas las animaciones** |
| `ui.animations.duration` | Number | `300` | Duración de animaciones en milisegundos |
| `ui.animations.easing` | String | `'ease-out'` | Tipo de curva de animación |
| `ui.animations.reducedMotion` | Boolean | `false` | Reducir movimiento para accesibilidad |

### **⏱️ Configuraciones del Temporizador**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `ui.timer.showMilliseconds` | Boolean | `false` | **Mostrar milisegundos en el temporizador** |
| `ui.timer.showProgressBar` | Boolean | `true` | Mostrar barra de progreso |
| `ui.timer.glowEffect` | Boolean | `true` | **Efecto de brillo cuando está activo** |
| `ui.timer.autoStartNext` | Boolean | `false` | Auto-iniciar siguiente sesión |
| `ui.timer.confirmReset` | Boolean | `true` | Confirmar antes de reiniciar |

### **🔘 Configuraciones de Switches Interactivos**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `ui.switches.showCelebration` | Boolean | `true` | **Mostrar modal de celebración al completar todos** |
| `ui.switches.autoReset` | Boolean | `false` | Reinicio automático tras celebración |
| `ui.switches.confirmReset` | Boolean | `true` | Confirmar antes de reiniciar todos |
| `ui.switches.animationDelay` | Number | `100` | Delay entre animaciones de switches (ms) |

### **📝 Tipografía**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `ui.typography.scale` | Number | `1.0` | **Factor de escala para todo el texto** |
| `ui.typography.fontFamily` | String | `'system'` | Familia de fuente: `'system'`, `'custom'` |
| `ui.typography.lineHeight` | Number | `1.4` | Altura de línea |

---

## 🔊 **CONFIGURACIONES DE AUDIO**

### **🎵 Audio General**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `audio.enabled` | Boolean | `true` | **🔥 HABILITAR/DESHABILITAR TODO EL AUDIO** |
| `audio.volume` | Number | `0.8` | Volumen maestro (0.0 - 1.0) |
| `audio.fadeIn` | Boolean | `true` | Efecto fade in al reproducir |
| `audio.fadeOut` | Boolean | `true` | Efecto fade out al parar |
| `audio.overlap` | Boolean | `false` | Permitir múltiples sonidos simultáneos |

### **🎼 Sonidos Específicos**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `audio.sounds.timerComplete.enabled` | Boolean | `true` | **Sonido al completar temporizador** |
| `audio.sounds.timerComplete.volume` | Number | `0.9` | Volumen específico |
| `audio.sounds.timerStart.enabled` | Boolean | `true` | **Sonido al iniciar temporizador** |
| `audio.sounds.switchToggle.enabled` | Boolean | `true` | **Sonido al activar switch** |
| `audio.sounds.celebration.enabled` | Boolean | `true` | **Sonido de celebración épica** |
| `audio.sounds.buttonPress.enabled` | Boolean | `false` | Sonido al presionar botones |

---

## 📳 **CONFIGURACIONES DE HAPTICS (VIBRACIÓN)**

### **📱 Haptics General**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `haptics.enabled` | Boolean | `true` | **🔥 HABILITAR/DESHABILITAR TODA LA VIBRACIÓN** |
| `haptics.intensity` | String | `'medium'` | Intensidad general: `'light'`, `'medium'`, `'heavy'` |

### **🎯 Feedback Específico**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `haptics.feedback.buttonPress.enabled` | Boolean | `true` | **Vibración al presionar botones** |
| `haptics.feedback.buttonPress.type` | String | `'light'` | Tipo de vibración |
| `haptics.feedback.timerComplete.enabled` | Boolean | `true` | **Vibración al completar temporizador** |
| `haptics.feedback.timerComplete.type` | String | `'heavy'` | Intensidad |
| `haptics.feedback.timerComplete.pattern` | String | `'celebration'` | Patrón: `'single'`, `'double'`, `'celebration'` |
| `haptics.feedback.switchToggle.enabled` | Boolean | `true` | **Vibración al cambiar switches** |
| `haptics.feedback.navigation.enabled` | Boolean | `false` | Vibración al navegar (deshabilitado por defecto) |
| `haptics.feedback.error.enabled` | Boolean | `true` | **Vibración en errores** |

---

## ♿ **CONFIGURACIONES DE ACCESIBILIDAD**

### **🧠 Accesibilidad Cognitiva (TEA/TDAH)**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `accessibility.reduceAnimations` | Boolean | `false` | **🔥 Reducir animaciones para usuarios sensibles** |
| `accessibility.simplifiedUI` | Boolean | `false` | **Interfaz simplificada con menos elementos** |
| `accessibility.extendedTimeouts` | Boolean | `false` | **Más tiempo para interacciones** |
| `accessibility.slowAnimations` | Boolean | `false` | Animaciones más lentas |

### **👁️ Accesibilidad Visual**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `accessibility.highContrast` | Boolean | `false` | **Alto contraste para baja visión** |
| `accessibility.largeText` | Boolean | `false` | **Texto grande** |
| `accessibility.visualFeedback` | Boolean | `true` | Feedback visual para acciones |

### **🔘 Accesibilidad de Interacción**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `accessibility.largeButtons` | Boolean | `false` | **Botones más grandes** |
| `accessibility.buttonLabels` | Boolean | `true` | Etiquetas descriptivas en botones |
| `accessibility.confirmActions` | Boolean | `true` | **Confirmación para acciones importantes** |
| `accessibility.verbalFeedback` | Boolean | `false` | Feedback auditivo verbal |

---

## ⚡ **CONFIGURACIONES DE RENDIMIENTO**

### **🚀 Optimizaciones**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `performance.autoOptimize` | Boolean | `true` | **Optimización automática del rendimiento** |
| `performance.batteryOptimization` | Boolean | `true` | **Optimización de batería** |
| `performance.backgroundProcessing` | Boolean | `false` | Procesos en segundo plano |
| `performance.memoryOptimization` | Boolean | `true` | **Optimización de memoria** |
| `performance.imageOptimization` | Boolean | `true` | Optimización de imágenes |

### **🗂️ Caché**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `performance.cache.enabled` | Boolean | `true` | Sistema de caché habilitado |
| `performance.cache.maxSize` | Number | `50` | Tamaño máximo de caché (MB) |
| `performance.cache.ttl` | Number | `86400000` | Tiempo de vida del caché (ms) |

---

## 🔧 **CONFIGURACIONES DE DESARROLLO**

### **🐛 Debug**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `developer.debugMode` | Boolean | `false` | **Modo debug habilitado** |
| `developer.showPerformanceMetrics` | Boolean | `false` | Mostrar métricas de rendimiento |
| `developer.verboseLogging` | Boolean | `false` | Logging detallado |

### **📊 Logging**
| **Configuración** | **Tipo** | **Por Defecto** | **Descripción** |
|-------------------|----------|-----------------|-----------------|
| `developer.logging.level` | String | `'warn'` | Nivel de logging: `'debug'`, `'info'`, `'warn'`, `'error'` |
| `developer.logging.enabled` | Boolean | `true` | Sistema de logging habilitado |
| `developer.logging.logToFile` | Boolean | `false` | Guardar logs en archivo |

---

## 🎯 **PERFILES PREDEFINIDOS**

### **🔄 `default`** - Configuración estándar
- Todas las funciones habilitadas
- Experiencia completa con animaciones y efectos

### **🧩 `autism_friendly`** - Optimizado para TEA/TDAH
- ❌ **Animaciones deshabilitadas**
- ❌ **Efectos de brillo deshabilitados**
- ✅ **Confirmaciones habilitadas**
- ✅ **Interfaz simplificada**
- 🔇 **Audio y haptics reducidos**

### **🔇 `silent`** - Modo silencioso
- ❌ **Todo el audio deshabilitado**
- ❌ **Todas las vibraciones deshabilitadas**
- ✅ **Solo feedback visual**

### **⚡ `performance`** - Alto rendimiento
- ⚡ **Animaciones rápidas (150ms)**
- 🚀 **Todas las optimizaciones habilitadas**
- 🔋 **Optimización de batería activa**

---

## 🎮 **CÓMO USAR LAS CONFIGURACIONES**

### **📱 Desde la App:**
1. Ve a **"Configuración Avanzada"** desde el menú principal
2. Ajusta las opciones según tus preferencias
3. Los cambios se aplican **inmediatamente** y son **reactivos**
4. Se guardan **automáticamente** en AsyncStorage

### **🔥 Configuraciones MÁS IMPORTANTES:**
- **`audio.enabled`** - Controla TODO el audio de la app
- **`haptics.enabled`** - Controla TODA la vibración de la app  
- **`ui.animations.enabled`** - Controla TODAS las animaciones
- **`accessibility.reduceAnimations`** - Para usuarios sensibles al movimiento
- **`ui.timer.showMilliseconds`** - Precisión adicional en temporizador

---

**🎯 ¡Todas estas configuraciones son reactivas y se aplican instantáneamente en toda la aplicación!** 🚀

# InteractiveSwitches

Componente modular de switches interactivos con efecto glass para Damian App.

## Características

- **20 switches interactivos** que cambian de color al presionarlos
- **Efecto glass moderno** consistente con el diseño de DigitalTimer
- **Arquitectura modular** siguiendo las mejores prácticas de React Native
- **Animaciones suaves** y feedback visual inmediato
- **Colores aleatorios** para cada switch activado
- **Botón de reset** para volver todos los switches al estado inicial

## Estructura del Componente

```
InteractiveSwitches/
├── InteractiveSwitches.jsx    # Componente principal
├── hooks/
│   └── useSwitches.js         # Hook para manejo de estado
├── components/
│   ├── SwitchesHeader.jsx     # Header con contador y reset
│   └── SwitchesGrid.jsx       # Grid de switches interactivos
├── styles/
│   └── switchesStyles.js      # Estilos separados
└── index.js                   # Exportación principal
```

## Uso

El componente se renderiza automáticamente en el componente Main, debajo del DigitalTimer.

## Funcionalidades

### Estado de Switches
- Cada switch puede estar activo (con color) o inactivo (gris)
- Al activarse, se asigna un color aleatorio de una paleta predefinida
- Contador en tiempo real de switches activos

### Interacciones
- **Tap en switch**: Alterna entre activo/inactivo
- **Botón Reset**: Desactiva todos los switches
- **Animaciones**: Pulso suave al presionar cada switch

### Diseño Visual
- **Efecto glass**: Fondo semitransparente con bordes sutiles
- **Grid responsivo**: 5 switches por fila (4 filas = 20 total)
- **Sombras y elevación**: Profundidad visual moderna
- **Colores vibrantes**: Paleta de 10 colores para switches activos

## Integración

El componente está integrado en `components/Main.jsx` y se renderiza después del `DigitalTimer`, manteniendo la consistencia visual y la experiencia de usuario fluida.

## Versión

**v1.0.0** - Implementación inicial con arquitectura modular completa.

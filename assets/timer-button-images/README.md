# Timer Button Images

Esta carpeta contiene las imágenes utilizadas como fondo en el componente TimerToggleButton.

## Archivos actuales:

### `timer_background.png`
- **Origen:** Copiada desde `assets/pictogramas/esperar/esperar.png`
- **Uso:** Imagen de fondo para el componente TimerToggleButton
- **Propósito:** Proporcionar un fondo visual temático relacionado con temporizadores y espera

## Estructura recomendada:

```
timer-button-images/
├── timer_background.png      # Imagen principal de fondo
├── timer_icon.png           # Ícono opcional para el botón (futuro)
├── timer_overlay.png        # Overlay opcional (futuro)
└── README.md               # Este archivo
```

## Especificaciones de imágenes:

- **Formato recomendado:** PNG (para transparencia)
- **Resolución sugerida:** 400x240px o mayor
- **Proporción:** 5:3 (para coincidir con la altura duplicada del botón)
- **Estilo:** Imágenes relacionadas con temporizadores, relojes, o conceptos de tiempo

## Uso en el código:

```jsx
// En TimerToggleButton.jsx
<ImageBackground
  source={require('../../assets/timer-button-images/timer_background.png')}
  style={styles.backgroundImage}
  resizeMode="cover"
>
  {/* Contenido del botón */}
</ImageBackground>
```

## Notas:

- Las imágenes se mostrarán con opacidad reducida para mantener el efecto glass
- Se puede agregar un overlay oscuro para mejorar la legibilidad del contenido
- Esta carpeta está separada de `pictogramas` para organizar mejor los assets por funcionalidad

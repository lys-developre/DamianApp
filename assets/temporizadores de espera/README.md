# Imagen de fondo para TimerToggleButton

Esta carpeta contiene las imágenes de fondo para el componente TimerToggleButton.

## Archivo requerido:
- timer_background.png - Imagen de fondo para el botón del temporizador

## Especificaciones recomendadas:
- Resolución: 400x240 px (o mayor, manteniendo proporción 5:3)
- Formato: PNG (para transparencia) o JPG
- Estilo: Imagen relacionada con temporizadores o conceptos de espera
- Tonos: Preferiblemente colores suaves que no compitan con el texto blanco

La imagen se mostrará con 30% de opacidad para mantener la legibilidad del texto.

## Para activar la imagen de fondo:

1. **Coloca tu imagen** `timer_background.png` en esta carpeta
2. **Modifica el componente** `TimerToggleButton.jsx`:
   - Agrega `ImageBackground` al import de react-native
   - Reemplaza el `backgroundPlaceholder` con:
   ```jsx
   <ImageBackground
     source={require('../../assets/temporizadores de espera/timer_background.png')}
     style={styles.backgroundContainer}
     resizeMode="cover"
     imageStyle={{ borderRadius: 20, opacity: 0.3 }}
   >
     {/* contenido del botón */}
   </ImageBackground>
   ```

## Estado actual:
- ✅ Altura duplicada (240px)
- ✅ Estructura preparada para imagen de fondo
- 🟡 Usando placeholder azul suave hasta que se agregue imagen real

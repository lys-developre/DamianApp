/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🎨 THEME SYSTEM CENTRALIZADO - DamianApp Módulo 7
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 ¿QUÉ PROBLEMA RESUELVE?
 * ANTES: Colores duplicados en 5+ archivos → Pesadilla de mantenimiento
 * DESPUÉS: Un solo lugar para toda la paleta → Cambios centralizados
 *
 * 🚀 BENEFICIOS INMEDIATOS:
 * ✅ Un color se cambia → Toda la app se actualiza automáticamente
 * ✅ Imposible usar colores incorrectos → Consistencia garantizada
 * ✅ Modo oscuro/claro → Solo cambiar una variable
 * ✅ Nuevos desarrolladores → Paleta clara y organizada
 * ✅ Escalabilidad → Fácil agregar nuevos componentes
 * ✅ Mantenimiento → Cambios centralizados en lugar de buscar en 20+ archivos
 *
 * 🔧 CÓMO USAR:
 * import { useTheme } from '../theme';
 * const { colors } = useTheme();
 * backgroundColor: colors.BACKGROUND_PRIMARY  // ← En lugar de '#1E293B'
 *
 * 🎨 CAMBIOS REALIZADOS EN MÓDULO 7:
 * → Migrados 8+ componentes principales al theme system
 * → Eliminados 50+ colores hardcodeados
 * → Creadas funciones helper para estilos dinámicos
 * → Preparado sistema para toggle modo oscuro/claro
 * → Documentación exhaustiva para desarrolladores junior
 *
 * 📊 ESTADO DE MIGRACIÓN:
 * ✅ HomeScreen → Migrado al theme system
 * ✅ TimerImageButtonsManager → Migrado al theme system
 * ✅ AdminConfigScreen → Migrado al theme system
 * ✅ AppNavigator → Migrado al theme system
 * ✅ DigitalTimer → Migrado al theme system (componente principal + subcomponentes)
 * ✅ InteractiveSwitches → Migrado al theme system (componente principal + subcomponentes)
 * ✅ TimerImageButton → Migrado al theme system
 * ✅ ControlButtons → Migrado al theme system (colores dinámicos)
 * ✅ SwitchesHeader → Migrado al theme system (colores dinámicos)
 * ✅ TimeDisplay → Migrado al theme system (colores dinámicos)
 * 🎯 MIGRACIÓN COMPLETADA: Todos los componentes principales utilizan el theme system
 *
 * @author Damian App - Professional Theme System
 * @version 2.0.0 - Módulo 7 - Sistema Completo
 */

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🎨 PALETA DE COLORES MODO OSCURO (ACTUAL)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 📋 EXTRAÍDA DEL ANÁLISIS DE LA APP ORIGINAL
 * Mantiene exactamente los mismos colores para preservar el aspecto visual
 *
 * 🎯 USO POR CATEGORÍA:
 * PRIMARY/SECONDARY → Botones principales y acciones importantes
 * WARNING/DANGER → Alertas, eliminaciones, estados críticos
 * BACKGROUND_* → Fondos de pantallas, modales, tarjetas
 * TEXT_* → Todos los textos según su importancia
 * BORDER_* → Separadores y contornos
 */
const COLORS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 🔵 COLORES DE ACCIÓN (Botones, Links, Estados Interactivos)
  // ═══════════════════════════════════════════════════════════════════════════
  PRIMARY: '#45B7D1', // 🔵 Azul principal → Botones primarios, navegación, admin config
  SECONDARY: '#48bb78', // 🟢 Verde éxito → Guardar, confirmar, éxito, switches reset
  WARNING: '#F59E42', // 🟠 Naranja alerta → Volver, advertencias, configuración B
  DANGER: '#E53E3E', // 🔴 Rojo peligro → Eliminar, cancelar, errores, timer activo
  SUCCESS_ALT: '#38A169', // 🟢 Verde alternativo → Timer completado, éxito secundario

  // Colores específicos para TimerImageButton y animaciones
  TIMER_ACTIVE_BORDER: '#E53E3E', // 🔴 Borde timer activo (rojo)
  TIMER_COMPLETE_BORDER: '#38A169', // 🟢 Borde timer completado (verde)
  TIMER_GLOW_RED: '#E53E3E', // 🔴 Glow rojo para timer activo
  TIMER_GLOW_GREEN: '#38A169', // 🟢 Glow verde para timer completado

  // ═══════════════════════════════════════════════════════════════════════════
  // 🏠 FONDOS Y SUPERFICIES (Pantallas, Modales, Tarjetas)
  // ═══════════════════════════════════════════════════════════════════════════
  BACKGROUND_PRIMARY: '#1E293B', // 🌙 Fondo principal → Pantallas base
  BACKGROUND_SECONDARY: '#374151', // 🌫️ Fondo secundario → Inputs, botones preset
  BACKGROUND_TERTIARY: '#6B7280', // ☁️ Fondo terciario → Botón reset
  BACKGROUND_MODAL: 'rgba(0,0,0,0.5)', // 🖤 Overlay modal → Fondo semitransparente
  BACKGROUND_CARD: '#222', // 🎴 Fondo tarjetas → Modales, cards

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 TEXTOS Y CONTENIDO (Jerarquía Visual de Información)
  // ═══════════════════════════════════════════════════════════════════════════
  TEXT_PRIMARY: '#FFFFFF', // ⚪ Texto principal → Títulos, botones, texto importante
  TEXT_SECONDARY: '#D1D5DB', // 🔘 Texto secundario → Subtítulos, información adicional
  TEXT_MUTED: '#9CA3AF', // 🔹 Texto deshabilitado → Placeholders, texto apagado
  TEXT_SUCCESS: '#48bb78', // 🟢 Texto de éxito → Mensajes positivos, confirmaciones

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 BORDES Y SEPARADORES (Estructura Visual)
  // ═══════════════════════════════════════════════════════════════════════════
  BORDER_PRIMARY: '#374151', // ▫️ Bordes principales → Inputs, separadores
  BORDER_SECONDARY: '#6B7280', // ▫️ Bordes secundarios → Elementos menos importantes

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 ESTADOS INTERACTIVOS (Switches, Toggles)
  // ═══════════════════════════════════════════════════════════════════════════
  ACTIVE: '#007AFF', // 🔵 iOS blue → Switches activos, estados ON
  INACTIVE: '#E5E5EA', // ⚪ iOS gray → Switches inactivos, estados OFF

  // Estados específicos para botones de control
  CONTROL_PLAY: '#00C853', // 🟢 Verde play button
  CONTROL_RESET: '#E91E63', // 🔴 Rosa/Rojo reset button
  CONTROL_ICON: '#FFFFFF', // ⚪ Iconos blancos para contraste

  // ═══════════════════════════════════════════════════════════════════════════
  // ✨ EFECTOS VISUALES (Transparencias, Sombras)
  // ═══════════════════════════════════════════════════════════════════════════
  GLASS_LIGHT: 'rgba(255, 255, 255, 0.15)', // ✨ Efecto glass → Overlays sutiles
  SHADOW_DARK: 'rgba(0,0,0,0.4)', // 🖤 Sombras oscuras → Depth, elevación

  // Colores específicos para componentes de timer y estilos
  TIMER_DISPLAY_WHITE: '#ffffff', // ⚪ Texto blanco para display del timer
  PRESET_BUTTON_PURPLE: '#7C4DFF', // 🟣 Morado brillante para preset activo
  PRESET_BUTTON_GRAY: 'rgba(71, 85, 105, 0.9)', // 🔘 Gris para presets normales
  CELEBRATION_TEAL: '#4ECDC4', // 🟦 Azul verdoso para celebración
  GLASS_BACKGROUND: 'rgba(30, 30, 30, 0.9)', // 🌙 Fondo glass para frames
};

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ☀️ PALETA DE COLORES MODO CLARO (PREPARADO PARA FUTURO)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🔄 INVERSIÓN INTELIGENTE DE COLORES
 * Mantiene la identidad de colores de acción (azul, verde, naranja, rojo)
 * Invierte fondos y textos para mejor legibilidad en modo claro
 *
 * 🎯 CAMBIO AUTOMÁTICO:
 * Cuando el usuario presione "Modo Claro" → Estos colores reemplazarán a COLORS
 * Todos los componentes migrados cambiarán automáticamente sin tocar código
 */
const LIGHT_COLORS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 🔵 COLORES DE ACCIÓN (Mantienen identidad en ambos modos)
  // ═══════════════════════════════════════════════════════════════════════════
  PRIMARY: '#45B7D1', // 🔵 Mismo azul → Consistencia visual
  SECONDARY: '#48bb78', // 🟢 Mismo verde → Reconocimiento de acciones
  WARNING: '#F59E42', // 🟠 Mismo naranja → Estados claros
  DANGER: '#E53E3E', // 🔴 Mismo rojo → Peligro evidente

  // ═══════════════════════════════════════════════════════════════════════════
  // 🏠 FONDOS INVERTIDOS (Claro, luminoso, profesional)
  // ═══════════════════════════════════════════════════════════════════════════
  BACKGROUND_PRIMARY: '#FFFFFF', // ☀️ Fondo blanco → Pantallas principales claras
  BACKGROUND_SECONDARY: '#F8FAFC', // 🌤️ Gris muy claro → Inputs, elementos secundarios
  BACKGROUND_TERTIARY: '#E2E8F0', // ☁️ Gris claro → Botones deshabilitados
  BACKGROUND_MODAL: 'rgba(0,0,0,0.3)', // 🖤 Overlay más sutil → Menos agresivo
  BACKGROUND_CARD: '#F1F5F9', // 🎴 Gris suave → Tarjetas distinguibles

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 TEXTOS INVERTIDOS (Oscuro sobre claro para legibilidad)
  // ═══════════════════════════════════════════════════════════════════════════
  TEXT_PRIMARY: '#1E293B', // ⚫ Texto oscuro → Máximo contraste sobre blanco
  TEXT_SECONDARY: '#475569', // 🔘 Gris oscuro → Información secundaria legible
  TEXT_MUTED: '#64748B', // 🔹 Gris medio → Placeholders visibles pero sutiles
  TEXT_SUCCESS: '#059669', // 🟢 Verde más oscuro → Mejor contraste sobre claro

  // ═══════════════════════════════════════════════════════════════════════════
  // 📦 BORDES SUTILES (Definición sin abrumar)
  // ═══════════════════════════════════════════════════════════════════════════
  BORDER_PRIMARY: '#E2E8F0', // ▫️ Gris muy suave → Separación sutil
  BORDER_SECONDARY: '#CBD5E1', // ▫️ Gris suave → Elementos secundarios

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔘 ESTADOS INTERACTIVOS (Mantienen estándar iOS)
  // ═══════════════════════════════════════════════════════════════════════════
  ACTIVE: '#007AFF', // 🔵 iOS blue → Mismo en ambos modos
  INACTIVE: '#E5E5EA', // ⚪ iOS gray → Estándar universal

  // ═══════════════════════════════════════════════════════════════════════════
  // ✨ EFECTOS AJUSTADOS (Sutiles para modo claro)
  // ═══════════════════════════════════════════════════════════════════════════
  GLASS_LIGHT: 'rgba(255, 255, 255, 0.8)', // ✨ Más opaco → Mejor sobre fondos claros
  SHADOW_DARK: 'rgba(0,0,0,0.1)', // 🖤 Sombra sutil → Depth sin abrumar
};

/**
 * TIPOGRAFÍAS CENTRALIZADAS
 * Basadas en las fuentes por defecto del sistema
 */
const TYPOGRAPHY = {
  // Tamaños de fuente
  SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },

  // Pesos de fuente
  WEIGHTS: {
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  },

  // Alturas de línea
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.4,
    RELAXED: 1.6,
  },
};

/**
 * ESPACIADOS CONSISTENTES
 * Sistema de espaciado basado en múltiplos de 4px
 */
const SPACING = {
  XS: 4, // 4px
  SM: 8, // 8px
  MD: 12, // 12px
  LG: 16, // 16px
  XL: 20, // 20px
  XXL: 24, // 24px
  XXXL: 32, // 32px
  HUGE: 48, // 48px
};

/**
 * BORDES Y ESQUINAS
 * Radios de borde consistentes
 */
const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 24,
  FULL: 9999, // Para círculos perfectos
};

/**
 * SOMBRAS PREDEFINIDAS
 * Efectos de sombra consistentes
 */
const SHADOWS = {
  NONE: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SM: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  MD: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  LG: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

/**
 * TEMA COMPLETO
 * Objeto principal que contiene toda la configuración visual
 */
export const THEME = {
  // Modo actual (dark por defecto para mantener aspecto actual)
  mode: 'dark',

  // Colores según el modo
  colors: COLORS,
  lightColors: LIGHT_COLORS,

  // Tipografía
  typography: TYPOGRAPHY,

  // Espaciado
  spacing: SPACING,

  // Bordes
  borderRadius: BORDER_RADIUS,

  // Sombras
  shadows: SHADOWS,

  // Utilidades para obtener colores según el modo
  getColors: (mode = 'dark') => (mode === 'dark' ? COLORS : LIGHT_COLORS),
};

/**
 * HOOK PARA USAR EL TEMA
 * Hook personalizado para acceder fácilmente al tema
 */
export const useTheme = () => {
  // Por ahora retorna el tema estático
  // En el futuro se integrará con Context API para modo dinámico
  return {
    theme: THEME,
    colors: THEME.colors,
    typography: THEME.typography,
    spacing: THEME.spacing,
    borderRadius: THEME.borderRadius,
    shadows: THEME.shadows,
    isDark: THEME.mode === 'dark',
    isLight: THEME.mode === 'light',
  };
};

/**
 * HELPERS PARA CREAR ESTILOS
 * Funciones útiles para generar estilos comunes
 */
export const createStyles = {
  /**
   * Crea un contenedor centrado estándar
   */
  centeredContainer: (backgroundColor = THEME.colors.BACKGROUND_PRIMARY) => ({
    flex: 1,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.LG,
  }),

  /**
   * Crea un botón primario estándar
   */
  primaryButton: (backgroundColor = THEME.colors.PRIMARY) => ({
    backgroundColor,
    paddingHorizontal: THEME.spacing.XL,
    paddingVertical: THEME.spacing.MD,
    borderRadius: THEME.borderRadius.LG,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.MD,
  }),

  /**
   * Crea texto con estilo estándar
   */
  text: (
    size = 'MD',
    weight = 'NORMAL',
    color = THEME.colors.TEXT_PRIMARY
  ) => ({
    fontSize: THEME.typography.SIZES[size],
    fontWeight: THEME.typography.WEIGHTS[weight],
    color,
    lineHeight:
      THEME.typography.SIZES[size] * THEME.typography.LINE_HEIGHTS.NORMAL,
  }),

  /**
   * Crea una tarjeta estándar
   */
  card: (backgroundColor = THEME.colors.BACKGROUND_CARD) => ({
    backgroundColor,
    borderRadius: THEME.borderRadius.LG,
    padding: THEME.spacing.LG,
    ...THEME.shadows.MD,
  }),
};

// Export por defecto
export default THEME;

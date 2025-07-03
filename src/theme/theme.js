/**
 * Theme System Centralizado - DamianApp Módulo 7
 *
 * RESPONSABILIDADES:
 * - Definición de colores, tipografías y espaciados centralizados
 * - Sistema de modo oscuro/claro preparado
 * - Consistencia visual entre todos los componentes
 * - Fácil mantenimiento y escalabilidad
 *
 * PRINCIPIOS:
 * - Mantener aspecto visual actual
 * - Eliminar colores hardcodeados
 * - Preparar para futuras mejoras de accesibilidad
 * - Sistema modular y extensible
 *
 * @author Damian App
 * @version 1.0.0 - Módulo 7
 */

/**
 * PALETA DE COLORES ACTUAL (extraída del análisis de la app)
 * Mantiene exactamente los mismos colores para preservar el aspecto visual
 */
const COLORS = {
  // Colores principales (modo oscuro actual)
  PRIMARY: '#45B7D1', // Azul primario principal
  SECONDARY: '#48bb78', // Verde éxito/secundario
  WARNING: '#F59E42', // Naranja warning/accent
  DANGER: '#E53E3E', // Rojo peligro/eliminar

  // Fondos y superficies
  BACKGROUND_PRIMARY: '#1E293B', // Fondo principal (gris azulado oscuro)
  BACKGROUND_SECONDARY: '#374151', // Fondo secundario (gris medio)
  BACKGROUND_TERTIARY: '#6B7280', // Fondo terciario (gris claro)
  BACKGROUND_MODAL: 'rgba(0,0,0,0.5)', // Overlay de modales
  BACKGROUND_CARD: '#222', // Fondo de tarjetas

  // Texto y contenido
  TEXT_PRIMARY: '#FFFFFF', // Texto principal (blanco)
  TEXT_SECONDARY: '#D1D5DB', // Texto secundario (gris claro)
  TEXT_MUTED: '#9CA3AF', // Texto deshabilitado
  TEXT_SUCCESS: '#48bb78', // Texto de éxito

  // Bordes y divisores
  BORDER_PRIMARY: '#374151', // Bordes principales
  BORDER_SECONDARY: '#6B7280', // Bordes secundarios

  // Estados interactivos
  ACTIVE: '#007AFF', // iOS blue para switches activos
  INACTIVE: '#E5E5EA', // iOS gray para switches inactivos

  // Transparencias y overlays
  GLASS_LIGHT: 'rgba(255, 255, 255, 0.15)', // Efecto glass
  SHADOW_DARK: 'rgba(0,0,0,0.4)', // Sombras oscuras
};

/**
 * TEMA CLARO (preparado para futuro)
 * Invierte los colores manteniendo la misma estructura
 */
const LIGHT_COLORS = {
  // Colores principales mantienen su identidad
  PRIMARY: '#45B7D1',
  SECONDARY: '#48bb78',
  WARNING: '#F59E42',
  DANGER: '#E53E3E',

  // Fondos invertidos para modo claro
  BACKGROUND_PRIMARY: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F8FAFC',
  BACKGROUND_TERTIARY: '#E2E8F0',
  BACKGROUND_MODAL: 'rgba(0,0,0,0.3)',
  BACKGROUND_CARD: '#F1F5F9',

  // Texto invertido
  TEXT_PRIMARY: '#1E293B',
  TEXT_SECONDARY: '#475569',
  TEXT_MUTED: '#64748B',
  TEXT_SUCCESS: '#059669',

  // Bordes para modo claro
  BORDER_PRIMARY: '#E2E8F0',
  BORDER_SECONDARY: '#CBD5E1',

  // Estados mantienen colores iOS
  ACTIVE: '#007AFF',
  INACTIVE: '#E5E5EA',

  // Transparencias ajustadas
  GLASS_LIGHT: 'rgba(255, 255, 255, 0.8)',
  SHADOW_DARK: 'rgba(0,0,0,0.1)',
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

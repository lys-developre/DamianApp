/**
 * Configuración de Jest para testing - DamianApp
 *
 * Este archivo configura el entorno de testing para React Native con Expo
 * incluyendo mocks necesarios y configuración de librerías de testing.
 *
 * @author Damian App
 * @version 1.0.0
 */

// Importar matchers de testing-library (reemplaza jest-native deprecated)
import '@testing-library/react-native/extend-expect';

// Simulación de AsyncStorage para pruebas
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Simulación de React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Simulación de módulos de Audio y React Native
jest.mock('react-native-sound', () => {
  const mockSoundInstance = {
    play: jest.fn(callback => callback && callback(true)),
    setVolume: jest.fn(),
    release: jest.fn(),
  };

  const MockSound = jest.fn(() => mockSoundInstance);
  MockSound.setCategory = jest.fn();
  MockSound.MAIN_BUNDLE = 'MAIN_BUNDLE';

  return MockSound;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Simulación de React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Simulación de React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Simulación de react-native-confetti-cannon
jest.mock('react-native-confetti-cannon', () => 'ConfettiCannon');

// Configuración global de pruebas
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Configuración para pruebas de temporizadores
jest.useFakeTimers();

// Configuración para pruebas de fetch
global.fetch = jest.fn();

// Configuración para pruebas de React Native
// Simulación removida - era incompatible con RN 0.79.5

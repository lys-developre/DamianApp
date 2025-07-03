#!/usr/bin/env node
/**
 * 🧪 VERIFICACIÓN COMPLETA DE CONFIGURACIONES - DamianApp
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Script unificado para verificar todas las configuraciones avanzadas de la app.
 * Incluye verificación automática de archivos, configuraciones y guía manual.
 *
 * EJECUCIÓN:
 * node VERIFICACION_COMPLETA.js
 *
 * @author Damian App - QA Testing Suite
 * @version 1.0.0 - Verificación Unificada
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  BOLD: '\x1b[1m',
};

function log(message, color = COLORS.RESET) {
  console.warn(`${color}${message}${COLORS.RESET}`);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔍 FASE 1: VERIFICACIÓN DE ARCHIVOS CRÍTICOS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const CRITICAL_FILES = [
  'src/hooks/useConfig.js',
  'src/services/configService.js',
  'src/services/audioService.js',
  'src/services/hapticsService.js',
  'src/components/AdvancedConfigScreen/AdvancedConfigScreen.jsx',
  'src/config/appConfig.js',
  'src/context/AppContext.js',
];

function verifyFiles() {
  log('\n📁 FASE 1: VERIFICANDO ARCHIVOS CRÍTICOS...', COLORS.BLUE);
  log('═══════════════════════════════════════════════', COLORS.BLUE);

  let filesOk = 0;

  CRITICAL_FILES.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      log(`✅ ${file}`, COLORS.GREEN);
      filesOk++;
    } else {
      log(`❌ ${file} - NO ENCONTRADO`, COLORS.RED);
    }
  });

  const percentage = ((filesOk / CRITICAL_FILES.length) * 100).toFixed(1);
  log(
    `\n📊 Archivos: ${filesOk}/${CRITICAL_FILES.length} (${percentage}%)`,
    percentage >= 90 ? COLORS.GREEN : COLORS.RED
  );

  return filesOk;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 FASE 2: VERIFICACIÓN DE CONFIGURACIONES EN CÓDIGO
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const CONFIG_PATTERNS = [
  // Audio configurations
  {
    pattern: /audio:\s*\{[\s\S]*?enabled:\s*true/,
    name: 'Audio Master Config',
    critical: true,
  },
  {
    pattern: /audio:\s*\{[\s\S]*?volume:\s*[\d.]+/,
    name: 'Audio Volume Config',
  },
  { pattern: /audio:\s*\{[\s\S]*?sounds:/, name: 'Audio Sounds Config' },

  // Haptics configurations
  {
    pattern: /haptics:\s*\{[\s\S]*?enabled:\s*true/,
    name: 'Haptics Master Config',
    critical: true,
  },
  {
    pattern: /haptics:\s*\{[\s\S]*?intensity:\s*['"`]\w+['"`]/,
    name: 'Haptics Intensity Config',
  },
  {
    pattern: /haptics:\s*\{[\s\S]*?feedback:/,
    name: 'Haptics Feedback Config',
  },

  // UI configurations
  {
    pattern: /animations:\s*\{[\s\S]*?enabled:\s*true/,
    name: 'Animations Master Config',
    critical: true,
  },
  {
    pattern: /timer:\s*\{[\s\S]*?showMilliseconds:\s*false/,
    name: 'Timer Milliseconds Config',
    critical: true,
  },
  {
    pattern: /timer:\s*\{[\s\S]*?glowEffect:\s*true/,
    name: 'Timer Glow Effect Config',
    critical: true,
  },
  {
    pattern: /switches:\s*\{[\s\S]*?showCelebration:\s*true/,
    name: 'Switches Celebration Config',
    critical: true,
  },

  // Accessibility configurations
  {
    pattern: /accessibility:\s*\{[\s\S]*?reduceAnimations:\s*false/,
    name: 'Reduce Animations Config',
    critical: true,
  },
  {
    pattern: /accessibility:\s*\{[\s\S]*?simplifiedUI:\s*false/,
    name: 'Simplified UI Config',
    critical: true,
  },
  {
    pattern: /accessibility:\s*\{[\s\S]*?highContrast:\s*false/,
    name: 'High Contrast Config',
  },
  {
    pattern: /accessibility:\s*\{[\s\S]*?largeText:\s*false/,
    name: 'Large Text Config',
  },
];

function verifyConfigurations() {
  log('\n⚙️  FASE 2: VERIFICANDO CONFIGURACIONES EN CÓDIGO...', COLORS.BLUE);
  log('══════════════════════════════════════════════════════', COLORS.BLUE);

  const configFile = path.join(process.cwd(), 'src/config/appConfig.js');

  if (!fs.existsSync(configFile)) {
    log('❌ appConfig.js no encontrado', COLORS.RED);
    return 0;
  }

  const content = fs.readFileSync(configFile, 'utf8');
  let configsFound = 0;
  let criticalFound = 0;
  let totalCritical = CONFIG_PATTERNS.filter(p => p.critical).length;

  CONFIG_PATTERNS.forEach(config => {
    const found = config.pattern.test(content);
    const icon = config.critical ? '🔥' : '⚙️';

    if (found) {
      log(`${icon} ✅ ${config.name}`, COLORS.GREEN);
      configsFound++;
      if (config.critical) criticalFound++;
    } else {
      log(`${icon} ❌ ${config.name} - NO ENCONTRADO`, COLORS.RED);
    }
  });

  const percentage = ((configsFound / CONFIG_PATTERNS.length) * 100).toFixed(1);
  const criticalPercentage = ((criticalFound / totalCritical) * 100).toFixed(1);

  log(
    `\n📊 Configuraciones: ${configsFound}/${CONFIG_PATTERNS.length} (${percentage}%)`,
    percentage >= 90 ? COLORS.GREEN : COLORS.RED
  );
  log(
    `🔥 Críticas: ${criticalFound}/${totalCritical} (${criticalPercentage}%)`,
    criticalPercentage >= 90 ? COLORS.GREEN : COLORS.RED
  );

  return configsFound;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🪝 FASE 3: VERIFICACIÓN DE INTEGRACIÓN DE HOOKS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const HOOK_PATTERNS = [
  /useUIConfig/,
  /useAudioConfig/,
  /useHapticsConfig/,
  /useAccessibilityConfig/,
  /useConfig/,
  /useAppContext/, // Context que internamente usa configuración avanzada
];

const COMPONENTS_TO_CHECK = [
  'src/components/DigitalTimer/DigitalTimer.jsx',
  'src/components/DigitalTimer/components/CelebrationModal.jsx',
  'src/components/DigitalTimer/components/ControlButtons.jsx',
  'src/components/InteractiveSwitches/InteractiveSwitches.jsx',
  'src/components/AdvancedConfigScreen/AdvancedConfigScreen.jsx',
  'src/components/MainButtons/MainButton.jsx',
  'src/components/TimerImageButtons/TimerImageButton.jsx',
];

function verifyHookIntegration() {
  log('\n🪝 FASE 3: VERIFICANDO INTEGRACIÓN DE HOOKS...', COLORS.BLUE);
  log('═══════════════════════════════════════════════════════', COLORS.BLUE);

  let integratedComponents = 0;

  COMPONENTS_TO_CHECK.forEach(componentPath => {
    const fullPath = path.join(process.cwd(), componentPath);
    const fileName = path.basename(componentPath);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasConfigHooks = HOOK_PATTERNS.some(pattern =>
        pattern.test(content)
      );

      if (hasConfigHooks) {
        log(`✅ ${fileName} - INTEGRADO`, COLORS.GREEN);
        integratedComponents++;
      } else {
        log(`⚠️  ${fileName} - SIN HOOKS DE CONFIG`, COLORS.YELLOW);
      }
    } else {
      log(`❌ ${fileName} - NO ENCONTRADO`, COLORS.RED);
    }
  });

  const percentage = (
    (integratedComponents / COMPONENTS_TO_CHECK.length) *
    100
  ).toFixed(1);
  log(
    `\n📊 Componentes integrados: ${integratedComponents}/${COMPONENTS_TO_CHECK.length} (${percentage}%)`,
    percentage >= 80 ? COLORS.GREEN : COLORS.YELLOW
  );

  return integratedComponents;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔧 FASE 4: VERIFICACIÓN DE SERVICIOS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

function verifyServices() {
  log('\n🔧 FASE 4: VERIFICANDO SERVICIOS...', COLORS.BLUE);
  log('═══════════════════════════════════════════', COLORS.BLUE);

  const services = [
    { file: 'src/services/audioService.js', name: 'Audio Service' },
    { file: 'src/services/hapticsService.js', name: 'Haptics Service' },
    { file: 'src/services/configService.js', name: 'Config Service' },
  ];

  let servicesOk = 0;

  services.forEach(service => {
    const fullPath = path.join(process.cwd(), service.file);

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const readsConfig = /AsyncStorage|configService/.test(content);

      if (readsConfig) {
        log(`✅ ${service.name} - LEE CONFIGURACIÓN`, COLORS.GREEN);
        servicesOk++;
      } else {
        log(`⚠️  ${service.name} - NO LEE CONFIGURACIÓN`, COLORS.YELLOW);
      }
    } else {
      log(`❌ ${service.name} - NO ENCONTRADO`, COLORS.RED);
    }
  });

  const percentage = ((servicesOk / services.length) * 100).toFixed(1);
  log(
    `\n📊 Servicios OK: ${servicesOk}/${services.length} (${percentage}%)`,
    percentage >= 90 ? COLORS.GREEN : COLORS.YELLOW
  );

  return servicesOk;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎯 REPORTE FINAL
 * ═══════════════════════════════════════════════════════════════════════════════
 */

function generateFinalReport(results) {
  log('\n' + '═'.repeat(80), COLORS.MAGENTA);
  log('🎯 REPORTE FINAL DE VERIFICACIÓN AUTOMÁTICA', COLORS.MAGENTA);
  log('═'.repeat(80), COLORS.MAGENTA);

  const { files, configs, hooks, services } = results;
  const totalPoints =
    files.current + configs.current + hooks.current + services.current;
  const maxPoints = files.max + configs.max + hooks.max + services.max;
  const finalPercentage = ((totalPoints / maxPoints) * 100).toFixed(1);

  log(
    `📁 Archivos críticos: ${files.current}/${files.max} (${files.score}%)`,
    files.score >= 90 ? COLORS.GREEN : COLORS.RED
  );
  log(
    `⚙️  Configuraciones: ${configs.current}/${configs.max} (${configs.score}%)`,
    configs.score >= 90 ? COLORS.GREEN : COLORS.RED
  );
  log(
    `🪝 Hooks integrados: ${hooks.current}/${hooks.max} (${hooks.score}%)`,
    hooks.score >= 80 ? COLORS.GREEN : COLORS.YELLOW
  );
  log(
    `🔧 Servicios: ${services.current}/${services.max} (${services.score}%)`,
    services.score >= 90 ? COLORS.GREEN : COLORS.YELLOW
  );

  log(
    `\n📊 PUNTUACIÓN FINAL: ${finalPercentage}%`,
    finalPercentage >= 90
      ? COLORS.GREEN
      : finalPercentage >= 70
        ? COLORS.YELLOW
        : COLORS.RED
  );

  // Clasificación final
  if (finalPercentage >= 95) {
    log(
      '\n🏆 RESULTADO: EXCELENTE - Sistema listo para producción',
      COLORS.GREEN
    );
    log(
      '   ✅ Todas las configuraciones están implementadas correctamente',
      COLORS.GREEN
    );
    log(
      '   ✅ Proceder con verificación manual para certificar funcionamiento',
      COLORS.GREEN
    );
  } else if (finalPercentage >= 80) {
    log('\n⚠️  RESULTADO: BUENO - Requiere revisión menor', COLORS.YELLOW);
    log('   ⚙️  Algunas configuraciones necesitan atención', COLORS.YELLOW);
    log('   🔧 Revisar elementos marcados en rojo/amarillo', COLORS.YELLOW);
  } else {
    log('\n🚨 RESULTADO: CRÍTICO - Requiere corrección inmediata', COLORS.RED);
    log('   ❌ Múltiples configuraciones faltantes o incorrectas', COLORS.RED);
    log('   🛠️  No proceder hasta corregir problemas críticos', COLORS.RED);
  }

  return finalPercentage;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📋 GUÍA DE VERIFICACIÓN MANUAL
 * ═══════════════════════════════════════════════════════════════════════════════
 */

function showManualTestingGuide() {
  log('\n' + '═'.repeat(80), COLORS.CYAN);
  log('📋 GUÍA DE VERIFICACIÓN MANUAL', COLORS.CYAN);
  log('═'.repeat(80), COLORS.CYAN);

  const manualTests = [
    {
      title: '🔥 AUDIO MASTER',
      steps: [
        'Ir a Configuración Avanzada → Audio → Habilitar Audio',
        'DESACTIVAR audio',
        'Ir a temporizador, configurar 5 segundos e iniciar',
        'VERIFICAR: Al completar NO debe sonar audio',
        'REACTIVAR audio y repetir',
        'VERIFICAR: Al completar SÍ debe sonar audio',
      ],
    },
    {
      title: '📳 HAPTICS MASTER',
      steps: [
        'Ir a Configuración Avanzada → Haptics → Habilitar Vibraciones',
        'DESACTIVAR vibraciones',
        'Presionar cualquier botón',
        'VERIFICAR: NO debe vibrar',
        'REACTIVAR vibraciones y presionar botón',
        'VERIFICAR: SÍ debe vibrar',
      ],
    },
    {
      title: '🎬 ANIMACIONES MASTER',
      steps: [
        'Ir a Configuración Avanzada → UI → Animaciones → Habilitar',
        'DESACTIVAR animaciones',
        'Ir a Switches Interactivos y activar un switch',
        'VERIFICAR: Cambio instantáneo sin animación',
        'REACTIVAR animaciones y activar otro switch',
        'VERIFICAR: Animación suave',
      ],
    },
    {
      title: '⏱️ MILISEGUNDOS TIMER',
      steps: [
        'Ir a Configuración Avanzada → UI → Timer → Mostrar Milisegundos',
        'ACTIVAR mostrar milisegundos',
        'Ir a temporizador',
        'VERIFICAR: Display muestra formato "MM:SS.mmm"',
        'DESACTIVAR mostrar milisegundos',
        'VERIFICAR: Display muestra formato "MM:SS"',
      ],
    },
    {
      title: '✨ EFECTO GLOW',
      steps: [
        'Ir a Configuración Avanzada → UI → Timer → Efecto Glow',
        'ACTIVAR efecto glow',
        'Ir a temporizador e iniciar',
        'VERIFICAR: Timer tiene efecto de brillo/resplandor',
        'DESACTIVAR efecto glow y reiniciar timer',
        'VERIFICAR: Timer sin efecto de brillo',
      ],
    },
    {
      title: '🎉 CELEBRACIÓN SWITCHES',
      steps: [
        'Ir a Configuración Avanzada → UI → Switches → Mostrar Celebración',
        'ACTIVAR celebración',
        'Ir a Switches Interactivos y activar todos los switches',
        'VERIFICAR: Aparece modal de celebración con confetti',
        'Resetear switches, DESACTIVAR celebración y activar todos',
        'VERIFICAR: NO aparece modal de celebración',
      ],
    },
  ];

  manualTests.forEach((test, index) => {
    log(`\n${index + 1}. ${test.title}`, COLORS.BOLD);
    test.steps.forEach((step, stepIndex) => {
      log(`   ${stepIndex + 1}. ${step}`, COLORS.CYAN);
    });
  });

  log('\n📝 INSTRUCCIONES:', COLORS.YELLOW);
  log('   • Ejecutar cada prueba en orden', COLORS.YELLOW);
  log('   • Marcar ✅ o ❌ según funcione', COLORS.YELLOW);
  log('   • Documentar cualquier problema encontrado', COLORS.YELLOW);
  log('   • Solo certificar si TODAS las pruebas pasan', COLORS.YELLOW);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 FUNCIÓN PRINCIPAL
 * ═══════════════════════════════════════════════════════════════════════════════
 */

async function main() {
  log(
    '🧪 VERIFICACIÓN COMPLETA DE CONFIGURACIONES AVANZADAS - DamianApp',
    COLORS.MAGENTA
  );
  log('═'.repeat(80), COLORS.MAGENTA);
  log(
    'Verificando implementación completa del sistema de configuración...',
    COLORS.CYAN
  );

  // Ejecutar todas las fases de verificación
  const filesResult = verifyFiles();
  const configsResult = verifyConfigurations();
  const hooksResult = verifyHookIntegration();
  const servicesResult = verifyServices();

  // Calcular resultados
  const results = {
    files: {
      current: filesResult,
      max: CRITICAL_FILES.length,
      score: ((filesResult / CRITICAL_FILES.length) * 100).toFixed(1),
    },
    configs: {
      current: configsResult,
      max: CONFIG_PATTERNS.length,
      score: ((configsResult / CONFIG_PATTERNS.length) * 100).toFixed(1),
    },
    hooks: {
      current: hooksResult,
      max: COMPONENTS_TO_CHECK.length,
      score: ((hooksResult / COMPONENTS_TO_CHECK.length) * 100).toFixed(1),
    },
    services: {
      current: servicesResult,
      max: 3,
      score: ((servicesResult / 3) * 100).toFixed(1),
    },
  };

  // Generar reporte final
  const finalScore = generateFinalReport(results);

  // Mostrar guía manual si el sistema está listo
  if (finalScore >= 80) {
    showManualTestingGuide();

    log('\n💡 PRÓXIMOS PASOS:', COLORS.YELLOW);
    log(
      '   1. Ejecutar verificación manual siguiendo la guía anterior',
      COLORS.YELLOW
    );
    log('   2. Probar cada configuración en la app real', COLORS.YELLOW);
    log('   3. Documentar resultados', COLORS.YELLOW);
    log('   4. Certificar sistema 100% funcional', COLORS.YELLOW);
  } else {
    log('\n🛠️  ACCIONES REQUERIDAS:', COLORS.RED);
    log('   1. Corregir elementos marcados en rojo', COLORS.RED);
    log('   2. Re-ejecutar verificación automática', COLORS.RED);
    log('   3. Solo proceder a manual cuando automática >= 80%', COLORS.RED);
  }

  log('\n' + '═'.repeat(80), COLORS.MAGENTA);
}

// Ejecutar verificación
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  main,
  verifyFiles,
  verifyConfigurations,
  verifyHookIntegration,
  verifyServices,
};

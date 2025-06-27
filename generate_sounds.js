/* eslint-env node */
/* global Buffer, __dirname */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/**
 * Generador de sonidos para personas con TEA
 * Crea archivos WAV de alta calidad optimizados para Android
 */

// Función para generar un tono puro
function generateTone(frequency, duration, sampleRate = 44100) {
  const samples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(samples * 2); // 16-bit samples

  for (let i = 0; i < samples; i++) {
    // Generar onda senoidal con envelope suave para evitar clicks
    const envelope = Math.min(
      1,
      Math.min(i / (sampleRate * 0.01), (samples - i) / (sampleRate * 0.01))
    );
    const sample =
      Math.sin((2 * Math.PI * frequency * i) / sampleRate) * envelope * 0.3;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, i * 2);
  }

  return buffer;
}

// Función para crear header WAV
function createWAVHeader(dataLength, sampleRate = 44100) {
  const header = Buffer.alloc(44);

  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // chunk size
  header.writeUInt16LE(1, 20); // audio format (PCM)
  header.writeUInt16LE(1, 22); // num channels (mono)
  header.writeUInt32LE(sampleRate, 24); // sample rate
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}

// Función para crear archivo WAV completo
function createWAVFile(audioData, filename) {
  const header = createWAVHeader(audioData.length);
  const wavFile = Buffer.concat([header, audioData]);
  fs.writeFileSync(filename, wavFile);
  console.log(`✅ Creado: ${path.basename(filename)}`);
}

// Crear directorio de sonidos si no existe
const soundsDir = path.join(__dirname, 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

console.log('🎵 Generando archivos WAV para TEA...\n');

try {
  // 1. Notification Soft - Tono suave 400Hz, 800ms
  console.log('Generando notification_soft...');
  const notificationData = generateTone(400, 0.8);
  createWAVFile(
    notificationData,
    path.join(soundsDir, 'notification_soft.wav')
  );

  // 2. Almost Done - Tono progresivo 300-500Hz, 1 segundo
  console.log('Generando almost_done...');
  const almostDoneDuration = 1.0;
  const almostDoneSamples = Math.floor(44100 * almostDoneDuration);
  const almostDoneData = Buffer.alloc(almostDoneSamples * 2);

  for (let i = 0; i < almostDoneSamples; i++) {
    const progress = i / almostDoneSamples;
    const frequency = 300 + progress * 200; // 300Hz -> 500Hz
    const envelope = Math.min(
      1,
      Math.min(i / (44100 * 0.02), (almostDoneSamples - i) / (44100 * 0.02))
    );

    const sample =
      Math.sin((2 * Math.PI * frequency * i) / 44100) * envelope * 0.3;
    const intSample = Math.floor(sample * 32767);
    almostDoneData.writeInt16LE(intSample, i * 2);
  }
  createWAVFile(almostDoneData, path.join(soundsDir, 'almost_done.wav'));

  // 2.5. Phrase Change - Secuencia ascendente llamativa para cambio de frases
  console.log('Generando phrase_change...');
  const phraseChangeDuration = 0.6; // Corto pero memorable
  const phraseChangeSamples = Math.floor(44100 * phraseChangeDuration);
  const phraseChangeData = Buffer.alloc(phraseChangeSamples * 2);

  for (let i = 0; i < phraseChangeSamples; i++) {
    const time = i / 44100;
    const progress = time / phraseChangeDuration;

    // Envelope rápido con fade in/out
    const envelope = Math.min(
      1,
      Math.min(i / (44100 * 0.05), (phraseChangeSamples - i) / (44100 * 0.1))
    );

    // Secuencia de 4 tonos ascendentes con timing preciso
    let frequency;
    let noteIntensity = 1.0;

    if (progress < 0.25) {
      // Nota 1: Do (C5) - 523.25 Hz
      frequency = 523.25;
      noteIntensity = 0.8;
    } else if (progress < 0.5) {
      // Nota 2: Mi (E5) - 659.25 Hz
      frequency = 659.25;
      noteIntensity = 0.9;
    } else if (progress < 0.75) {
      // Nota 3: Sol (G5) - 783.99 Hz
      frequency = 783.99;
      noteIntensity = 1.0;
    } else {
      // Nota 4: Do alto (C6) - 1046.50 Hz - Brillo final
      frequency = 1046.5;
      noteIntensity = 1.1;
    }

    // Efecto de campanilla con armónicos suaves
    const fundamental = Math.sin(2 * Math.PI * frequency * time);
    const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.3;
    const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * time) * 0.15;

    // Modulación sutil para dar "brillo"
    const sparkle = Math.sin(2 * Math.PI * frequency * 4 * time) * 0.1;

    const sample =
      (fundamental + harmonic2 + harmonic3 + sparkle) *
      envelope *
      noteIntensity *
      0.4; // Volumen controlado

    const intSample = Math.floor(sample * 32767);
    phraseChangeData.writeInt16LE(intSample, i * 2);
  }
  createWAVFile(phraseChangeData, path.join(soundsDir, 'phrase_change.wav'));

  // 3. Celebration Epic - Secuencia épica de triunfo con progresión de acordes
  console.log('Generando celebration_epic...');
  const celebrationDuration = 3.0; // Aumentado a 3 segundos para más épica
  const celebrationSamples = Math.floor(44100 * celebrationDuration);
  const celebrationData = Buffer.alloc(celebrationSamples * 2);

  for (let i = 0; i < celebrationSamples; i++) {
    const time = i / 44100;
    const progress = time / celebrationDuration;

    // Envelope más dinámico con múltiples picos
    let envelope = Math.min(
      1,
      Math.min(i / (44100 * 0.05), (celebrationSamples - i) / (44100 * 0.1))
    );

    // Añadir pulsaciones épicas que se intensifican
    const epicPulse = Math.sin(2 * Math.PI * 4 * time) * 0.3 * progress + 0.7;
    envelope *= epicPulse;

    // Progresión de acordes épica: C Major -> F Major -> G Major -> C Major
    let chord1, chord2, chord3, bass;

    if (progress < 0.25) {
      // C Major (C-E-G) - Inicio triunfal
      chord1 = Math.sin(2 * Math.PI * 523.25 * time); // C5
      chord2 = Math.sin(2 * Math.PI * 659.25 * time); // E5
      chord3 = Math.sin(2 * Math.PI * 783.99 * time); // G5
      bass = Math.sin(2 * Math.PI * 261.63 * time); // C4 (octava baja)
    } else if (progress < 0.5) {
      // F Major (F-A-C) - Elevación dramática
      chord1 = Math.sin(2 * Math.PI * 698.46 * time); // F5
      chord2 = Math.sin(2 * Math.PI * 880.0 * time); // A5
      chord3 = Math.sin(2 * Math.PI * 1046.5 * time); // C6
      bass = Math.sin(2 * Math.PI * 349.23 * time); // F4
    } else if (progress < 0.75) {
      // G Major (G-B-D) - Clímax épico
      chord1 = Math.sin(2 * Math.PI * 783.99 * time); // G5
      chord2 = Math.sin(2 * Math.PI * 987.77 * time); // B5
      chord3 = Math.sin(2 * Math.PI * 1174.66 * time); // D6
      bass = Math.sin(2 * Math.PI * 392.0 * time); // G4
    } else {
      // C Major final - Resolución victoriosa con armónicos
      chord1 = Math.sin(2 * Math.PI * 523.25 * time); // C5
      chord2 = Math.sin(2 * Math.PI * 659.25 * time); // E5
      chord3 = Math.sin(2 * Math.PI * 783.99 * time); // G5
      bass = Math.sin(2 * Math.PI * 261.63 * time); // C4

      // Agregar octava alta para mayor brillo en el final
      const highC = Math.sin(2 * Math.PI * 1046.5 * time); // C6
      chord3 += highC * 0.4;
    }

    // Ritmo épico que se acelera hacia el final
    const tempoMultiplier = 1 + progress * 2; // Se acelera gradualmente
    const epicRhythm =
      Math.sin(2 * Math.PI * 3 * tempoMultiplier * time) * 0.2 + 0.8;

    // Combinar todos los elementos con volúmenes balanceados
    const sample =
      (bass * 0.4 + // Línea de bajo sólida
        chord1 * 0.8 + // Melodía principal
        chord2 * 0.6 + // Armonía media
        chord3 * 0.5) * // Armonía alta
      envelope *
      epicRhythm *
      0.25; // Volumen final controlado

    const intSample = Math.floor(sample * 32767);
    celebrationData.writeInt16LE(intSample, i * 2);
  }
  createWAVFile(celebrationData, path.join(soundsDir, 'celebration_epic.wav'));

  console.log('\n✅ Todos los archivos WAV generados correctamente!');
  console.log('\n📝 Archivos creados:');
  console.log('   - notification_soft.wav (tono suave 400Hz)');
  console.log('   - almost_done.wav (tono progresivo 300-500Hz)');
  console.log('   - phrase_change.wav (secuencia ascendente C-E-G-C, 0.6s)');
  console.log('   - celebration_epic.wav (progresión épica C-F-G-C, 3.0s)');
  console.log('\n🎵 Phrase Change Features:');
  console.log('   • Secuencia de 4 notas ascendentes: C5 → E5 → G5 → C6');
  console.log('   • Duración corta pero memorable (0.6 segundos)');
  console.log('   • Armónicos suaves para efecto "campanilla"');
  console.log('   • Intensidad creciente para captar atención');
  console.log('   • Optimizado para transiciones suaves entre frases');
  console.log('\n🎵 Celebration Epic Features:');
  console.log(
    '   • Progresión de acordes dramática: C Major → F Major → G Major → C Major'
  );
  console.log('   • Línea de bajo sólida con armonías en capas');
  console.log('   • Ritmo que se acelera gradualmente');
  console.log('   • Pulsaciones épicas que se intensifican');
  console.log('   • Octava alta final para máximo brillo');
  console.log('\n🔄 Sistema optimizado para máximo impacto emocional en TEA!');
} catch (error) {
  console.error('❌ Error generando archivos:', error);
}

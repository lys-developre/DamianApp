/* eslint-env node */
/* global Buffer, __dirname */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/**
 * Generador de sonidos para personas con TEA
 * Crea archivos WAV que serán convertidos a MP3
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

  // 3. Celebration Epic - Secuencia de acordes alegres (C-E-G, 2 segundos)
  console.log('Generando celebration_epic...');
  const celebrationDuration = 2.0;
  const celebrationSamples = Math.floor(44100 * celebrationDuration);
  const celebrationData = Buffer.alloc(celebrationSamples * 2);

  for (let i = 0; i < celebrationSamples; i++) {
    const time = i / 44100;
    const envelope = Math.min(
      1,
      Math.min(i / (44100 * 0.02), (celebrationSamples - i) / (44100 * 0.02))
    );

    // Acorde C-E-G con ritmo
    const rhythm = Math.sin(2 * Math.PI * 2 * time) * 0.1 + 0.9; // Ritmo suave
    const c = Math.sin(2 * Math.PI * 523.25 * time); // C5
    const e = Math.sin(2 * Math.PI * 659.25 * time); // E5
    const g = Math.sin(2 * Math.PI * 783.99 * time); // G5

    const sample = (c + e * 0.8 + g * 0.6) * envelope * rhythm * 0.2;
    const intSample = Math.floor(sample * 32767);
    celebrationData.writeInt16LE(intSample, i * 2);
  }
  createWAVFile(celebrationData, path.join(soundsDir, 'celebration_epic.wav'));

  console.log('\n✅ Todos los archivos WAV generados correctamente!');
  console.log('\n📝 Archivos creados:');
  console.log('   - notification_soft.wav (tono suave 400Hz)');
  console.log('   - almost_done.wav (tono progresivo 300-500Hz)');
  console.log('   - celebration_epic.wav (acorde C-E-G)');
  console.log('\n🔄 Ahora convirtiendo a MP3...');
} catch (error) {
  console.error('❌ Error generando archivos:', error);
}

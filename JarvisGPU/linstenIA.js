const { exec } = require('child_process');
const speech = require('@google-cloud/speech');
const cerebro = require('./ExecutePredictionOSNPLCPU.js');
const fs = require('fs')
// Crea un cliente de Speech
const client = new speech.SpeechClient();
// Comienza a capturar el audio desde el micrófono
exec('arecord --format=S16_LE --duration=5 --rate=16000 --file-type=wav audio.wav', (error) => {
  if (error) {
    console.error(`Error al capturar el audio: ${error}`);
    return;
  }

  // Lee el archivo de audio capturado
  fs.readFile('audio.wav', (err, audioFile) => {
    if (err) {
      console.error(`Error al leer el archivo de audio: ${err}`);
      return;
    }
    quickstart(audioFile)

  });
});

async function quickstart(file) {
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: file,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'es-CO',
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };
  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  response.results.forEach((result) => {
    result.alternatives.forEach((alternative) => {
      console.log(`Transcript: ${alternative.transcript}`);
      logicOs(alternative.transcript);
    });
  });
}

async function logicOs(text) {
  cerebro(text);
}
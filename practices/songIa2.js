const speech = require('@google-cloud/speech');
const fs = require('fs')

// Crea un cliente de Speech
const client = new speech.SpeechClient();

// El archivo de audio a procesar
const fileName = './HolaMundo.wav';

// Lee el archivo de audio y lo convierte en una matriz de bytes
const file = fs.readFileSync(fileName);

// Configura la solicitud de reconocimiento de voz
const audio = {
  content: file,
};
const config = {
  encoding: 'WAV',
  sampleRateHertz: 44100,
  languageCode: 'es-CO',
  audioChannelCount: 2,
};
const request = {
  audio: audio,
  config: config,
};
console.log(request);
// Envía la solicitud y procesa la respuesta
client.recognize(request)
  .then(data => {
    console.log(data);
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcription)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

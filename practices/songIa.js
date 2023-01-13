const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const { exec } = require('child_process');
const fs = require('fs')

// Comienza a capturar el audio desde el micrófono
exec('arecord --format=S16_LE --duration=10 --rate=16000 --file-type=raw audio.raw', (error) => {
  if (error) {
    console.error(`Error al capturar el audio: ${error}`);
    return;
  }

  // Lee el archivo de audio capturado
  fs.readFile('audio.raw', async (err, audio) => {
    if (err) {
      console.error(`Error al leer el archivo de audio: ${err}`);
      return;
    }

    // The path to the remote LINEAR16 file stored in Google Cloud Storage
    console.log(audio.toString('base64'));
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    console.log(gcsUri);

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audioFile = {
      uri: audio.toString('base64'),
    };
    const config = {
      encoding: 'WAV',
      sampleRateHertz: 16000,
      languageCode: 'eu-ES',
      enableWordTimeOffsets: true,
    };
    const request = {
      audio: audio.toString('base64'),
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    response.results.forEach((result) => {
      result.alternatives.forEach((alternative) => {
        console.log(`Transcript: ${alternative.transcript}`);
        console.log(`Word details:`);
        console.log(` Word count ${alternative.words.length}`);
        alternative.words.forEach((item) => {
          console.log(`  ${item.word}`);
          const s = parseInt(item.startTime.seconds) +
            item.startTime.nanos / 1000000000;
          console.log(`   WordStartTime: ${s}s`);
          const e = parseInt(item.endTime.seconds) +
            item.endTime.nanos / 1000000000;
          console.log(`   WordEndTime: ${e}s`);
        });
      });
    });
  });
});
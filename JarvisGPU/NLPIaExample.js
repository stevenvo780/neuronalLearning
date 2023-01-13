const tf = require('@tensorflow/tfjs');

const entrain = async () => {
  // Define los datos de entrada y salida
  const inputText = [
    'Hola como estas',
    'Bien y tu',
    'Estoy bien gracias',
    '¿Qué planes tienes para hoy?',
    'Voy a ir al gimnasio y luego a hacer compras',
    'Genial, diviértete'
  ];
  const outputText = [
    'Bien y tu',
    'Estoy bien gracias',
    '¿Qué planes tienes para hoy?',
    'Voy a ir al gimnasio y luego a hacer compras',
    'Genial, diviértete',
    'Nada, solo descansar'
  ];

  // Tokeniza el texto en secuencias de tamaño "seqLen"
  const seqLen = 3;
  const inputSeq = [];
  const outputSeq = [];
  for (let i = 0; i < inputText.length; i++) {
    const inputWords = inputText[i].split(' ');
    const outputWords = outputText[i].split(' ');
    for (let j = 0; j < inputWords.length - (seqLen - 1); j++) {
      inputSeq.push(inputWords.slice(j, j + seqLen));
      outputSeq.push(outputWords.slice(j, j + seqLen));
    }
  }

  // Crea el diccionario de tokens
  const tokens = new Set(inputSeq.concat(outputSeq).flat());
  const tokenDict = {};
  for (const [i, token] of tokens.entries()) {
    tokenDict[token] = i + 1;
  }

  // Convierte el texto en secuencias de tokens
  const inputSeqTokens = inputSeq.map(seq => seq.map(token => tokenDict[token]));
  const outputSeqTokens = outputSeq.map(seq => seq.map(token => tokenDict[token]));

  // Crea los tensores de entrada y salida
  const inputTensor = tf.tensor2d(inputSeqTokens, [inputSeqTokens.length, inputSeqTokens[0].length]);
  const outputTensor = tf.tensor2d(outputSeqTokens, [outputSeqTokens.length, outputSeqTokens[0].length]);

  // Define el modelo
  const model = tf.sequential();

  model.add(tf.layers.embedding({
    inputDim: tokens.size,
    outputDim: 32,
  }));
  model.add(tf.layers.lstm({ units: 32 }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  // Entrena el modelo
  const history = await model.fit(inputTensor, outputTensor, {
    epochs: 10,
  });

  console.log(history);
};

/*
// Usa el modelo para hacer predicciones
const input = '¿Qué planes tienes para hoy?';
const inputWords = input.split(' ');
const inputSeqTokens = [];
for (let i = 0; i < inputWords.length - (seqLen - 1); i++) {
  inputSeqTokens.push(inputWords.slice(i, i + seqLen));
}
const inputTensor = tf.tensor2d(inputSeqTokens.map(seq => seq.map(token => tokenDict[token])), [inputSeqTokens.length, inputSeqTokens[0].length]);
const outputTensor = model.predict(inputTensor);
const outputSeqTokens = await outputTensor.argMax(1).data();
const outputWords = outputSeqTokens.map(token => Object.keys(tokenDict).find(key => tokenDict[key] === token));
console.log(outputWords.join(' '));
*/

entrain();
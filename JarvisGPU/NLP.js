const fs = require('fs');
const tf = require('@tensorflow/tfjs');

async function main() {
  // Carga el archivo JSON
  const data = JSON.parse(fs.readFileSync('../conocimiento.json', 'utf8'));

  // Separa el input y el output del archivo JSON
  const inputData = data.map(item => item.input);
  const outputData = data.map(item => item.output);

  console.log(inputData);
  console.log(outputData);

  // Crea el diccionario de tokens
  const tokens = new Set(inputData.concat(outputData).flatMap(item => item.split()));
  const tokenDict = {};
  for (const [i, token] of tokens.entries()) {
    tokenDict[token] = i + 1;
  }

  console.log("tokens", tokens);

  // Convierte cada cadena en una lista de enteros
  const inputDataInt = inputData.map(item => item.split().map(token => tokenDict[token]));
  const outputDataInt = outputData.map(item => item.split().map(token => tokenDict[token]));

  console.log(inputDataInt);
  console.log(outputDataInt);

  // Crea el modelo de LSTM
  const model = tf.sequential();
  model.add(tf.layers.embedding({
    inputDim: tokens.size,
    outputDim: 32,
  }));
  model.add(tf.layers.lstm({ units: 32 }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  // Compila el modelo
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  // Crea tensores a partir de los datos de entrada y de salida
  const inputTensor = tf.tensor2d(inputDataInt, [inputDataInt.length, inputDataInt[0].length]);
  const outputTensor = tf.tensor2d(outputDataInt, [outputDataInt.length, outputDataInt[0].length]);

  console.log(inputTensor);
  console.log(outputTensor);

  // Entrena el modelo
  const history = await model.fit(inputTensor, outputTensor, {
    epochs: 10,
  });

  console.log(history);

  // Convierte el modelo a JSON
  const modelJson = model.toJSON();

  // Guarda el modelo en un archivo
  fs.writeFileSync('model.json', JSON.stringify(modelJson));
}

main();
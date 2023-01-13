const brain = require('brain.js');

// Define el modelo
const model = new brain.NeuralNetwork();

// Proporciona los datos de entrenamiento al modelo
const data = [
  { input: [-1, 0], output: [-1] },
  { input: [0, 1], output: [1] },
  { input: [1, 2], output: [3] },
  { input: [2, 3], output: [5] },
  { input: [3, 4], output: [7] }
];

model.train(data, {
  errorThresh: 0.025,  // Error threshold to reach
  iterations: 20,   // Maximum training iterations
  log: true,           // console.log() progress periodically
  logPeriod: 1,       // number of iterations between logging
});

// Hace una predicción utilizando el modelo entrenado
console.log(model.run([10, 11]));  // [17]
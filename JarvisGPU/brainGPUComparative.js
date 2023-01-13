const brain = require("brain.js");

const trainingData = [
  { input: [0, 1], output: [1] },
  { input: [0, 0], output: [0] },
  { input: [1, 1], output: [0] },
  { input: [1, 0], output: [1] },
];

const net = new brain.NeuralNetwork({
  hiddenLayers: [100, 100],
});

console.time("CPU training");

const output = net.train(trainingData, {
  iterations: 50000, // maximum training iterations
  log: true, // console.log() progress periodically
  logPeriod: 10000, // number of iterations between logging
});

console.timeEnd("CPU training");
console.log(`CPU training output`, output);

console.time("GPU training");

const netGPU = new brain.NeuralNetworkGPU({
  hiddenLayers: [100, 100],
});

const outputGPU = netGPU.train(trainingData, {
  iterations: 50000, // maximum training iterations
  log: true, // console.log() progress periodically
  logPeriod: 10000, // number of iterations between logging
});

console.timeEnd("GPU training");
console.log(`GPU training output`, outputGPU);

const brain = require('brain.js');
const fs = require('fs')
const { GPU } = require('gpu.js');
const gpu = new GPU({ mode: 'gpu' });
async function entrain() {
  const conocimiento = fs.readFileSync('../conocimiento.json');
  const data = JSON.parse(conocimiento);
  GPU.enableValidation();
  // Crear un kernel para realizar la operación matemática de la función de activación
  const activationKernel = gpu.createKernel(function (x) {
    console.log(x);
    return 1 / (1 + Math.exp(-x));
  });
  // Crear un kernel para realizar la operación matemática de la propagación hacia atrás
  const backpropKernel = gpu.createKernel(function (error, output, weights) {
    const delta = error * output * (1 - output);
    return delta * weights;
  });

  // Crear una red neuronal utilizando los kernels creados anteriormente
  const model = new brain.recurrent.LSTM({
    hiddenLayers: [10],
    activation: activationKernel,
    backprop: backpropKernel
  });

  // Entrenar la red neuronal utilizando los kernels
  model.train(data, { log: true });

  // Convertimos a JSON
  const modelJson = model.toJSON();

  // Guarda el modelo en un archivo
  fs.writeFileSync('model.json', JSON.stringify(modelJson));
  console.log("Modelo ", modelJson);
}

entrain();

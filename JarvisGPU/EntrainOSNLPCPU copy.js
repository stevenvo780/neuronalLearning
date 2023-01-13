const brain = require('brain.js');
//const { exec } = require('child_process');
const fs = require('fs')
const { GPU } = require('gpu.js');

async function entrain() {

  // Entrenamos al modelo con algunos datos de ejemplo
  const data = [
    "abrir calculadora",
    'gnome-calculator',
    "abrir terminal",
    "google-terminal",
    "abrir explorador",
    "nautilus",
    "abrir codigo",
    "code",
    "bases de datos",
    "mysql-workbench",
    "busca una película",
    "google-chrome 'Películas'",
    "busca un libro",
    "google-chrome 'Películas libro'",
    "busca un juego",
    "google-chrome 'Películas juego'",
    "busca un supermercado",
    "google-chrome 'supermercados cercanos'",
    "busca un teclado",
    "google-chrome 'Teclado en venta'",
    "quien gano el mundial",
    "google-chrome 'Quien gano el mundial'",
    "quien gano la champions",
    "google-chrome 'Quien gano la champions'",
    "quien gano la champion",
    "google-chrome 'Quien gano la champion'",
    "pon me esta canción",
    "google-chrome 'Pon me esta canción'",
    "clima",
    "google-chrome 'Clima de hoy'",
    "como esta el dia hoy",
    "google-chrome 'Clima de hoy'",
    "como esta el dia",
    "google-chrome 'Clima de hoy'",
  ];
  console.log(data);
  const gpu = new GPU();

  // Crear un kernel para realizar la operación matemática de la función de activación
  const activationKernel = gpu.createKernel(function (x) {
    console.log(x);
    return 1 / (1 + Math.exp(-x));
  });
  // Crear un kernel para realizar la operación matemática de la propagación hacia atrás
  const backpropKernel = gpu.createKernel(function (error, output, weights) {
    console.log(weights);
    console.log(output);
    console.log(error);
    const delta = error * output * (1 - output);
    return delta * weights;
  });

  // Crear una red neuronal utilizando los kernels creados anteriormente
  const model = new brain.recurrent.LSTM({
    activation: activationKernel,
    backprop: backpropKernel
  });
  // Opciones de entrenamiento
const options = {
  iterations: 20000,
  learningRate: 0.1
};
  model.train(data, options);
  // Convertimos a JSON
  const modelJson = model.toJSON();

  // Guarda el modelo en un archivo
  fs.writeFileSync('model.json', JSON.stringify(modelJson));
  console.log("Modelo ", modelJson);
}

entrain();

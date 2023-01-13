const brain = require('brain.js');
const { exec } = require('child_process');
const fs = require('fs')
const { GPU } = require('gpu.js');
const gpu = new GPU();
const entrainGPU = gpu.createKernel(function(dataModel, texto) {
  return entrain(dataModel, texto.toLowerCase());
}).setOutput([1024]);

module.exports = async function runThinking(texto) {
  const dataModel = [];
  exec('ls /bin', async (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    const lines = stdout.split('\n');
    lines.forEach(textSepare => {
      (function () {
        if (textSepare === "gnome-calculator") {
          dataModel.push("abrir calculadora");
          dataModel.push(textSepare);
        }
      })();
      (function () {
        if (textSepare === "gnome-terminal") {
          dataModel.push("abrir terminal");
          dataModel.push(textSepare);
        }
      })();
      (function () {
        if (textSepare === "google-chrome") {
          dataModel.push("abrir chrome");
          dataModel.push(textSepare);
        }
      })();
      (function () {
        if (textSepare === "nautilus") {
          dataModel.push("abrir explorador");
          dataModel.push(textSepare);
        }
      })();
    });
    console.log(dataModel);

    return entrainGPU(dataModel, texto.toLowerCase());
  });
}
async function entrain(data, input) {
  const model = new brain.recurrent.LSTM();

  // Entrenamos al modelo con algunos datos de ejemplo
  model.train(data);

  // Hacemos una predicción basándonos en una entrada dada
  const prediction = await model.run(input);

  console.log(prediction); // "Oh, sólo estoy ocupado con el trabajo y algunas actividades personales."
  // Convierte el modelo a un objeto JSON
  const modelJson = model.toJSON();

  // Guarda el modelo en un archivo
  fs.writeFileSync('model.json', JSON.stringify(modelJson));
  return prediction;
}

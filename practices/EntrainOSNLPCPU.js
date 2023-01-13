const brain = require('brain.js');
const { exec } = require('child_process');
const fs = require('fs')

async function entrain() {
  const model = new brain.recurrent.LSTM();
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
    // Entrenamos al modelo con algunos datos de ejemplo
    model.train(data);
    // Convertimos a JSON
    const modelJson = model.toJSON();

    // Guarda el modelo en un archivo
    fs.writeFileSync('model.json', JSON.stringify(modelJson));
    console.log("Modelo ", modelJson);
  });
}

entrain();

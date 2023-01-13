const brain = require('brain.js');
//const { exec } = require('child_process');
const fs = require('fs')

async function entrain() {
  const model = new brain.recurrent.LSTM({
    hiddenLayers: [10, 5],
  });
  // Entrenamos al modelo con algunos datos de ejemplo
  const conocimiento = fs.readFileSync('../conocimiento.json');
  const data = JSON.parse(conocimiento);
  console.log(data);
  model.train(data, { log: true });
  // Convertimos a JSON
  const modelJson = model.toJSON();

  // Guarda el modelo en un archivo
  fs.writeFileSync('model.json', JSON.stringify(modelJson));
  console.log("Modelo ", modelJson);
}

entrain();

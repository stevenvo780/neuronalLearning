const brain = require('brain.js');
const fs = require('fs');

module.exports = async function executePredictionOSNPLCPU(texto) {
  // Cargamos el modelo desde el archivo
  const modelJson = fs.readFileSync('model.json');
  const model = new brain.recurrent.LSTM().fromJSON(JSON.parse(modelJson));

  // Hacemos una predicción basándonos en una entrada dada
  const prediction = model.run(texto);

  console.log("Predicción:" + prediction);
}

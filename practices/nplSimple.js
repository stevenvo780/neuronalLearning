const brain = require('brain.js');

// Creamos el modelo de lenguaje natural
const model = new brain.recurrent.LSTM();

// Entrenamos al modelo con algunos datos de ejemplo
model.train([
  'Hola, ¿cómo estás?',
  'Bien, gracias. ¿Y tú?',
  'Estoy bien también. ¿Qué has estado haciendo últimamente?',
  'Oh, sólo estoy ocupado con el trabajo y algunas actividades personales.',
]);

// Hacemos una predicción basándonos en una entrada dada
const prediction = model.run('¿Has hecho algo divertido últimamente?');

console.log(prediction); // "Oh, sólo estoy ocupado con el trabajo y algunas actividades personales."

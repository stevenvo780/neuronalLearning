const brain = require('brain.js');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs')
const nlp = require('compromise')

module.exports = async function runThinking(texto) {
  const oneHot = convertTextIntoNumbers(texto);
  console.log(oneHot);
  const dataModel = [];
  exec('ls /bin', (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    //console.log(`stdout:\n${stdout}`);
    const lines = stdout.split('\n');
    lines.forEach(textSepare => {
      (function () {
        if (textSepare === "gnome-calculator") {
          const hotStdout = convertTextIntoNumbers(textSepare);
          const hotStdin = convertTextIntoNumbers("abrir calculadora");
          dataModel.push({ input: hotStdout, output: hotStdin });
          console.log({ input: hotStdout, output: hotStdin });
        }
      })();
      (function () {
        if (textSepare === "gnome-terminal") {
          const hotStdout = convertTextIntoNumbers(textSepare);
          const hotStdin = convertTextIntoNumbers("abrir terminal")
          dataModel.push({ input: hotStdout, output: hotStdin });
          console.log({ input: hotStdout, output: hotStdin });
        }
      })();
      (function () {
        if (textSepare === "google-chrome") {
          const hotStdout = convertTextIntoNumbers(textSepare);
          const hotStdin = convertTextIntoNumbers("abrir chrome");
          dataModel.push({ input: hotStdout, output: hotStdin });
          console.log({ input: hotStdout, output: hotStdin });
        }
      })();
      (function () {
        if (textSepare === "nautilus") {
          const hotStdout = convertTextIntoNumbers(textSepare);
          const hotStdin = convertTextIntoNumbers("abrir archivos");
          dataModel.push({ input: hotStdout, output: hotStdin });
          console.log({ input: hotStdout, output: hotStdin });
        }
      })();
    });

    const model = new brain.NeuralNetwork();
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
    const response = model.run([10, 11]);
    console.log(response)
    // Convierte el modelo a un objeto JSON
    const modelJson = model.toJSON();

    // Guarda el modelo en un archivo
    fs.writeFileSync('model.json', JSON.stringify(modelJson));
    return response;
  });
}

function oneHotEncode(text) {
  const vocabulary = text.split(' ');
  // Crea un array de ceros con la misma cantidad de elementos que el vocabulario
  const encoded = Array(vocabulary.length).fill(0);

  // Busca la posición de la palabra en el vocabulario y establece el valor a 1
  const index = vocabulary.indexOf(text);
  encoded[index] = 1;

  return encoded;
}

const convertTextIntoNumbers = async (text) => {
  // console.log(text);
  // const model = new brain.word2vec();
  // await model.load('http://localhost:3000/model.json');

  // // Convierte el texto en un vector de word2vec
  // const vector = model.encode(text);
  // console.log(vector);
  // return vector;


function tokenizeText(text) {
  // Tokeniza el texto en palabras
  const words = nlp.text(text).terms;

  // Extrae el lema de cada palabra
  const lemmas = words.map(word => word.lemma);

  return lemmas;
}

// Prueba la función de tokenización con un ejemplo de texto
const tokens = tokenizeText(text);
console.log(tokens); // Imprime el array de tokens en la consola
return tokens;



  // const hash = crypto.createHash('sha256').update(text).digest('hex');
  // console.log(binary_encode(hash));
  // const hashBinaries = convertToFloat(binary_encode(hash));
  // console.log(hashBinaries);
  // return hashBinaries;
  // const tokens = text.split('');
  // const weights = [];
  // if (tokens.length === 0) {
  //   return;
  // }
  // for (let i = 0; i < tokens.length; i++) {
  //   if (tokens[i] === ' ') {
  //     break;
  //   }
  //   weights[i] = convertToFloat(binary_encode(tokens[i]));
  // }
  // console.log(weights);
  // return weights;

  // //const words = text.split(' ');
  // const vocabulary = text.split(' ');
  // // Crea un array de ceros con la misma cantidad de elementos que el vocabulario
  // const encoded = Array(vocabulary.length).fill(0);

  // // Busca la posición de la palabra en el vocabulario y establece el valor a 1
  // const index = vocabulary.indexOf(text);
  // encoded[index] = 1;


  // return encoded;

  /*
  // Crear un objeto que asigne a cada palabra un índice único
  const wordIndex = words.reduce((acc, word, i) => {
    acc[word] = i;
    return acc;
  }, {});

  // Vectorizar el texto utilizando one-hot encoding
  const vectorizedText = words.map(word => {
    const vector = new Array(words.length).fill(0);
    vector[wordIndex[word]] = 1;
    return vector;
  });
  return vectorizedText;
  */

  // //Tokenizar el texto
  // const tokens = text.split(' ');

  // //Construir el vocabulario
  // const vocab = [...new Set(tokens)];
  // const wordToIndex = vocab.reduce((obj, word, index) => {
  //   obj[word] = index;
  //   return obj;
  // }, {});

  // //Convertir el texto a secuencias de índices
  // const sequences = tokens.map(word => wordToIndex[word]);

  // //Codificar las secuencias de índices como vectores one - hot
  // const oneHot = [];
  // for (let i = 0; i < vocab.length; i++) {
  //   oneHot.push(sequences.map(index => index === i ? 1 : 0));
  // }
  // return oneHot;

}

function binary_encode(s) {
  s = unescape(encodeURIComponent(s));
  var chr, i = 0, l = s.length, out = '';
  for (; i < l; i++) {
    chr = s.charCodeAt(i).toString(2);
    while (chr.length % 8 != 0) { chr = '0' + chr; }
    out += chr;
  }
  return out;
}

function convertToFloat(num) {
  const numLength = num.toString().length;
  return parseFloat(num / Math.pow(10, numLength));
}
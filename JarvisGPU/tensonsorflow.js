
const tf = require('@tensorflow/tfjs');

// Importing the tensorflow.js library
//import * as tf from "@tensorflow/tfjs"

// Create a new model with lstm Layer
const LSTM = tf.layers.lstm({ units: 4, returnSequences: true });

// Create a 3d tensor
const x = tf.tensor([1, 2, 3, 4], [2, 2, 1]);

// Apply lstm layer to x
const output = LSTM.apply(x);

// Print output
output.print()
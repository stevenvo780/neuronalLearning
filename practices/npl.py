import tensorflow as tf
import json
import os

# Deshabilita la GPU
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

# Crea una instancia de MirroredStrategy
strategy = tf.distribute.MirroredStrategy(devices=["/gpu:0", "/gpu:1"],
                      cross_device_ops=tf.contrib.distribute.AllReduceCrossDeviceOps(
                        all_reduce_alg="hierarchical_copy"))

# Construye el modelo de lenguaje natural
model=tf.keras.Sequential()

# Agrega una capa LSTM con 64 unidades y especifica la forma de entrada
model.add(tf.keras.layers.LSTM(units=64, input_shape=(None, 1)))

# Agrega una capa densa de salida
model.add(tf.keras.layers.Dense(1))

# Compila el modelo
model.compile(loss='mean_squared_error', optimizer='sgd')

# Prepara tus datos de entrada

# Primero, tokeniza las cadenas de texto
tokenizer=tf.keras.preprocessing.text.Tokenizer()
sequences=tokenizer.texts_to_sequences([
  'Hola, ¿cómo estás?',
  'Bien, gracias. ¿Y tú?',
  'Estoy bien también. ¿Qué has estado haciendo últimamente?',
  'Oh, sólo estoy ocupado con el trabajo y algunas actividades personales.',
])

padded_sequences=tf.keras.preprocessing.sequence.pad_sequences(
    sequences, padding='post')

# Crea un conjunto de datos a partir de las secuencias paddeadas
dataset=tf.data.Dataset.from_tensor_slices(padded_sequences).batch(2)

# Entrena al modelo con algunos datos de ejemplo
strategy.fit(dataset, epochs=2, steps_per_epoch=2)

# Convierte el modelo a un diccionario de Python
model_dict=model.to_json()

# Guardamos el modelo en un archivo
with open('model.json', 'w') as f:
    json.dump(model_dict, f)

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
tf.config.set_visible_devices([], 'GPU')
# Ejemplo de datos de entrenamiento
data = ["this is an example of NLP with RNN", "NLP is a field of AI", "RNNs are commonly used for NLP tasks"]

# Construir un tokenizador
tokenizer = Tokenizer()

# Ajustar el tokenizador al conjunto de datos de entrenamiento
tokenizer.fit_on_texts(data)

# Convertir los datos de entrenamiento a secuencias numéricas
data = tokenizer.texts_to_sequences(data)

# Rellenar las secuencias con ceros hasta que tengan longitud igual
data = pad_sequences(data, padding='post', maxlen=5)

# Construir el modelo
model = tf.keras.Sequential()
model.add(tf.keras.layers.Embedding(input_dim=1000, output_dim=32))
model.add(tf.keras.layers.SimpleRNN(32))
model.add(tf.keras.layers.Dense(1, activation='sigmoid'))

# Compilar el modelo
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Entrenar el modelo
model.fit(data.tolist(), [1, 1, 1], epochs=10)

# Ejemplo de datos de prueba
test_data = ["this is an example of NLP with RNN", "NLP is a field of AI"]

# Convertir los datos de prueba a secuencias numéricas
test_data = tokenizer.texts_to_sequences(test_data)

# Rellenar las secuencias con ceros hasta que tengan longitud igual
test_data = pad_sequences(test_data, padding='post', maxlen=5)

# Hacer predicciones con el modelo
predictions = model.predict(test_data)
print(predictions)
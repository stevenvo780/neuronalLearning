import json
import tensorflow as tf

# Carga el archivo JSON
with open('./conocimiento.json', 'r') as f:
  data = json.load(f)

# Separa el input y el output del archivo JSON
input_data = [item['input'] for item in data]
output_data = [item['output'] for item in data]

# Crea el diccionario de tokens
tokens = set(token for item in input_data + output_data for token in item.split())
token_dict = {token: i for i, token in enumerate(tokens, 1)}

# Convierte cada cadena en una lista de enteros
input_data_int = [[token_dict[token] for token in item.split()] for item in input_data]
output_data_int = [[token_dict[token] for token in item.split()] for item in output_data]

# Creamos el modelo de LSTM
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=len(token_dict), output_dim=32),
    tf.keras.layers.LSTM(units=32),
    tf.keras.layers.Dense(units=1, activation='sigmoid')
])

# Compilamos el modelo
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Entrenamos el modelo
history = model.fit(input_data_int, output_data_int, epochs=10)

# Convertimos el modelo a JSON
model_json = model.to_json()

# Guardamos el modelo en un archivo
with open('model.json', 'w') as f:
  json.dump(model_json, f)

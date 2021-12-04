import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
import tensorflow as tf
import pandas as pd
from flask import Flask, request, jsonify, render_template
import json

# Initialize our Flask application and the Keras model.
app = Flask(__name__)

model_path = 'lstm.h5'
model = load_model(model_path, compile = False)
df = pd.read_csv('D3_data.csv', header=None)
df.columns =['Index', 'Url', 'Result']
urls = {}
for index, row in df.iterrows():
    urls[row['Url']] = row['Result']
samples = []
for k, v in urls.items():
    samples.append(k)
max_chars = 20000
maxlen = 128
tokenizer = Tokenizer(num_words=max_chars, char_level=True)
tokenizer.fit_on_texts(samples)

def get_data(url):

    sequences = tokenizer.texts_to_sequences(url)
    word_index = tokenizer.word_index

    url_prepped = pad_sequences(sequences, maxlen=maxlen)
    return url_prepped

# check
@app.route('/home', methods=['GET', 'POST'])
def home():
    welcome = "Hello, World !"
    return welcome

#prediction from model
@app.route("/predict", methods=['GET', 'POST'])
def predict():

    # Initialize the dictionary for the response.
    data = {"success": False}

    # Check if POST request.
    if request.method == "POST":
        # Grab and process the incoming json.
        incoming = request.get_json(force=True)
        url = incoming["url"]


        # Process and prepare the URL.
        url_prepped = get_data([url])

        # classify the URL and make the prediction.
        

        prediction = model.predict(url_prepped)
        
        data["predictions"] = []
        
        if prediction > 0.50:
            result = "URL is probably malicious."
        else:
            result = "URL is probably NOT malicious."
        
        #split = url.split("//")
        #print(split[0])
        #split2 = split[1]
        #if "/" not in split2:
        #    result = "Base URLs cannot be accurately determined."
        
        prediction = float(prediction)
        prediction = prediction * 100
        
        #if result == "Base URLs cannot be accurately determined.":
        #    r = {"result": result, "url": url}
        #else:
        r = {"result": result, "malicious percentage": prediction, "url": url}
        data["predictions"].append(r)

        # Show that the request was a success.
        data["success"] = True

    # Return the data as a JSON response.
    return jsonify(data)


# Start the server.
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=55000)

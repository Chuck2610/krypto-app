from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import base64
import io

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze-screenshot', methods=['POST'])
def analyze_screenshot():
    if 'image' not in request.files:
        return jsonify({'error': 'Kein Bild erhalten'}), 400

    image_file = request.files['image']
    image = Image.open(image_file.stream)
    text = pytesseract.image_to_string(image, lang='eng')

    return jsonify({'result': text})

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import os

app = Flask(__name__)
CORS(app)  # Erlaubt Anfragen von Frontend (CORS)

@app.route("/api/analyze-screenshot", methods=["POST"])
def analyze_screenshot():
    if "image" not in request.files:
        return jsonify({"error": "Kein Bild erhalten"}), 400

    image = request.files["image"]
    image_path = os.path.join("temp", image.filename)
    os.makedirs("temp", exist_ok=True)
    image.save(image_path)

    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return jsonify({"analysis": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(image_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

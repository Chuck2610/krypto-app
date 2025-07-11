from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import io

app = Flask(__name__)
CORS(app)  # Erlaubt Cross-Origin-Zugriff (für Frontend)

@app.route("/api/analyze-screenshot", methods=["POST"])
def analyze_screenshot():
    if "image" not in request.files:
        return jsonify({"error": "Kein Bild hochgeladen"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Dateiname fehlt"}), 400

    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Texterkennung mit pytesseract
        extracted_text = pytesseract.image_to_string(image)

        return jsonify({"analysis": extracted_text.strip()})
    except Exception as e:
        return jsonify({"error": f"Analyse fehlgeschlagen: {str(e)}"}), 500

@app.route("/", methods=["GET"])
def index():
    return "🚀 KI Screenshot-Analyse Backend läuft!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

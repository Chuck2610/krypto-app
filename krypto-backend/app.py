
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
import io

app = Flask(__name__)

@app.route('/api/analyze-screenshot', methods=['POST'])
def analyze_screenshot():
    image = request.files.get('image')
    if not image:
        return jsonify({"error": "Kein Bild empfangen"}), 400

    try:
        img = Image.open(io.BytesIO(image.read()))
        text = pytesseract.image_to_string(img)

        analysis = f"""📈 Screenshot-Analyse:
Erkannter Text (gekürzt):
{text[:500]}

🔍 Mögliche Interpretation:
- Kurszonen oder Begriffe wie RSI/MACD erkannt?
- Unterstützung / Widerstand ableitbar?
- Relevante Preisbereiche im Screenshot sichtbar?
"""
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

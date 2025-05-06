# app.py (Final Version with /upload and /search)

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import pickle
import os
import io
import random
from PIL import Image

app = Flask(__name__)
CORS(app)

# === /upload ROUTE: Dummy match simulation ===

MATCHES_DIR = os.path.join("static", "matches")

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files['image']
    filename = image.filename.lower()
    image_bytes = image.read()

    # Simulate dominant color
    try:
        img = Image.open(io.BytesIO(image_bytes))
        dominant_color = get_dominant_color(img)
    except Exception as e:
        print("Error reading image:", e)
        dominant_color = "unknown"

    matches = simulate_ai_response(filename, dominant_color)
    return jsonify({"matches": matches})

def simulate_ai_response(filename, dominant_color):
    all_matches = os.listdir(MATCHES_DIR)
    filtered = []

    keywords = ["yellow", "blue", "red", "shirt", "jeans", "jacket"]
    for word in keywords:
        if word in filename:
            filtered += [f for f in all_matches if word in f.lower()]

    if dominant_color in ["yellow", "blue", "red"]:
        filtered += [f for f in all_matches if dominant_color in f.lower()]

    filtered = list(set(filtered))
    if not filtered:
        filtered = random.sample(all_matches, min(3, len(all_matches)))

    return filtered[:3]

def get_dominant_color(image):
    small = image.resize((50, 50))
    result = small.convert('RGB').getcolors(2500)
    if not result:
        return "unknown"
    dominant_rgb = sorted(result, key=lambda x: -x[0])[0][1]

    r, g, b = dominant_rgb
    if r > 200 and g > 200 and b < 100:
        return "yellow"
    elif r < 100 and g < 100 and b > 150:
        return "blue"
    elif r > 150 and g < 100 and b < 100:
        return "red"
    else:
        return "unknown"

# === /search ROUTE: Real class + color filter ===

# Load .pkl with real item + color data
try:
    with open("image_content_data_with_color.pkl", "rb") as f:
        image_content_data = pickle.load(f)
except Exception as e:
    print("⚠️ Failed to load image_content_data_with_color.pkl:", e)
    image_content_data = {}

# Define color RGB ranges
color_ranges = {
    "blue": [(0, 0, 100), (100, 100, 255)],
    "red": [(100, 0, 0), (255, 100, 100)],
    "green": [(0, 100, 0), (100, 255, 100)],
    "yellow": [(150, 150, 0), (255, 255, 100)],
    "black": [(0, 0, 0), (50, 50, 50)],
    "white": [(200, 200, 200), (255, 255, 255)],
    "gray": [(100, 100, 100), (200, 200, 200)],
    "purple": [(100, 0, 100), (200, 100, 200)],
    "brown": [(80, 40, 0), (160, 100, 60)],
    "pink": [(200, 100, 100), (255, 200, 200)],
}

@app.route('/search', methods=['GET'])
def search_by_class_and_color():
    class_name = request.args.get("class_name")
    color_filter = request.args.get("color_filter")

    if not class_name:
        return jsonify({"error": "Missing class_name"}), 400

    matches = []

    for image_file, item_dict in image_content_data.items():
        for detected_class, values in item_dict.items():
            if detected_class == "sweatshirt":
                print(f"{image_file} → {detected_class} → {values}")

            if detected_class != class_name:
                continue

            if isinstance(values, tuple) and len(values) == 2:
                bbox, mode_color = values
            elif isinstance(values, tuple) and len(values) == 4:
                bbox = values
                mode_color = None
            else:
                continue



            if color_filter and mode_color is not None:
                bounds = color_ranges.get(color_filter.lower())
                if not bounds:
                    continue
                low, high = bounds
                if not all(low[i] <= int(mode_color[i]) <= high[i] for i in range(3)):
                    continue

            print(f"✅ MATCH: {image_file} → {class_name} → bbox={bbox}")
            matches.append({
                "image_file": image_file,
                "bbox": [int(x) for x in bbox]

            })
            break
    try:
        log_entry = {
            "class_name": class_name,
            "color": color_filter,
            "timestamp": datetime.utcnow().isoformat(),
            "results_count": len(matches)
        }
        with open("search_log.jsonl", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print("⚠️ Failed to log search:", e)

    return jsonify(matches)

# === NEW: /history ROUTE ===
@app.route('/history', methods=['GET'])
def get_search_history():
    try:
        with open("search_log.jsonl", "r") as f:
            lines = f.readlines()
        recent = [json.loads(line) for line in lines][-10:]
        return jsonify(recent[::-1])  # newest first
    except Exception as e:
        print("⚠️ Failed to read history:", e)
        return jsonify([])

# === MAIN ===
if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)

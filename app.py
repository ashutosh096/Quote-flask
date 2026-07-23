"""
Quote Generator API — a tiny Flask backend.

Endpoints:
  GET /api/quote            -> a random quote
  GET /api/quote?tag=focus  -> a random quote filtered by tag
  GET /api/tags             -> list of available tags
  POST /api/quote           -> add a new quote
"""

import json
import os
import random
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")

QUOTES_FILE = os.path.join(os.path.dirname(__file__), "quotes.json")

def load_quotes():
    if not os.path.exists(QUOTES_FILE):
        return []
    try:
        with open(QUOTES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_quotes(quotes):
    try:
        with open(QUOTES_FILE, "w", encoding="utf-8") as f:
            json.dump(quotes, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False

@app.route("/api/quote", methods=["GET"])
def get_quote():
    quotes = load_quotes()
    if not quotes:
        return jsonify({"error": "No quotes available"}), 404
        
    tag = request.args.get("tag")
    pool = [q for q in quotes if q.get("tag") == tag] if tag else quotes
    if not pool:
        return jsonify({"error": f"No quotes found for tag '{tag}'"}), 404
    return jsonify(random.choice(pool))

@app.route("/api/tags", methods=["GET"])
def get_tags():
    quotes = load_quotes()
    tags = sorted({q["tag"] for q in quotes if "tag" in q and q["tag"]})
    return jsonify(tags)

@app.route("/api/quote", methods=["POST"])
def add_quote():
    data = request.get_json()
    if not data or not data.get("text"):
        return jsonify({"error": "Quote text is required"}), 400
        
    text = data.get("text").strip()
    author = data.get("author", "Unknown").strip() or "Unknown"
    tag = data.get("tag", "general").strip().lower() or "general"
    
    quotes = load_quotes()
    new_quote = {"text": text, "author": author, "tag": tag}
    quotes.append(new_quote)
    
    if save_quotes(quotes):
        return jsonify(new_quote), 201
    else:
        return jsonify({"error": "Failed to save the new quote"}), 500

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.after_request
def add_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)


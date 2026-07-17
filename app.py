"""
Quote Generator API — a tiny Flask backend.

Endpoints:
  GET /api/quote            -> a random quote
  GET /api/quote?tag=focus  -> a random quote filtered by tag
  GET /api/tags             -> list of available tags
"""

import random
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")

QUOTES = [
    {"text": "Simplicity is the soul of efficiency.", "author": "Austin Freeman", "tag": "focus"},
    {"text": "Do the hard things first.", "author": "Unknown", "tag": "discipline"},
    {"text": "Small steps every day beat big leaps once a year.", "author": "Unknown", "tag": "habits"},
    {"text": "Code is read far more often than it is written.", "author": "Guido van Rossum", "tag": "code"},
    {"text": "Make it work, make it right, make it fast.", "author": "Kent Beck", "tag": "code"},
    {"text": "Discipline equals freedom.", "author": "Jocko Willink", "tag": "discipline"},
    {"text": "The best time to start was yesterday. The next best time is now.", "author": "Unknown", "tag": "habits"},
    {"text": "Focus on being productive instead of busy.", "author": "Tim Ferriss", "tag": "focus"},
    {"text": "First, solve the problem. Then, write the code.", "author": "John Johnson", "tag": "code"},
    {"text": "You do not rise to the level of your goals. You fall to the level of your systems.", "author": "James Clear", "tag": "habits"},
]


@app.route("/api/quote")
def get_quote():
    tag = request.args.get("tag")
    pool = [q for q in QUOTES if q["tag"] == tag] if tag else QUOTES
    if not pool:
        return jsonify({"error": f"No quotes found for tag '{tag}'"}), 404
    return jsonify(random.choice(pool))


@app.route("/api/tags")
def get_tags():
    tags = sorted({q["tag"] for q in QUOTES})
    return jsonify(tags)


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)

# 🌌 QuoteForge

> **A Premium, Glassmorphic Random Quote Engine & Curation Dashboard**
> Built with a lightweight Python (Flask) backend and a highly polished, responsive Vanilla JavaScript & CSS frontend.

---

## ✨ Features

- **🎨 Modern Glassmorphic Design**: An immersive dark mode experience featuring smooth gradients, blur backdrops, soft neon accents, and interactive transitions.
- **🏷️ Dynamic Filtering**: Segment and explore quotes by category tags (e.g., `#code`, `#focus`, `#discipline`, `#habits`, `#life`, `#success`) with real-time API filtering.
- **💖 Personalized Collections**: Save your favorite quotes to a local bookmarks gallery, powered by persistent client-side storage.
- **🖋️ Quote Forge**: Submit custom quotes through an interactive form modal that writes back to the server-side database.
- **📋 Copy & Share**: Instantly copy formatted quotes to your clipboard with custom toast confirmations, or share them directly to Twitter/X with pre-formatted layout structures.
- **🚀 Dynamic API**: Flask-powered REST backend serving randomized quotes, tags, and validation for custom quote submissions.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.x, Flask
- **Frontend**: HTML5, CSS3 (Vanilla Custom Properties, Flexbox, CSS Grid, custom keyframes), Vanilla JavaScript (ES6+, Fetch API, LocalStorage)
- **Icons**: FontAwesome 6 (CDN)
- **Fonts**: Outfit (Sans-serif display), Playfair Display (Serif blockquotes)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Python 3 installed on your system.

### 2. Installation
Clone the repository, navigate into the project directory, and install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Running the Server
Start the Flask development server:

```bash
python app.py
```

The application will run locally at **`http://127.0.0.1:5000`** (or `http://localhost:5000`).

---

## 📂 Project Structure

```text
quote-flask/
├── app.py              # Flask REST API server (endpoints for quotes, tags, & uploads)
├── quotes.json         # Dynamic database storing all quotes
├── requirements.txt    # Python dependencies
└── static/             # Client-side static resources
    ├── index.html      # Glassmorphic layout structure & modals
    ├── style.css       # Premium styles, animations, & variables
    └── script.js       # App controller, API requests, & LocalStorage sync
```

---

## 🔌 API Documentation

| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/quote` | Fetch a random quote. | `tag` (optional query string to filter) |
| **GET** | `/api/tags` | Retrieve all distinct tags currently in the database. | None |
| **POST** | `/api/quote` | Forge and save a new quote to `quotes.json`. | `{ "text": "...", "author": "...", "tag": "..." }` |

---

## 🔒 License
This project is open-source and free for personal and educational use. Feel free to clone, modify, and expand upon it!

# Quote Card — Python (Flask) + JS frontend

A tiny full-stack project: a Flask API serving random quotes, and a plain HTML/CSS/JS frontend that fetches from it. No frameworks needed on the frontend — good for learning how a frontend talks to a backend over HTTP.

## What it teaches

- Building a REST API with Flask (`app.py`)
- Serving static files from Flask
- `fetch()` calls from vanilla JS
- Query params (`/api/quote?tag=code`)
- Basic client-side DOM manipulation

## Run it

```bash
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5000

## Project structure

```
quote-flask/
├── app.py              # Flask API: /api/quote, /api/tags
├── requirements.txt
└── static/
    ├── index.html
    ├── style.css        # dark "index card" look
    └── script.js        # fetches quotes, handles tag filter buttons
```

## Try it

- Click "Draw another card" for a random quote
- Click a tag (e.g. `code`, `focus`, `discipline`) to filter by topic

## Ideas to extend it

- Add a `POST /api/quote` endpoint so users can submit their own quotes
- Store quotes in a SQLite database instead of a Python list
- Add a "copy quote" button
- Deploy the API separately and point a Next.js frontend at it (pairs well with the todo-nextjs project)

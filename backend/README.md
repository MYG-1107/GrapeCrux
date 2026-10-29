# Optional GrapeCrux AI Assistant API

This backend provides an optional generative-AI endpoint for the browser chat. The website remains usable without it and falls back to its local guided service FAQ.

## Run locally

1. Use Python 3.10+.
2. From this folder, install dependencies: `pip install -r requirements.txt`.
3. Copy `.env.example` to `.env` and set `OPENAI_API_KEY` and, if needed, `OPENAI_MODEL`.
4. The app loads `.env` for local development. In production, inject the key using your host's secret/environment configuration instead of uploading `.env`.
5. Run: `uvicorn main:app --host 127.0.0.1 --port 8000`.
6. Check `http://127.0.0.1:8000/health`.
7. Set `window.GRAPECRUX_CHAT_API_URL` in `assets/js/config.js` to the deployed HTTPS API origin, e.g. `https://api.example.com`, without a trailing path.

## Production notes

- Deploy this backend separately from GitHub Pages on a service that supports Python/ASGI and HTTPS.
- Configure `OPENAI_API_KEY` as a hosting secret; never put it in HTML, `config.js`, GitHub Pages variables compiled into client JavaScript, or any file served to the browser.
- Restrict `CORS_ORIGINS` to the actual websites that should call the API.
- The included in-memory rate limiter is a starter for a single instance, not distributed abuse protection. Add provider/edge rate limits, monitoring, and a shared rate limiter if scaling horizontally.
- Define the organisation's privacy notice and data retention practices before processing real chats. Avoid sending sensitive information to the model.
- Review provider terms, model availability and applicable requirements before production deployment.

# Horoscope API

Node.js + Express + MongoDB API with JWT, rate limiting, and Swagger.

## Features
- Signup/Login with email + password
- Auto-detect zodiac sign from birthdate
- `GET /horoscope/today` (stores served result to history)
- `GET /horoscope/history` (last 7 days)
- Rate limit (default 5/min) for `/horoscope/*`
- Swagger UI at `/docs`

## Quickstart (Docker)
```bash
cp .env.sample .env
docker compose up --build
```

Visit:
- API: http://localhost:3000/health
- Docs: http://localhost:3000/docs

## Local dev (without Docker)
1. Start MongoDB locally or via Docker.

2. Create `.env` from sample and set `MONGODB_URI` & `JWT_SECRET`.

3. Install deps and run:
```bash
npm install
npm run dev
```

## API Overview
- `POST /auth/signup` { name, email, password, birthdate: YYYY-MM-DD }

- `POST /auth/login` { email, password }

- `GET /horoscope/today` (Bearer JWT)

- `GET /horoscope/history` (Bearer JWT)

## Notes
- History stores one record per day when `/horoscope/today` is fetched.

- `history` endpoint returns the last 7 calendar days (uses stored text if present).

- Keep your `JWT_SECRET` safe.

## AI usage
code is written with the help of chatgpt

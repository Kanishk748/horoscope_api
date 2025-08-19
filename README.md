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
-----------------------------------------------------------------------------------------------------
✅ Design Decisions
1. Tech Stack
Node.js + Express.js: Chosen for rapid API development, middleware support, and non-blocking architecture.
MongoDB + Mongoose (or PostgreSQL + Sequelize): Chosen based on need for persistent user data and flexibility in schema design. Mongoose/Sequelize provide schema validation, data modeling, and query abstraction.
2. Authentication
JWT-based auth: Stateless authentication. Users receive a token on login; this is used to access protected endpoints.
Password hashing: Implemented using bcrypt to store hashed passwords securely in the DB.
Tokens are short-lived, ensuring minimal exposure window. Optionally, refresh tokens can be added.
3. User Signup / Zodiac Auto-Detection
On signup, the backend auto-calculates the zodiac sign from the user's birthdate using a helper function.
Zodiac is stored in the user document/model for fast future access.
This minimizes real-time computation on horoscope endpoints.
4. Horoscope Management
   Daily Horoscope (GET /horoscope/today):
Authenticated route.
Returns the horoscope for the user's zodiac sign based on the current date.
Horoscope texts are mocked via an in-memory or JSON-based dictionary.
History (GET /horoscope/history):
Returns the last 7 days of horoscopes served to the user.
Stored in a separate history collection/table or as a nested array in the user model.
5. Rate Limiting
Implemented via express-rate-limit middleware.
Global or route-level restriction to 5 requests per minute to prevent abuse.
Tracks based on IP or user ID (in token).
6. API Documentation
Swagger/OpenAPI integration using swagger-jsdoc and swagger-ui-express.
Documents routes, request/response schemas, and error codes for easy developer onboarding.
---------------------------------------------------------------------------------------------------------------------------------------
⚙️ Scalability Considerations:
As the system evolves from serving general zodiac-based horoscopes to personalized horoscopes per user, several architectural and performance considerations come into play:
🔄 1. Data Storage
Current: Shared horoscope per zodiac sign (12 total per day).
Personalized: Each user gets a unique horoscope per day.
Solution: Store horoscopes in a dedicated collection/table with fields like userId, date, and horoscopeText.
Index userId + date to optimize queries.
Use MongoDB for flexibility or PostgreSQL for relational integrity.
⚙️ 2. Generation Load
Problem: Can't reuse same horoscope across users.
Solution: Use background job queues (e.g., Bull + Redis) to pre-generate daily horoscopes for all users.
Schedule jobs to run at midnight to prepare horoscopes in advance.
Jobs can use AI, external APIs, or business logic to generate content.
🚀 3. API Performance
Problem: Real-time horoscope generation increases latency.
Solution:
Use caching (e.g., Redis) to store recently accessed horoscopes.
Fallback to cached data if generation fails or times out.
💸 4. Third-Party API Usage
Problem: Personalized horoscopes may require third-party API calls (expensive or rate-limited).
Solution:
Batch API calls where possible.
Cache responses and avoid re-requesting the same horoscope.
Consider self-hosted logic or AI-based generation as cost-effective alternatives.
📊 5. Load Balancing & Scaling
Use horizontal scaling with load balancers to distribute traffic across multiple Node.js instances.
Containerize the app using Docker and deploy via Kubernetes for high availability and fault tolerance.
Separate services (auth, horoscope generation, user management) into microservices to isolate load.
6. Logging & Monitoring
Implement centralized logging (e.g., Winston, Morgan, Logstash) and monitoring (e.g., Prometheus, Grafana).
Set alerts for API errors, high latency, and failed horoscope generation jobs.

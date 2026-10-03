# ZeroWaste Meals Backend

Spring Boot REST API for **ZeroWaste Meals** — a food redistribution platform that connects donors (restaurants, caterers, bakeries) with NGOs and community kitchens.

## Tech Stack

- **Java 25**
- **Spring Boot 4.1.1**
- **Spring Web** (REST API)
- **Spring Data JPA** + **Hibernate**
- **Spring Security** with **JWT** (jjwt)
- **MySQL**
- **Bean Validation** (Jakarta)

## Prerequisites

- JDK 25
- Maven (or use the bundled `mvnw` wrapper)
- MySQL running locally (e.g. via XAMPP)

## Database Setup

The app connects to database `zerowaste_meals` and creates it automatically
(`createDatabaseIfNotExist=true`). Credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/zerowaste_meals?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata
spring.datasource.username=root
spring.datasource.password=
```

The default setup targets XAMPP MySQL (user `root`, empty password). Adjust
`username`/`password` if your local setup differs.

Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

## Running

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

## Default Configuration

| Setting                 | Location                                    | Notes                                   |
| ----------------------- | ------------------------------------------- | --------------------------------------- |
| JWT secret              | `JWT_SECRET` env var                        | Required, no default. Startup fails if unset or set to a known public value |
| Token lifetime          | `jwt.expiration` (default 24h, in ms)       |                                         |
| REST CORS origins       | `CORS_ALLOWED_ORIGINS` env var              | Comma separated. Defaults to `localhost:5173,localhost:4173`. Set your Vercel domain(s) in production |
| WebSocket origins       | `WEBSOCKET_ALLOWED_ORIGINS` env var         | Comma separated. Defaults to `*`; the JWT in the STOMP CONNECT frame is what actually gates access |
| Upload directory        | `UPLOAD_DIR` env var (default `uploads`)    |                                         |

There is no built-in JWT secret. `jwt.secret` resolves to empty unless `JWT_SECRET` is set, and the
app then fails to start rather than signing tokens with a value that is public knowledge. Locally
the value comes from the gitignored `.env`; when deployed, set it in the host's environment
settings (on Render: **Environment** → **Add Environment Variable**).

Generate a strong secret with:

```bash
openssl rand -hex 32
```

### Production checklist

- `JWT_SECRET` must be set. Startup fails with a configuration error if it is missing, or if it is
  set to the well-known placeholder that used to ship as the default, because anyone could mint a
  token for any account with that value.
- `CORS_ALLOWED_ORIGINS` must list the deployed frontend origin, otherwise the browser gets no
  `Access-Control-Allow-Origin` and every API call fails. The allowed origins are logged at startup.
  Set it to `*` only to restore the previous allow-everything behaviour.
- `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD` must be set for Neon.

## API Overview

All endpoints except `/api/auth/**` require a `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Path       | Role | Description          |
| ------ | ---------- | ---- | -------------------- |
| POST   | `/register`| open | Create an account    |
| POST   | `/login`   | open | Sign in, get JWT     |
| GET    | `/me`      | any  | Current user profile |

### Donations — `/api/donations`

| Method | Path            | Role           | Description                       |
| ------ | --------------- | -------------- | --------------------------------- |
| GET    | `/`             | any            | List listings (`?status=AVAILABLE`) |
| GET    | `/my-listings`  | DONOR          | List own listings                 |
| GET    | `/{id}`         | any            | Single listing                    |
| POST   | `/`             | DONOR/ADMIN    | Publish surplus food              |
| PUT    | `/{id}`         | DONOR/ADMIN    | Update own listing                |
| DELETE | `/{id}`         | DONOR/ADMIN    | Delete own listing                |

### Claims — `/api/listings`, `/api/claims`

| Method | Path                      | Role        | Description             |
| ------ | ------------------------- | ----------- | ----------------------- |
| POST   | `/api/listings/{id}/claim`| NGO         | Claim available food    |
| GET    | `/api/listings/{id}/claims`| DONOR/ADMIN| Who claimed my listing  |
| GET    | `/api/claims/my-claims`   | NGO         | My claims               |
| POST   | `/api/claims/{id}/cancel` | NGO         | Cancel own claim        |
| POST   | `/api/claims/{id}/confirm`| DONOR/ADMIN | Confirm pickup          |
| POST   | `/api/claims/{id}/reject` | DONOR/ADMIN | Reject a claim          |

### Admin — `/api/admin`

| Method | Path        | Role  | Description              |
| ------ | ----------- | ----- | ------------------------ |
| GET    | `/dashboard`| ADMIN | Platform-wide statistics |

## Roles

| Role   | Purpose                                          |
| ------ | ------------------------------------------------ |
| DONOR  | Publishes surplus food, manages listings         |
| NGO    | Claims available food for its community          |
| ADMIN  | Oversees the platform via the dashboard          |

## Working with the Frontend

The companion frontend lives in `../zerowaste-meals-frontend` (React + Vite). The Vite dev server proxies `/api` to this backend on port `8080`, so both can run together via:

```bash
# backend
./mvnw spring-boot:run

# frontend (separate terminal)
cd ../zerowaste-meals-frontend
npm run dev
```

## Project Structure

```
src/main/java/com/zerowastemeals/backend/
├── config/         Security, JWT filter/service, app beans
├── controller/     REST controllers
├── dto/            Request/response records
├── entity/         JPA entities + enums
├── exception/      Custom exceptions + global handler
├── repository/     Spring Data repositories
├── security/       UserDetails + UserPrincipal
├── service/        Business logic
└── util/           Constants, JWT utilities
```
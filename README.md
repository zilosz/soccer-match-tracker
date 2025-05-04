# Soccer Match Tracker

A full-stack monorepo application for tracking soccer matches. A publically-accessible URL can be found [here](http://ec2-54-227-33-102.compute-1.amazonaws.com:5173/matches).

### Tech Stack
- Frontend: *React.js*
- Backend: *Node.js*, *Express.js*
- Database: *MySQL*

## Running in Development

You must have a running local MySQL server with an existing database. \
Entire application can be ran from the project root directory.

```
pnpm install
pnpm dev
```
## Running in Production

The application frontend, backend, and database are dockerized.
```
docker compose build
docker compose up -d
```

## Environment Variables

### Frontend:
- `VITE_API_URL`: The URL of the backend. Use `http://localhost:8080` in development.

### Backend:
- `MYSQL_ROOT_PASSWORD`: The password for the root user in the MySQL server. Only used in production.
- `MYSQL_DATABASE`: The name of the MySQL database.
- `MYSQL_USER`: The name of the user to create in the MySQL server. Only used in production.
- `MYSQL_PASSWORD`: The password of the created MySQL user. Only used in production.
- `DB_HOST`: The hostname of the MySQL server. Use `localhost` in development and `db` in production.
- `DB_USER`: The username used to connect to database.
- `DB_PORT`: The port of the MySQL server. Typically `3306`.
- `DB_PASSWORD`: The password of the MySQL user.
- `FRONTEND_URL`: The URL of the frontend. Use `http://localhost:5173` in development.


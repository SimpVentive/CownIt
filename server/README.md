# CownIt Backend Server

Node.js + Express backend using MySQL for the CownIt commitment tracking application.

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Create a `.env` file from the example:

```bash
copy .env.example .env
```

3. Configure MySQL connection in `.env`.

4. Start the server:

```bash
npm start
```

For development with automatic reload:

```bash
npm run dev
```

Server runs on `http://localhost:6001` by default.

## Environment Variables

Create `server/.env` with:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cownit
JWT_SECRET=cownit-secret-key-dev
BACKENDPORT=6001
```

## Database

- **MySQL**: Database is created automatically if it does not exist
- **Auto-seed**: Initial people are inserted on first startup if the `people` table is empty
- **Tables**: people, commits, achievements, monthlyUpdates, messages, hrComments

## API Routes

### Auth
- `POST /api/auth/login` - Login and get JWT token

### People
- `GET /api/people` - List all people

### Commits
- `GET /api/commits` - List all commits
- `POST /api/commits` - Create new commit

### Achievements
- `GET /api/achievements` - List all achievements
- `POST /api/achievements` - Create new achievement

### Monthly Updates
- `GET /api/monthlyUpdates` - List all updates
- `POST /api/monthlyUpdates` - Create new update

### Messages
- `GET /api/messages` - List all messages
- `POST /api/messages` - Create new message
- `PUT /api/messages/:id/read` - Mark message as read

### HR Comments
- `GET /api/hrComments` - List all comments
- `POST /api/hrComments` - Create new comment

## Authentication

All endpoints (except `/api/auth/login` and `/api/health`) require a JWT token in the `Authorization: Bearer <token>` header.

## Notes

- The server now uses MySQL instead of SQLite.
- Make sure your MySQL user has rights to create databases and tables.

# CownIt Backend Server

SQLite + Node.js/Express backend for the CownIt commitment tracking application.

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`

## Database

- **SQLite**: File-based at `cownit.db` (auto-created on first run)
- **Auto-seed**: Initial 4 people loaded on first startup
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

All endpoints (except `/auth/login` and `/health`) require a JWT token in the `Authorization: Bearer <token>` header.

## Next Steps

Update the React app to use the API client at `../cownit/src/services/api.js` instead of direct state management.

# KOICA DX Center Authentication Server

Backend API server for user authentication and management.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env` if needed
- Update `JWT_SECRET` with a secure random string

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### User Profile
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `PUT /api/users/password` - Update password (requires auth)

## Database

Using SQLite with the following tables:
- `users` - User accounts
- `sessions` - Active sessions (optional)

Database file: `database.sqlite`

## Security

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Input validation with express-validator
- CORS protection

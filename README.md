# Housing Complex Portal

A web application for managing a multi-unit family housing complex, featuring resident authentication and a resident portal.

## Features

- Resident authentication (login/register)
- Resident profile management
- Maintenance request system
- Announcements board

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database and initialize it:
   ```bash
   psql -U postgres -f db/init.sql
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new resident
- POST `/api/auth/login` - Login resident
- GET `/api/auth/me` - Get current resident

### Residents
- GET `/api/residents/profile` - Get resident profile
- PUT `/api/residents/profile` - Update resident profile

## Security

- Passwords are hashed using bcrypt
- JWT authentication
- Protected routes using middleware
- Input validation using express-validator

## License

MIT #   R e a l E s t a t e _ D e m o  
 
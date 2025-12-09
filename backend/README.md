# Golden9 Backend Server

This is the backend server for the Golden9 Billiards Club Management System.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the database connection settings in `.env`:
     - `DB_HOST`: PostgreSQL host (default: localhost)
     - `DB_NAME`: Database name (default: golden9-db)
     - `DB_USER`: PostgreSQL username
     - `DB_PASSWORD`: PostgreSQL password
     - `DB_PORT`: PostgreSQL port (default: 5432)
     - `JWT_SECRET`: A secure random string for JWT token signing

3. **Setup Database**
   - Make sure PostgreSQL is running
   - Create the database and run the schema setup:
     ```bash
     psql -U your_username -d golden9-db -f ../schema_setup.sql
     ```

4. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will run on `http://localhost:3000`

## API Endpoints

### Authentication (No Token Required)
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management (Requires JWT Token)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Event Management (Requires JWT Token)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Product Management (Requires JWT Token)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Notes

- All API endpoints (except `/api/register` and `/api/login`) require a valid JWT token in the Authorization header: `Bearer <token>`
- The server uses CORS to allow requests from the frontend
- Make sure your PostgreSQL database is running and accessible before starting the server


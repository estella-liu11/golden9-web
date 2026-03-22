# Golden9 - Premier Cue Sports Club Management System

<div align="center">
  <p>
    <strong>New Zealand's Premier Cue Sports Club Management Platform</strong>
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#api-documentation">API Docs</a>
  </p>
</div>

---

## 📌 Project Overview

Golden9 is a full-stack web application designed for billiard club operations, featuring member management, event organization, product showcase, and Role-Based Access Control (RBAC).

### Key Features

- 🔐 **Secure Authentication** - JWT-based session management with encrypted password storage (bcrypt)
- 👥 **User Management** - Member registration, login, and profile management
- 📅 **Event Management** - Create, update, and manage club events and tournaments
- 🏆 **Leaderboard** - Real-time ranking system for members
- 🛒 **Product Showcase** - Display cue sticks and club merchandise
- 🎓 **Coach Profiles** - Professional coaching staff information
- 🔑 **Role-Based Access** - Distinct interfaces for members and administrators

---

## 🛠 Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.5 - Build tool
- **Tailwind CSS** 4.1.17 - Styling
- **React Router** 7.10.1 - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **PostgreSQL** - Relational database
- **JSON Web Token (JWT)** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 13+ installed and running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/estella-liu11/golden9-web.git
   cd golden9-web
   ```

2. **Setup Database**
   ```bash
   # Create the database
   psql -U your_username -d postgres -c "CREATE DATABASE golden9-db;"
   
   # Run the schema script
   psql -U your_username -d golden9-db -f schema_setup.sql
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file based on .env.example
   cp .env.example .env
   # Edit .env with your database credentials
   
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   # From project root
   npm install
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=golden9-db
DB_USER=your_pg_user
DB_PASSWORD=your_database_password
DB_PORT=5432

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key

# Server Port (optional)
PORT=3000
```

---

## 📁 Project Structure

```
golden9/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server entry point
│   ├── .env.example        # Environment template
│   ├── SETUP.md            # Backend setup guide
│   └── package.json
├── src/                     # React frontend
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── Shop.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Membership.jsx
│   │   ├── Coach.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── Admin.jsx
│   ├── services/          # API service layer
│   └── App.jsx            # Main application
├── public/                  # Public static files
├── schema_setup.sql        # Database schema
└── package.json
```

---

## 📡 API Documentation

### Authentication Endpoints (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |

### User Management (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Event Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access Control**: Admin and User roles
- **CORS Protection**: Configured for specific origins
- **Environment Variables**: Sensitive data stored in `.env` files

---

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Member Login**: http://localhost:5173/login?role=user
- **Admin Login**: http://localhost:5173/login?role=admin
- **Backend API**: http://localhost:3000

---

## 📝 License

This project is licensed under the ISC License.

---

## 👤 Author

Estella Liu

---

## 🙏 Acknowledgments

- React.js and the Vite team
- Express.js community
- PostgreSQL team

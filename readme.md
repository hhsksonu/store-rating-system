# 🏪 Store Rating System

A full-stack web application that allows users to rate and review stores, with role-based access control for administrators, normal users, and store owners.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v14+-green.svg)
![React](https://img.shields.io/badge/react-v18+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-v13+-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For All Users
- 🔐 Secure JWT-based authentication
- 🔒 Password hashing with bcrypt
- 👁️ Password visibility toggle
- 🔄 Update password functionality
- 🚪 Secure logout

### For System Administrators
- 📊 Dashboard with system statistics
- 👥 User management (add, view, filter, sort)
- 🏪 Store management (add, view, filter, sort)
- 🔍 Advanced filtering and sorting capabilities
- 📈 Total counts for users, stores, and ratings

### For Normal Users
- ✍️ User registration and login
- 🏪 Browse all stores
- 🔍 Search stores by name and address
- ⭐ Rate stores (1-5 stars)
- ✏️ Update existing ratings
- 📊 View overall store ratings and personal ratings

### For Store Owners
- 📊 Personal dashboard
- ⭐ View average store rating
- 👥 See list of users who rated the store
- 📅 Rating timestamps

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **Environment Variables:** dotenv
- **CORS:** cors middleware

### Frontend
- **Framework:** React.js (Functional Components)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Custom CSS
- **State Management:** React Hooks (useState, useEffect)

## 📁 Project Structure

```
store-rating-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   └── storeOwnerController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   └── storeOwnerRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── userValidator.js
│   │   ├── storeValidator.js
│   │   └── ratingValidator.js
│   ├── .env
│   ├── schema.sql
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminUsers.js
│   │   │   │   ├── AdminStores.js
│   │   │   │   ├── AddUser.js
│   │   │   │   ├── AddStore.js
│   │   │   │   └── Admin.css
│   │   │   ├── User/
│   │   │   │   ├── UserStores.js
│   │   │   │   ├── UpdatePassword.js
│   │   │   │   └── User.css
│   │   │   ├── StoreOwner/
│   │   │   │   ├── StoreOwnerDashboard.js
│   │   │   │   └── StoreOwner.css
│   │   │   └── Common/
│   │   │       ├── Navbar.js
│   │   │       └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Auth.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── validation.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/yourusername/store-rating-system.git
cd store-rating-system
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=store_rating_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. To change this, update the `API_BASE_URL` in `frontend/src/utils/api.js`.

## 🗄️ Database Setup

### Create Database

```bash
psql -U postgres
CREATE DATABASE store_rating_db;
\q
```

### Run Schema

```bash
psql -U postgres -d store_rating_db -f backend/schema.sql
```

### Generate Admin Password Hash

```bash
cd backend
node hashPassword.js
```

Copy the generated hash and update the INSERT statement in `schema.sql`, then re-run the schema.

### Default Admin Credentials

- **Email:** admin@storerating.com
- **Password:** Admin@123

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Application opens on `http://localhost:3000`

## 👥 User Roles & Permissions

### System Administrator
- View dashboard statistics
- Manage users (create, view, filter, sort)
- Manage stores (create, view, filter, sort)
- Access to all system features

### Normal User
- Register and login
- Browse stores
- Search stores by name/address
- Submit ratings (1-5 stars)
- Update personal ratings
- View overall and personal ratings

### Store Owner
- View store dashboard
- See average rating
- View list of users who rated the store
- View rating history with timestamps

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user

**Request Body:**
```json
{
  "name": "John Doe Test Account User",
  "email": "john@example.com",
  "password": "Test@123",
  "address": "123 Main Street, City, State 12345"
}
```

#### POST /api/auth/login
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Test@123"
}
```

#### PUT /api/auth/update-password
Update password (requires authentication)

**Request Body:**
```json
{
  "currentPassword": "Test@123",
  "newPassword": "NewTest@456"
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### GET /api/admin/dashboard/stats
Get dashboard statistics

#### GET /api/admin/users
Get all users with filtering and sorting

**Query Parameters:**
- `name` - Filter by name
- `email` - Filter by email
- `address` - Filter by address
- `role` - Filter by role
- `sortBy` - Sort column
- `sortOrder` - asc/desc

#### POST /api/admin/users
Add new user

#### GET /api/admin/stores
Get all stores with filtering and sorting

#### POST /api/admin/stores
Add new store

### User Endpoints

Require authentication and user role.

#### GET /api/user/stores
Get all stores with search

**Query Parameters:**
- `name` - Search by store name
- `address` - Search by address

#### POST /api/user/ratings
Submit rating

**Request Body:**
```json
{
  "storeId": "uuid-here",
  "rating": 5
}
```

#### PUT /api/user/ratings
Update rating

### Store Owner Endpoints

#### GET /api/store-owner/dashboard
Get store owner dashboard

## 🎨 Validation Rules

### Name
- 20-60 characters
- Required for all users and stores

### Email
- Valid email format
- Unique across the system

### Password
- 8-16 characters
- At least 1 uppercase letter
- At least 1 special character (!@#$%^&*(),.?":{}|<>)

### Address
- Maximum 400 characters
- Required field

### Rating
- Integer between 1 and 5
- One rating per user per store

## 📸 Screenshots

### Login Page
Clean and modern login interface with password visibility toggle.

### Admin Dashboard
Overview of system statistics and quick action buttons.

### User Store List
Browse and rate stores with search functionality.

### Store Owner Dashboard
View average ratings and customer feedback.

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ Role-based access control (RBAC)
- ✅ Input validation on both frontend and backend
- ✅ SQL injection prevention with parameterized queries
- ✅ CORS protection
- ✅ Protected routes
- ✅ Token expiration (24 hours)

## 🧪 Testing

### Test Credentials

**Admin:**
- Email: admin@storerating.com
- Password: Admin@123

**Test User:**
Create via signup page

### Sample Test Data

**Valid Name:** "John Michael Doe Test Account User"
**Valid Address:** "123 Main Street, Springfield, IL 62701, United States"
**Valid Password:** Test@123

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built as a full-stack internship coding challenge
- Demonstrates modern web development practices
- Follows industry-standard architecture patterns

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**⭐ If you found this project helpful, please give it a star!**
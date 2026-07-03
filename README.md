# 🚗 MotoFix Pro

A full-stack garage management system built with the MERN stack that helps mechanics and garage owners efficiently manage customers, vehicles, services, and billing.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### ✅ Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing (bcrypt)
- HttpOnly Cookie-based Authentication
- Logout Functionality

### ✅ Customer Management
- Create Customer
- Get All Customers
- Get Customer by ID
- Update Customer Details
- Delete Customer
- User-specific Data Authorization

### 🚧 Upcoming Features
- Vehicle Management
- Service Records
- Job Cards
- Invoicing System
- Dashboard & Analytics
- Search & Filtering
- Role-based Access

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcrypt
- HttpOnly Cookies

### Development Tools
- Git
- GitHub
- Postman
- VS Code


MotoFix-Pro/
│
├── backend/
│   ├── src/
│   │   ├── Controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── Routes/
│   │   ├── Services/
│   │   └── utils/
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│
├── .gitignore
└── README.md



## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jagdeepsheokand/motofix-pro.git
```

### 2. Navigate to the Project

```bash
cd MotoFix-Pro
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `backend` directory and add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

## ▶️ Running the Project

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/profile` | Get logged-in user profile |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers` | Create a customer |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get customer by ID |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |


## 🗺️ Project Roadmap

- [x] Project Setup
- [x] User Authentication
- [x] Customer Management
- [ ] Vehicle Management
- [ ] Service Management
- [ ] Job Cards
- [ ] Invoice Generation
- [ ] Dashboard & Analytics
- [ ] Search & Filtering
- [ ] Deployment

## 👨‍💻 Author

**Jagdeep Sheokand**

- GitHub: https://github.com/jagdeepsheokand

## 📄 License

This project is currently under development.
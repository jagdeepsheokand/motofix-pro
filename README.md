# 🚗 MotoFix Pro

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

MotoFix Pro is a **full-stack Garage Management System** built with the **MERN Stack**. It helps mechanics and garage owners efficiently manage customers, vehicles, repair jobs, inventory, invoices, and business analytics through a modern and responsive web application.

> **Current Status:** ✅ Full-Stack Application Completed

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- HttpOnly Cookie Authentication
- Protected Routes
- Password Hashing (bcrypt)
- User Profile
- Logout

---

## 👥 Customer Management

- Add Customers
- View Customer List
- Search Customers
- Update Customer Information
- Delete Customers
- User-specific Data Isolation

---

## 🚗 Vehicle Management

- Register Vehicles
- Customer-Vehicle Relationship
- View Vehicle Details
- Update Vehicle Information
- Delete Vehicles
- Search & Pagination

---

## 🔧 Repair Job Management

- Create Repair Jobs
- Assign Customer & Vehicle
- Diagnostic Notes
- Repair Status Tracking
- Labor Cost
- Parts Cost
- Estimated Delivery Date
- Payment Tracking
- Balance Due Calculation

---

## 📦 Inventory Management

- Add Spare Parts
- Update Inventory
- Delete Inventory Items
- Increase/Decrease Stock
- Low Stock Alerts
- Search Inventory
- Filter by Category
- Pagination
- Automatic Stock Adjustment

---

## 🧾 Invoice Management

- Create Invoices
- Automatic Invoice Number Generation
- One Invoice per Repair Job
- Automatic Total Calculation
- Tax & Discount Support
- Payment Status
- Payment Method
- Inventory Price Lookup
- Invoice Editing
- Invoice Deletion

---

## 📊 Dashboard Analytics

- Total Customers
- Total Vehicles
- Total Repair Jobs
- Inventory Count
- Low Stock Items
- Pending Payments
- Monthly Revenue
- Business Overview Cards

---

# 💻 Frontend Features

- Responsive Dashboard
- Mobile-Friendly Layout
- Sidebar Navigation
- Protected Routes
- Reusable Components
- Search & Pagination
- Loading Indicators
- Error Handling
- Form Validation
- Clean UI Design

---

# 🌟 Highlights

- Full MERN Stack Application
- RESTful API Architecture
- JWT Authentication
- Secure HttpOnly Cookies
- MongoDB Aggregation Pipelines
- Automatic Invoice Number Generation
- Inventory Auto Stock Management
- Dashboard Analytics
- Responsive Design
- Component-Based React Architecture

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt
- HttpOnly Cookies

## Tools

- Git
- GitHub
- VS Code
- Postman
- npm

---

# 📁 Project Structure

```text
MotoFix-Pro/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── db/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/jagdeepsheokand/motofix-pro.git
```

```bash
cd MotoFix-Pro
```

---

## Install Backend

```bash
cd backend
npm install
```

---

## Install Frontend

```bash
cd ../frontend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# ▶️ Running the Project

## Backend

```bash
cd backend
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 📡 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/profile` |

---

## Customers

| Method | Endpoint |
|---------|----------|
| POST | `/api/customers` |
| GET | `/api/customers` |
| GET | `/api/customers/:id` |
| PUT | `/api/customers/:id` |
| DELETE | `/api/customers/:id` |

---

## Vehicles

| Method | Endpoint |
|---------|----------|
| POST | `/api/vehicles` |
| GET | `/api/vehicles` |
| GET | `/api/vehicles/:id` |
| PUT | `/api/vehicles/:id` |
| DELETE | `/api/vehicles/:id` |

---

## Repair Jobs

| Method | Endpoint |
|---------|----------|
| POST | `/api/repair-jobs` |
| GET | `/api/repair-jobs` |
| GET | `/api/repair-jobs/:id` |
| PUT | `/api/repair-jobs/:id` |
| DELETE | `/api/repair-jobs/:id` |

---

## Inventory

| Method | Endpoint |
|---------|----------|
| POST | `/api/inventory` |
| GET | `/api/inventory` |
| GET | `/api/inventory/:id` |
| PUT | `/api/inventory/:id` |
| DELETE | `/api/inventory/:id` |
| PATCH | `/api/inventory/:id/stock` |

---

## Invoices

| Method | Endpoint |
|---------|----------|
| POST | `/api/invoices` |
| GET | `/api/invoices` |
| GET | `/api/invoices/:id` |
| PUT | `/api/invoices/:id` |
| DELETE | `/api/invoices/:id` |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/api/dashboard` |

---

# 📈 Project Status

## ✅ Backend

- Authentication
- Customer Management
- Vehicle Management
- Repair Job Management
- Inventory Management
- Invoice System
- Dashboard Analytics

---

## ✅ Frontend

- Authentication
- Dashboard
- Customer Management
- Vehicle Management
- Repair Job Management
- Inventory Management
- Invoice Management
- Responsive Layout
- Protected Routes
- Search & Pagination
- Form Validation

---

# 📸 Screenshots


### Login

<img width="100%" alt="Login Screenshot" src="docs/login.png"/>

### Dashboard

<img width="100%" alt="Dashboard Screenshot" src="docs/dashboard.png"/>

### Customers

<img width="100%" alt="Customers Screenshot" src="docs/customer.png"/>

### Vehicles

<img width="100%" alt="Vehicles Screenshot" src="docs/vehicles.png"/>

### Repair Jobs

<img width="100%" alt="Repair Jobs Screenshot" src="docs/repair-jobs.png"/>

### Inventory

<img width="100%" alt="Inventory Screenshot" src="docs/inventory.png"/>

### Invoices

<img width="100%" alt="Invoices Screenshot" src="docs/invoices.png"/>

---

# 🚀 Future Enhancements

- Role-Based Access Control (Admin / Mechanic)
- PDF Invoice Generation
- Email Invoice Delivery
- SMS Notifications
- Appointment Scheduling
- Image Uploads
- Service History
- Customer Portal
- Dark Mode
- Progressive Web App (PWA)
- Advanced Reports & Analytics
- Real-time Notifications (Socket.IO)

---

# 🌐 Deployment

Frontend: Coming Soon

Backend API: Coming Soon

---

# 👨‍💻 Author

**Jagdeep Sheokand**

GitHub: https://github.com/jagdeepsheokand

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

⭐ If you found this project helpful, consider giving it a **Star** on GitHub!
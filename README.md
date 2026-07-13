# 🚗 MotoFix Pro

A full-stack **Garage Management System** built with the **MERN Stack** to help mechanics and garage owners efficiently manage customers, vehicles, repair jobs, inventory, invoices, and business analytics.

> **Current Status:** ✅ Backend Complete | 🚧 Frontend In Progress

---

# ✨ Features

## 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* HttpOnly Cookie-based Authentication
* Protected Routes
* Secure Password Hashing (bcrypt)
* User Profile
* Logout

---

## 👥 Customer Management

* Create Customer
* View All Customers
* View Customer by ID
* Update Customer
* Delete Customer
* User-specific Ownership Authorization

---

## 🚗 Vehicle Management

* Add Vehicle
* View All Vehicles
* View Vehicle Details
* Update Vehicle
* Delete Vehicle
* Customer-Vehicle Relationship
* Ownership Validation

---

## 🔧 Repair Job Management

* Create Repair Job
* View Repair Jobs
* Update Job Status
* Delete Repair Job
* Diagnostic Notes
* Estimated Delivery Date
* Labor Cost
* Parts Cost
* Payment Tracking
* Balance Due Calculation

---

## 📦 Inventory Management

* Add Inventory Items
* Update Inventory
* Delete Inventory Items
* Stock Increase/Decrease
* Low Stock Alerts
* Search Inventory
* Filter Inventory
* Sorting
* Pagination
* Ownership Authorization

---

## 🧾 Invoice Management

* Automatic Invoice Number Generation
* One Invoice per Repair Job
* Automatic Total Calculation
* Tax & Discount Support
* Payment Status
* Payment Method
* Inventory Price Lookup

---

## 📊 Dashboard Analytics

* Total Customers
* Total Vehicles
* Total Repair Jobs
* Low Stock Count
* Pending Payments
* Monthly Revenue Aggregation

---

# 🛠 Tech Stack

## Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT
* bcrypt
* HttpOnly Cookies

## Tools

* Git
* GitHub
* Postman
* VS Code

---

# 📁 Project Structure

```text
MotoFix-Pro/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
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
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# ▶️ Run the Project

## Backend

```bash
cd backend
npm run dev
```

## Frontend

```bash
cd frontend
npm run dev
```

---

# 📡 API Modules

## Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/logout`
* GET `/api/auth/profile`

## Customers

* POST `/api/customers`
* GET `/api/customers`
* GET `/api/customers/:id`
* PUT `/api/customers/:id`
* DELETE `/api/customers/:id`

## Vehicles

* POST `/api/vehicles`
* GET `/api/vehicles`
* GET `/api/vehicles/:id`
* PUT `/api/vehicles/:id`
* DELETE `/api/vehicles/:id`

## Repair Jobs

* POST `/api/repair-jobs`
* GET `/api/repair-jobs`
* GET `/api/repair-jobs/:id`
* PUT `/api/repair-jobs/:id`
* DELETE `/api/repair-jobs/:id`

## Inventory

* POST `/api/inventory`
* GET `/api/inventory`
* GET `/api/inventory/:id`
* PUT `/api/inventory/:id`
* DELETE `/api/inventory/:id`
* PATCH `/api/inventory/:id/stock`

## Invoices

* POST `/api/invoices`
* GET `/api/invoices`
* GET `/api/invoices/:id`
* PUT `/api/invoices/:id`
* DELETE `/api/invoices/:id`

## Dashboard

* GET `/api/dashboard`

---

# 📈 Current Progress

## ✅ Backend

* Authentication
* Customer Management
* Vehicle Management
* Repair Job Management
* Inventory Management
* Invoice System
* Dashboard Analytics

## 🚧 Frontend

* Authentication UI
* Dashboard
* Customer Module
* Vehicle Module
* Repair Job Module
* Inventory Module
* Invoice Module

---

# 🚀 Future Enhancements

* Role-based Access Control
* Inventory Transaction History
* PDF Invoice Generation
* Image Uploads
* Email Notifications
* SMS Notifications
* Appointment Booking
* Real-time Updates (Socket.IO)
* Online Payments
* Advanced Reporting

---

# 👨‍💻 Author

**Jagdeep Sheokand**

GitHub: https://github.com/jagdeepsheokand

---

# 📄 License

This project is licensed under the MIT License.

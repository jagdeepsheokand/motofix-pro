require('dotenv').config();
const cors = require('cors');  
const express = require('express');
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customer.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const repairJobRoutes=require('./routes/repairJob.routes');
const authRoutes = require('./routes/auth.routes');
const inventoryRoutes= require('./routes/inventory.routes');
const invoiceRoutes= require('./routes/invoice.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

app.use("/api/auth",authRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/vehicles',vehicleRoutes);
app.use('/api/repair-jobs',repairJobRoutes);
app.use('/api/inventory',inventoryRoutes);
app.use('/api/invoices',invoiceRoutes);
app.use('/api/dashboard',dashboardRoutes);



module.exports =app;

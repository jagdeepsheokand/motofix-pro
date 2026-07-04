require('dotenv').config();
const cors = require('cors');  
const express = require('express');
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customer.routes');
const vehicleRoutes = require('./routes/Vehicle.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',   // Vite default port
    credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/vehicles',vehicleRoutes);



module.exports =app;

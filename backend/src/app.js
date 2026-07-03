require('dotenv').config();
const cors = require('cors');  
const express = require('express');
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customer.routes');
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



module.exports =app;

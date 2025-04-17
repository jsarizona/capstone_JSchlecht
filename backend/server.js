require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const updateRoutes= require('./routes/updateRoutes');
const getUsers= require('./routes/getUserRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/users', getUsers)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () =>
  console.log(`🚀 HTTPS Server running at https://localhost:${PORT}`)
);
*/
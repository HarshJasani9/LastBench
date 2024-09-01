const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('LastBench API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

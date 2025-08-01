const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dentalclinic', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', contactRoutes);
app.use('/api/payment', paymentRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

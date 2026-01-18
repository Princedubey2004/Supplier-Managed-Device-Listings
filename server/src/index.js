
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Tortoise API is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/employee', employeeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Routes
app.use('/health', healthRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query Params:', req.query);
  }

  // Capture the original res.json to log responses
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    console.log('='.repeat(80) + '\n');
    return originalJson(data);
  };

  next();
});

// Import routes
const prospectRoutes = require('./routes/prospects');
const marketAnalysisRoutes = require('./routes/marketAnalysis');
const userRoutes = require('./routes/users');
const lushaRoutes = require('./routes/lusha');

// Routes
app.use('/api/prospects', prospectRoutes);
app.use('/api/market-analysis', marketAnalysisRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lusha', lushaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

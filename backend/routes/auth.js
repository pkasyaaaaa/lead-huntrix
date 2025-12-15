const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM public.users WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      INSERT INTO public.users (username, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING user_id, username, email, created_at
    `;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const result = await pool.query(insertQuery, [username, email, hashedPassword]);

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user.user_id,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const query = 'SELECT * FROM public.users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      userId: user.user_id,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Company Info
router.post('/company-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;
    const { companyName, businessType, companySize, occupation, primaryGoal } = req.body;

    // Validate input
    if (!companyName || !businessType || !companySize || !occupation || !primaryGoal) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert or update company info
    const query = `
      INSERT INTO public.company_info (user_id, company_name, business_type, company_size, occupation, primary_goal, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        company_name = $2,
        business_type = $3,
        company_size = $4,
        occupation = $5,
        primary_goal = $6,
        updated_at = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [userId, companyName, businessType, companySize, occupation, primaryGoal]);

    res.json({
      message: 'Company information saved successfully',
      userId,
      companyInfo: result.rows[0]
    });
  } catch (error) {
    console.error('Company info error:', error);
    res.status(500).json({ message: 'Server error saving company info', error: error.message });
  }
});

// Verify token middleware for protected routes
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    res.json({
      message: 'Token is valid',
      userId: decoded.userId,
      email: decoded.email
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;

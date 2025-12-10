const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool for Supabase
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to Supabase database:', err.message);
    return;
  }
  console.log('Successfully connected to Supabase (PostgreSQL) database');
  release();
});

// Wrapper to match mysql2 promise API
const promisePool = {
  query: async (text, params) => {
    const result = await pool.query(text, params);
    return [result.rows, result.fields];
  }
};

module.exports = promisePool;

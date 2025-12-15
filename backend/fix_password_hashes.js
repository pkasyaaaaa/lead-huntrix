// Script to update all users' password_hash to a real bcrypt hash for 'hash123'
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

async function updateAllPasswords() {
  const plainPassword = 'hash123';
  const hash = await bcrypt.hash(plainPassword, 10);
  await pool.query('UPDATE public.users SET password_hash = $1', [hash]);
  console.log('All user password_hash values updated to real bcrypt hash.');
  process.exit(0);
}

updateAllPasswords().catch(e => { console.error(e); process.exit(1); });

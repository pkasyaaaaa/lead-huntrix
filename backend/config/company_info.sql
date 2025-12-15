-- Add company_info table for storing user company information
CREATE TABLE IF NOT EXISTS company_info (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  company_size VARCHAR(100),
  occupation VARCHAR(100),
  primary_goal VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_info_user_id ON company_info(user_id);

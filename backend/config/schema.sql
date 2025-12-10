-- Use existing database
USE leadhuntrix;

-- Users table already exists with structure:
-- user_id, username, email, password_hash, created_at

-- user_data table already exists with structure:
-- id, user_id, lusha_id, name, JobTitle

-- Prospects table (extends user_data with additional fields)
CREATE TABLE IF NOT EXISTS prospects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_data_id INT,
  lusha_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  management_level VARCHAR(100),
  department VARCHAR(100),
  location VARCHAR(255),
  industry VARCHAR(100),
  skills TEXT,
  company_name VARCHAR(255),
  company_size VARCHAR(50),
  company_founded_year INT,
  company_revenue VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_data_id) REFERENCES user_data(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_user_data_id (user_data_id),
  INDEX idx_job_title (job_title),
-- User filters table (for saving user's filter preferences)
CREATE TABLE IF NOT EXISTS user_filters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filter_name VARCHAR(255) NOT NULL,
  job_titles JSON,
  management_levels JSON,
  departments JSON,
  locations JSON,
  industries JSON,
  skills JSON,
  company_sizes JSON,
  founded_year_range VARCHAR(50),
  revenue_ranges JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Market analysis history table
CREATE TABLE IF NOT EXISTS market_analysis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  query TEXT NOT NULL,
  analysis_result JSON,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Prospect lists (saved lists)
CREATE TABLE IF NOT EXISTS prospect_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  list_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Prospect list items (many-to-many relationship)
CREATE TABLE IF NOT EXISTS prospect_list_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  list_id INT NOT NULL,
  prospect_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES prospect_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_list_prospect (list_id, prospect_id),
  INDEX idx_list_id (list_id),
  INDEX idx_prospect_id (prospect_id)
);

-- Note: Users table already has existing data
-- Sample prospects can be added if needed, using existing user_id values from your users table
-- Example: INSERT INTO prospects (user_id, name, job_title, ...) SELECT user_id, ... FROM users WHERE username = 'your_username';

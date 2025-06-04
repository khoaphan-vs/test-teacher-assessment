-- Create users table for storing teacher profiles
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  school VARCHAR(255),
  role VARCHAR(50) DEFAULT 'teacher',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create reports table for storing generated reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_first_name VARCHAR(255) NOT NULL,
  student_last_name VARCHAR(255) NOT NULL,
  student_class VARCHAR(50),
  student_gender VARCHAR(20),
  report_form VARCHAR(20),
  school_location VARCHAR(255),
  support_services TEXT[], -- Array of support services
  therapies TEXT[], -- Array of therapies
  assessment_data JSONB, -- Store assessment selections as JSON
  generated_report TEXT, -- The final generated report
  report_settings JSONB, -- Store report generation settings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster report lookups
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- Insert some sample data for testing
INSERT INTO users (clerk_id, email, first_name, last_name, school, role) 
VALUES 
  ('demo_clerk_id', 'demo@schule.ch', 'Demo', 'Lehrperson', 'Primarschule Musterstadt', 'teacher')
ON CONFLICT (clerk_id) DO NOTHING;

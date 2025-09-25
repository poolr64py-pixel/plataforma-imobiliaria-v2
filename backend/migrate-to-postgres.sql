CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  location VARCHAR(255),
  coordinates JSONB,
  area DECIMAL(10,2),
  area_unit VARCHAR(50),
  type VARCHAR(50),
  purpose VARCHAR(50),
  status VARCHAR(50),
  features TEXT[],
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  reviews INTEGER DEFAULT 0
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tenant VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
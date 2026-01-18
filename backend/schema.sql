-- Drop tables if they exist
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL CHECK (char_length(address) <= 400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL CHECK (char_length(address) <= 400),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);

-- Insert default admin user (password: Admin@123)
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'System Administrator Account', 
    'admin@storerating.com', 
    '$2b$10$CtQOZuljK4zmjFM.iufT6.inosOndIQBW58rfj4.h0SDfYZgZScMS',
    '203 Real Residence Admin Street 2, Pune, Maharastra - 421568, India',
    'admin'
);

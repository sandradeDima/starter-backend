-- Insert default roles
INSERT IGNORE INTO roles (name) VALUES ('admin');
INSERT IGNORE INTO roles (name) VALUES ('user');

-- Insert admin user (password: Admin123!)
INSERT IGNORE INTO users (email, password_hash, name, role_id) 
VALUES ('admin@admin.com', '$2a$10$placeholder', 'Admin User', 1);
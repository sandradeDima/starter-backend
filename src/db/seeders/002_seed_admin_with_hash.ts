import { pool } from '../pool';
import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger';

export async function seedAdmin() {
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Insert default roles
    await pool.query("INSERT IGNORE INTO roles (name) VALUES ('admin')");
    await pool.query("INSERT IGNORE INTO roles (name) VALUES ('user')");
    
    // Insert admin user
    await pool.query(`
      INSERT IGNORE INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, 1)
    `, ['admin@admin.com', hashedPassword, 'Admin User']);
    
    logger.info('✅ Admin user seeded successfully');
    logger.info('📧 Email: admin@admin.com');
    logger.info('🔑 Password: Admin123!');
  } catch (error) {
    logger.error(`❌ Failed to seed admin user: ${error instanceof Error ? error.message : String(error as Error)}`);
    throw error;
  }
}

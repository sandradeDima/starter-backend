import { pool } from '../pool';
import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger';

export async function seedTestUser() {
  try {
    // Hash the test user password
    const hashedPassword = await bcrypt.hash('user_password', 10);
    
    // Insert test user with role 2 (user)
    await pool.query(`
      INSERT IGNORE INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
    `, ['user@test.com', hashedPassword, 'Test User', 2]);
    
    logger.info('✅ Test user seeded successfully');
    logger.info('📧 Email: user@test.com');
    logger.info('🔑 Password: user_password');
    logger.info('👤 Role: user (2)');
  } catch (error) {
    logger.error(`❌ Failed to seed test user: ${error instanceof Error ? error.message : String(error as Error)}`);
    throw error;
  }
}

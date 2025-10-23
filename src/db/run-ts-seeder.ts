import { pool } from './pool';
import { logger } from '../config/logger';

// Import TypeScript seeders
import { seedAdmin } from './seeders/002_seed_admin_with_hash';
import { seedTestUser } from './seeders/003_seed_test_user';

const seeders = {
  '002_seed_admin_with_hash': seedAdmin,
  '003_seed_test_user': seedTestUser
};

const seederName = process.argv[2];

(async () => {
  try {
    if (!seederName) {
      logger.error('❌ Please provide a seeder name');
      logger.info('Available TypeScript seeders:');
      Object.keys(seeders).forEach(name => logger.info(`  - ${name}`));
      process.exit(1);
    }

    const seeder = seeders[seederName as keyof typeof seeders];
    
    if (!seeder) {
      logger.error(`❌ Seeder not found: ${seederName}`);
      logger.info('Available TypeScript seeders:');
      Object.keys(seeders).forEach(name => logger.info(`  - ${name}`));
      process.exit(1);
    }

    logger.info(`🌱 Running TypeScript seeder: ${seederName}`);
    await seeder();
    logger.info('✅ TypeScript seeder completed successfully!');
    
  } catch (error) {
    logger.error(`❌ TypeScript seeder failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();

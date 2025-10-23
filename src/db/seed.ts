import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { pool } from './pool';
import { logger } from '../config/logger';

interface Seeder {
  name: string;
  run: () => Promise<void>;
}

class SeederRunner {
  private seeders: Seeder[] = [];

  constructor() {
    this.loadSeeders();
  }

  private loadSeeders() {
    const seedersDir = join(__dirname, 'seeders');
    
    // Check if seeders directory exists
    try {
      const files = readdirSync(seedersDir)
        .filter(f => f.endsWith('.sql') || f.endsWith('.ts'))
        .sort();

      this.seeders = files.map(file => ({
        name: file,
        run: async () => {
          if (file.endsWith('.sql')) {
            const sql = readFileSync(join(seedersDir, file), 'utf8');
            
            // Split SQL into individual statements and execute them one by one
            const statements = sql
              .split(';')
              .map(stmt => stmt.trim())
              .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            for (const statement of statements) {
              if (statement.trim()) {
                await pool.query(statement);
              }
            }
            
            logger.info(`✅ Applied SQL seeder: ${file}`);
          } else if (file.endsWith('.ts')) {
            // For TypeScript seeders, we'll need to import them dynamically
            // This is a simplified approach - in production you might want to use a different strategy
            logger.warn(`TypeScript seeder ${file} detected but not automatically executed.`);
            logger.warn('Please run TypeScript seeders manually or convert them to SQL.');
          }
        }
      }));
    } catch (error) {
      logger.warn('No seeders directory found or no seeder files in seeders directory');
      this.seeders = [];
    }
  }

  async run() {
    logger.info('🌱 Starting seeders...');
    
    if (this.seeders.length === 0) {
      logger.info('ℹ️  No seeders found');
      return;
    }

    logger.info(`📋 Found ${this.seeders.length} seeders`);

    for (const seeder of this.seeders) {
      try {
        await seeder.run();
      } catch (error) {
        logger.error(`❌ Failed to run seeder ${seeder.name}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }

    logger.info('🎉 All seeders completed successfully!');
  }

  async runSpecific(seederName: string) {
    const seeder = this.seeders.find(s => s.name === seederName);
    
    if (!seeder) {
      logger.error(`❌ Seeder not found: ${seederName}`);
      logger.info('Available seeders:');
      this.seeders.forEach(s => logger.info(`  - ${s.name}`));
      return;
    }

    logger.info(`🌱 Running seeder: ${seederName}`);
    try {
      await seeder.run();
      logger.info('✅ Seeder completed successfully!');
    } catch (error) {
      logger.error(`❌ Failed to run seeder ${seederName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  list() {
    logger.info('📋 Available seeders:');
    if (this.seeders.length === 0) {
      logger.info('  No seeders found');
    } else {
      this.seeders.forEach(seeder => logger.info(`  - ${seeder.name}`));
    }
  }
}

// CLI Interface
const command = process.argv[2] || 'run';
const seederName = process.argv[3];

(async () => {
  try {
    const runner = new SeederRunner();
    
    switch (command) {
      case 'run':
        if (seederName) {
          await runner.runSpecific(seederName);
        } else {
          await runner.run();
        }
        break;
      case 'list':
        runner.list();
        break;
      default:
        logger.error(`Unknown command: ${command}`);
        logger.info('Available commands: run, run <seeder-name>, list');
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Seeding failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
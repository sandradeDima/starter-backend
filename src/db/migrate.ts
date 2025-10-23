import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { pool } from './pool';
import { logger } from '../config/logger';

interface Migration {
  name: string;
  up: () => Promise<void>;
}

class MigrationRunner {
  private migrations: Migration[] = [];

  constructor() {
    this.loadMigrations();
  }

  private loadMigrations() {
    const migrationsDir = join(__dirname, 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    this.migrations = files.map(file => ({
      name: file,
      up: async () => {
        const sql = readFileSync(join(migrationsDir, file), 'utf8');
        
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
        
        await this.recordMigration(file);
        logger.info(`✅ Applied migration: ${file}`);
      }
    }));
  }

  private async recordMigration(name: string) {
    await pool.query(
      "INSERT INTO _migrations(name) VALUES (?) ON DUPLICATE KEY UPDATE name = name",
      [name]
    );
  }

  private async getExecutedMigrations(): Promise<string[]> {
    const [rows] = await pool.query("SELECT name FROM _migrations");
    return (rows as any[]).map(row => row.name);
  }

  async up() {
    logger.info('🚀 Starting migrations...');
    
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const executed = await this.getExecutedMigrations();
    const pending = this.migrations.filter(m => !executed.includes(m.name));

    if (pending.length === 0) {
      logger.info('✅ No pending migrations');
      return;
    }

    logger.info(`📋 Found ${pending.length} pending migrations`);

    for (const migration of pending) {
      try {
        await migration.up();
      } catch (error) {
        logger.error(`❌ Failed to apply migration ${migration.name}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }

    logger.info('🎉 All migrations completed successfully!');
  }

  async status() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const executed = await this.getExecutedMigrations();
    
    logger.info('📊 Migration Status:');
    logger.info(`Total migrations: ${this.migrations.length}`);
    logger.info(`Executed: ${executed.length}`);
    logger.info(`Pending: ${this.migrations.length - executed.length}`);
    
    if (executed.length > 0) {
      logger.info('\n✅ Executed migrations:');
      executed.forEach(name => logger.info(`  - ${name}`));
    }
    
    const pending = this.migrations.filter(m => !executed.includes(m.name));
    if (pending.length > 0) {
      logger.info('\n⏳ Pending migrations:');
      pending.forEach(m => logger.info(`  - ${m.name}`));
    }
  }
}

// CLI Interface
const command = process.argv[2] || 'up';

(async () => {
  try {
    const runner = new MigrationRunner();
    
    switch (command) {
      case 'up':
        await runner.up();
        break;
      case 'status':
        await runner.status();
        break;
      default:
        logger.error(`Unknown command: ${command}`);
        logger.info('Available commands: up, status');
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
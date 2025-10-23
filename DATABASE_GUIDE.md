# Database Migration & Seeding Guide

This guide explains how to use the simplified database migration and seeding system for the Espacio V Back project.

## 🏗️ Architecture Overview

The system consists of two main components:
- **Migrations**: Database schema changes (tables, indexes, constraints)
- **Seeders**: Initial data population (roles, admin users, test data)

## 📁 File Structure

```
src/db/
├── migrate.ts          # Migration runner
├── seed.ts            # Seeder runner
├── pool.ts            # Database connection pool
├── migrations/        # SQL migration files
│   └── 001_init_.sql
└── seeders/           # Seeder files
    ├── 001_seed_admin.sql
    └── 002_seed_admin_with_hash.ts
```

## 🚀 Quick Start

### 1. Setup Database (First Time)
```bash
# Run all migrations and seeders
npm run db:setup
```

### 2. Check Migration Status
```bash
npm run migrate:status
```

### 3. Run Migrations Only
```bash
npm run migrate:up
```

### 4. Run Seeders Only
```bash
npm run seed:run
```

## 📋 Available Commands

### Migration Commands
```bash
# Run all pending migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Direct access to migration runner
npm run migrate [command]
```

### Seeder Commands
```bash
# Run all SQL seeders
npm run seed:run

# List available seeders
npm run seed:list

# Run specific SQL seeder
npm run seed run 001_seed_admin.sql

# Run TypeScript seeders
npm run seed:ts [seeder-name]

# Run specific TypeScript seeders
npm run seed:admin    # Run admin seeder with proper password hashing
npm run seed:user     # Run test user seeder

# Direct access to seeder runner
npm run seed [command] [seeder-name]
```

### Combined Commands
```bash
# Setup everything (migrations + seeders)
npm run db:setup
```

## 📝 Creating Migrations

### 1. Create Migration File
Create a new SQL file in `src/db/migrations/` with a descriptive name:

```bash
# Example: 002_add_user_preferences.sql
```

### 2. Write Migration SQL
```sql
-- 002_add_user_preferences.sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Run Migration
```bash
npm run migrate:up
```

## 🌱 Creating Seeders

### SQL Seeders (Recommended)
Create a new SQL file in `src/db/seeders/`:

```sql
-- 002_seed_test_users.sql
INSERT IGNORE INTO users (email, password_hash, name, role_id) VALUES
('user1@test.com', '$2a$10$placeholder', 'Test User 1', 2),
('user2@test.com', '$2a$10$placeholder', 'Test User 2', 2);
```

### TypeScript Seeders (Advanced)
For complex seeding logic, create a TypeScript file:

```typescript
// 003_seed_complex_data.ts
import { pool } from '../pool';
import bcrypt from 'bcryptjs';

export async function seedComplexData() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await pool.query(`
    INSERT IGNORE INTO users (email, password_hash, name, role_id) 
    VALUES (?, ?, ?, ?)
  `, ['complex@test.com', hashedPassword, 'Complex User', 2]);
}
```

## 🔧 Migration System Features

### Automatic Tracking
- Migrations are automatically tracked in `_migrations` table
- Only pending migrations are executed
- Safe to run multiple times

### Error Handling
- Failed migrations stop the process
- Clear error messages with file names
- Database connection cleanup

### Logging
- Colorful console output with emojis
- Detailed progress information
- Error reporting

## 🌱 Seeder System Features

### File Support
- SQL files (`.sql`) - automatically executed
- TypeScript files (`.ts`) - detected but require manual execution

### Safety Features
- `INSERT IGNORE` prevents duplicate data
- Error handling with rollback information
- Connection cleanup

### Flexibility
- Run all seeders or specific ones
- List available seeders
- Support for both SQL and TypeScript

## 📊 Example Workflow

### 1. Initial Setup
```bash
# First time setup
npm run db:setup
```

### 2. Add New Feature
```bash
# Create migration
echo "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(255));" > src/db/migrations/002_add_products.sql

# Run migration
npm run migrate:up

# Create seeder
echo "INSERT IGNORE INTO products (id, name) VALUES (1, 'Sample Product');" > src/db/seeders/002_seed_products.sql

# Run seeder
npm run seed:run
```

### 3. Check Status
```bash
npm run migrate:status
npm run seed:list
```

## 🛠️ Troubleshooting

### Common Issues

#### Migration Fails
```bash
# Check the error message
npm run migrate:up

# Verify SQL syntax
# Check database connection
# Ensure previous migrations completed
```

#### Seeder Fails
```bash
# Check specific seeder
npm run seed run 001_seed_admin.sql

# Verify data doesn't already exist
# Check foreign key constraints
```

#### Connection Issues
- Verify database credentials in `.env`
- Check if database server is running
- Ensure database exists

### Manual Database Access
```bash
# Connect to MySQL directly
mysql -u your_username -p your_database

# Check migration status
SELECT * FROM _migrations;

# Check tables
SHOW TABLES;
```

## 🔒 Security Notes

### Password Handling
- Use `bcrypt` for password hashing in TypeScript seeders
- Never commit real passwords to version control
- Use environment variables for sensitive data

### SQL Injection Prevention
- Use parameterized queries in TypeScript seeders
- Validate all input data
- Use `INSERT IGNORE` to prevent conflicts

## 📈 Best Practices

### Migration Naming
- Use descriptive names: `001_init_tables.sql`
- Include version numbers: `002_add_indexes.sql`
- Use underscores: `003_add_user_preferences.sql`

### Seeder Organization
- Group related data: `001_seed_roles.sql`
- Use meaningful names: `002_seed_admin_users.sql`
- Keep seeders small and focused

### Development Workflow
1. Create migration for schema changes
2. Run migration: `npm run migrate:up`
3. Create seeder for test data
4. Run seeder: `npm run seed:run`
5. Test your changes
6. Commit both migration and seeder files

## 🎯 Production Deployment

### Before Deployment
```bash
# Check migration status
npm run migrate:status

# Ensure all migrations are applied
npm run migrate:up
```

### Production Seeding
- Only run seeders for essential data (roles, admin users)
- Avoid running test data seeders in production
- Use environment-specific seeders if needed

---

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check the migration/seeder file syntax

Happy coding! 🚀

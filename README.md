# Espacio V Backend

A modern Node.js backend API built with TypeScript, Express, and MySQL. Features authentication, database migrations, seeding, and a clean architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd espacio-v-back

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npm run db:setup
```

### Development
```bash
# Start development server
npm run dev

# The API will be available at http://localhost:3000
```

## 📁 Project Structure

```
espacio-v-back/
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.ts       # Environment variables
│   │   └── logger.ts    # Logging configuration
│   ├── controllers/     # Request handlers
│   ├── db/             # Database related files
│   │   ├── migrate.ts   # Migration runner
│   │   ├── seed.ts      # Seeder runner
│   │   ├── run-ts-seeder.ts # TypeScript seeder runner
│   │   ├── pool.ts      # Database connection pool
│   │   ├── migrations/  # SQL migration files
│   │   └── seeders/     # Seeder files (SQL & TS)
│   ├── middlewares/     # Express middlewares
│   ├── repositories/    # Data access layer
│   ├── routes/          # API routes
│   ├── schemas/         # Validation schemas
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── DATABASE_GUIDE.md    # Detailed database guide
└── README.md           # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm start            # Start production server
```

### Database Management
```bash
# Migrations
npm run migrate:up       # Run all pending migrations
npm run migrate:status   # Check migration status

# SQL Seeders
npm run seed:run         # Run all SQL seeders
npm run seed:list        # List available seeders
npm run seed run <name>  # Run specific SQL seeder

# TypeScript Seeders
npm run seed:ts <name>   # Run TypeScript seeder by name
npm run seed:admin       # Run admin seeder (proper password hashing)
npm run seed:user        # Run test user seeder

# Combined
npm run db:setup         # Run migrations + SQL seeders + admin seeder
```

## 🗄️ Database

### Schema
The database includes the following tables:

- **roles**: User roles (admin, user)
- **users**: User accounts with authentication
- **refresh_tokens**: JWT refresh token storage

### Default Users
After running seeders, you'll have:

1. **Admin User**
   - Email: `admin@admin.com`
   - Password: `Admin123!`
   - Role: Admin

2. **Test User**
   - Email: `user@test.com`
   - Password: `user_password`
   - Role: User

## 🔐 Authentication

The API uses JWT-based authentication with:
- **Access Tokens**: Short-lived (15 minutes)
- **Refresh Tokens**: Long-lived (7 days)
- **Password Hashing**: bcrypt with salt rounds

### Authentication Flow
1. User logs in with email/password
2. Server returns access token + refresh token
3. Client uses access token for API requests
4. When access token expires, use refresh token to get new tokens

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=espacio_v
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3000
NODE_ENV=development
```

### Logging
The application uses Pino for logging:
- **Development**: Pretty-printed logs with colors
- **Production**: JSON logs for log aggregation

## 🚀 How to Expand

### 1. Adding New API Endpoints

#### Create a New Route
```typescript
// src/routes/products.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import { productSchema } from '../schemas/product.schema';

const router = Router();

router.get('/', ProductController.getAll);
router.post('/', validate(productSchema), ProductController.create);
router.get('/:id', ProductController.getById);
router.put('/:id', validate(productSchema), ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;
```

#### Create Controller
```typescript
// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { MensajeApi } from '../types/MensajeApi';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await ProductService.getAll();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await ProductService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

#### Create Service
```typescript
// src/services/product.service.ts
import { ProductRepo } from '../repositories/product.repo';
import { MensajeApi } from '../types/MensajeApi';

export class ProductService {
  static async getAll(): Promise<MensajeApi> {
    try {
      const products = await ProductRepo.findAll();
      const mensaje = new MensajeApi();
      mensaje.code = 200;
      mensaje.data = products;
      mensaje.message = 'Products retrieved successfully';
      return mensaje;
    } catch (error) {
      const mensaje = new MensajeApi();
      mensaje.code = 500;
      mensaje.error = true;
      mensaje.message = 'Failed to retrieve products';
      return mensaje;
    }
  }
}
```

#### Create Repository
```typescript
// src/repositories/product.repo.ts
import { pool } from '../db/pool';

export class ProductRepo {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
  }

  static async findById(id: number) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data: any) {
    const { name, price, description } = data;
    const [result] = await pool.query(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      [name, price, description]
    );
    return result;
  }
}
```

### 2. Adding Database Tables

#### Create Migration
```bash
# Create new migration file
echo "CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);" > src/db/migrations/002_add_products.sql

# Run migration
npm run migrate:up
```

#### Create Seeder
```bash
# Create seeder file
echo "INSERT IGNORE INTO products (name, price, description) VALUES
('Sample Product 1', 29.99, 'A sample product'),
('Sample Product 2', 49.99, 'Another sample product');" > src/db/seeders/003_seed_products.sql

# Run seeder
npm run seed:run
```

### 3. Adding Validation Schemas

```typescript
// src/schemas/product.schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string().optional()
});

export type ProductInput = z.infer<typeof productSchema>;
```

### 4. Adding Middleware

```typescript
// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokens';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 5. Adding New Features

#### File Upload
```typescript
// Install multer
npm install multer @types/multer

// src/middlewares/upload.ts
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });
```

#### Email Service
```typescript
// Install nodemailer
npm install nodemailer @types/nodemailer

// src/services/email.service.ts
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransporter({
    // Configure your email service
  });

  async sendWelcomeEmail(email: string, name: string) {
    await this.transporter.sendMail({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Welcome!',
      html: `<h1>Welcome ${name}!</h1>`
    });
  }
}
```

## 🧪 Testing

### Running Tests
```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Add test script to package.json
"test": "jest",
"test:watch": "jest --watch"

# Run tests
npm test
```

### Example Test
```typescript
// src/__tests__/auth.test.ts
import request from 'supertest';
import app from '../app';

describe('Authentication', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('user');
  });
});
```

## 🚀 Deployment

### Production Build
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your_production_db_host
DB_NAME=your_production_db
JWT_SECRET=your_strong_jwt_secret
```

## 📖 Additional Resources

- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Detailed database management guide
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) for database-related issues
2. Review the logs for error messages
3. Ensure all environment variables are properly set
4. Verify database connection and permissions

---

**Happy Coding! 🚀**

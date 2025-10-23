import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Router } from 'express';
import { errorHandler } from './middlewares/error';
import {router} from './routes';

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow your frontend origins
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json({limit:'1mb'}));
app.use(rateLimit({windowMs:60_000, max:120}));

app.use('/api', router);
app.use(errorHandler);

export default app;
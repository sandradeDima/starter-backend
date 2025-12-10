import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clientesRoutes from './clientes.routes';
import coloracionesRoutes from './coloraciones.routes';
import reportesRoutes from './reportes.routes';
import fotosReportesRoutes from './fotosReportes.routes';
import { requireAuth } from '../middlewares/auth';

export const router = Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);

// Protected routes (authentication required)
router.use('/user', requireAuth, userRoutes);
router.use('/clientes', requireAuth, clientesRoutes);
router.use('/coloraciones', requireAuth, coloracionesRoutes);
router.use('/reportes', requireAuth, reportesRoutes);
router.use('/fotos-reportes', requireAuth, fotosReportesRoutes);

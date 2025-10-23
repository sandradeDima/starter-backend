import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clientesRoutes from './clientes.routes';
import coloracionesRoutes from './coloraciones.routes';
import reportesRoutes from './reportes.routes';
import fotosReportesRoutes from './fotosReportes.routes';

export const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/clientes', clientesRoutes);
router.use('/coloraciones', coloracionesRoutes);
router.use('/reportes', reportesRoutes);
router.use('/fotos-reportes', fotosReportesRoutes);

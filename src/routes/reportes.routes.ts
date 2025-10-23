import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createReporteSchema, updateReporteSchema } from '../schemas/reportes.schema';
import {
    getAllReportes,
    getReporteById,
    getReportesByCliente,
    createReporte,
    updateReporte,
    deleteReporte,
    getReportesByDateRange
} from '../controllers/reportes.controller';

const router = Router();

router.get('/', getAllReportes);
router.get('/date-range', getReportesByDateRange);
router.get('/cliente/:clienteId', getReportesByCliente);
router.get('/:id', getReporteById);
router.post('/', validate(createReporteSchema), createReporte);
router.put('/:id', validate(updateReporteSchema), updateReporte);
router.delete('/:id', deleteReporte);

export default router;


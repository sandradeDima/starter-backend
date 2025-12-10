import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createFotoReporteSchema, updateFotoReporteSchema } from '../schemas/fotosReportes.schema';
import {
    getAllFotosReportes,
    getFotoReporteById,
    getFotosByReporte,
    createFotoReporte,
    updateFotoReporte,
    deleteFotoReporte,
    deleteFotosByReporte
} from '../controllers/fotosReportes.controller';

const router = Router();
router.get('/', getAllFotosReportes);
router.get('/reporte/:reporteId', getFotosByReporte);
router.get('/:id', getFotoReporteById);
router.post('/', validate(createFotoReporteSchema), createFotoReporte);
router.put('/:id', validate(updateFotoReporteSchema), updateFotoReporte);
router.delete('/:id', deleteFotoReporte);
router.delete('/reporte/:reporteId', deleteFotosByReporte);

export default router;


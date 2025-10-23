import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createColoracionSchema, updateColoracionSchema } from '../schemas/coloraciones.schema';
import {
    getAllColoraciones,
    getColoracionById,
    createColoracion,
    updateColoracion,
    deleteColoracion,
    searchColoraciones
} from '../controllers/coloraciones.controller';

const router = Router();

router.get('/', getAllColoraciones);
router.get('/search', searchColoraciones);
router.get('/:id', getColoracionById);
router.post('/', validate(createColoracionSchema), createColoracion);
router.put('/:id', validate(updateColoracionSchema), updateColoracion);
router.delete('/:id', deleteColoracion);

export default router;


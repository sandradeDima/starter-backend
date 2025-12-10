import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createClienteSchema, updateClienteSchema, buscadorClientesSchema } from '../schemas/clientes.schema';
import {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientes,
    searchClientesPagination
} from '../controllers/clientes.controller';

const router = Router();

router.get('/', getAllClientes);
router.get('/search', searchClientes);
//paginated search with filters 
router.get('/search-pagination',  searchClientesPagination);
router.get('/:id', getClienteById);
router.post('/', validate(createClienteSchema), createCliente);
router.put('/:id', validate(updateClienteSchema), updateCliente);
router.delete('/:id', deleteCliente);

export default router;


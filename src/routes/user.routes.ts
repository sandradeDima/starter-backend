import { Router } from 'express';
import { validate } from '../middlewares/validate';
import * as UserController from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth';
const router = Router();

router.get('/get-user-by-id/:id', requireAuth, UserController.getUserById);
router.get('/get-user-by-email/:email', requireAuth, UserController.getUserByEmail);
router.put('/update-user', requireAuth, UserController.updateUser);

export default router;
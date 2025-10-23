import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, refreshSchema, logoutSchema, logoutAllSchema } from '../schemas/auth.schema';
import { registerUser, loginUser, refreshHandler, logoutUser, logoutAllSessions } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', validate(refreshSchema), refreshHandler);
router.post('/logout', validate(logoutSchema), logoutUser);
router.post('/logout-all', validate(logoutAllSchema), logoutAllSessions);

export default router;
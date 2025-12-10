import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokens';
import { logger } from '../config/logger';

declare global {
  namespace Express { interface Request { user?: { sub: number; role?: string } } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  logger.info(`Auth middleware called for: ${req.method} ${req.path}`);
  const header = req.headers.authorization;
  logger.info(`Authorization header: ${header || 'NOT PROVIDED'}`);
  
  if (!header) {
    logger.warn('No authorization header provided');
    res.status(401).json({ 
      code: 401,
      error: true,
      message: 'No se proporcionó token de autenticación'
    });
    return;
  }
  
  if (!header.startsWith('Bearer ')) {
    res.status(401).json({ 
      code: 401,
      error: true,
      message: 'Formato de token inválido. Use: Bearer <token>'
    });
    return;
  }
  
  try {
    const token = header.slice(7);
    const payload = verifyToken(token) as any;
    req.user = { sub: Number(payload.sub), role: payload.role };
    next();
  } catch (error) {
    res.status(401).json({ 
      code: 401,
      error: true,
      message: 'Token inválido o expirado'
    });
    return;
  }
}

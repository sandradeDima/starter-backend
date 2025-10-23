import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokens';

declare global {
  namespace Express { interface Request { user?: { sub: number; role?: string } } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'UNAUTHORIZED' });
  try {
    const payload = verifyToken(header.slice(7)) as any;
    req.user = { sub: Number(payload.sub), role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

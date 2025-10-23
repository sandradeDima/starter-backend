import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';

const secret: Secret = env.jwtSecret as unknown as Secret;

export const signAccess = (payload: object, exp: SignOptions['expiresIn'] = '15m') =>
  jwt.sign(payload, secret, { expiresIn: exp });
export const signRefresh = (payload: object, exp: SignOptions['expiresIn'] = '7d') =>
  jwt.sign(payload, secret, { expiresIn: exp });
export const verifyToken = (t: string) => jwt.verify(t, secret);

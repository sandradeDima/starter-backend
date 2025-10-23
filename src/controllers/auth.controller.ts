import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export async function registerUser(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const mensaje = await AuthService.registerUser(email, password, name);
    res.status(mensaje.code).json(mensaje);
}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const mensaje = await AuthService.loginUser(email, password);
    res.status(mensaje.code).json(mensaje);
}

export async function refreshHandler(req: Request, res: Response) {
    const { refreshToken, userId } = req.body;
    const mensaje = await AuthService.refresh(refreshToken, userId);
    res.status(mensaje.code).json(mensaje);
}

export async function logoutUser(req: Request, res: Response) {
    const { refreshToken, userId } = req.body;
    const mensaje = await AuthService.logoutUser(refreshToken, userId);
    res.status(mensaje.code).json(mensaje);
}

export async function logoutAllSessions(req: Request, res: Response) {
    const { userId } = req.body;
    const mensaje = await AuthService.logoutAllSessions(userId);
    res.status(mensaje.code).json(mensaje);
}


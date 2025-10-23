import { Request, Response } from 'express';
import * as ReportesService from '../services/reportes.service';

export async function getAllReportes(req: Request, res: Response) {
    const mensaje = await ReportesService.getAllReportes();
    res.status(mensaje.code).json(mensaje);
}

export async function getReporteById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const mensaje = await ReportesService.getReporteById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function getReportesByCliente(req: Request, res: Response) {
    const clienteId = parseInt(req.params.clienteId);
    const mensaje = await ReportesService.getReportesByCliente(clienteId);
    res.status(mensaje.code).json(mensaje);
}

export async function createReporte(req: Request, res: Response) {
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    const mensaje = await ReportesService.createReporte(
        clienteId,
        new Date(fechaServicio),
        horaServicio,
        coloracionId,
        formula,
        observaciones,
        precio
    );
    res.status(mensaje.code).json(mensaje);
}

export async function updateReporte(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    const mensaje = await ReportesService.updateReporte(
        id,
        clienteId,
        new Date(fechaServicio),
        horaServicio,
        coloracionId,
        formula,
        observaciones,
        precio
    );
    res.status(mensaje.code).json(mensaje);
}

export async function deleteReporte(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const mensaje = await ReportesService.deleteReporte(id);
    res.status(mensaje.code).json(mensaje);
}

export async function getReportesByDateRange(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const mensaje = await ReportesService.getReportesByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
    );
    res.status(mensaje.code).json(mensaje);
}


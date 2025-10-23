import { Request, Response } from 'express';
import * as ClientesService from '../services/clientes.service';

export async function getAllClientes(req: Request, res: Response) {
    const mensaje = await ClientesService.getAllClientes();
    res.status(mensaje.code).json(mensaje);
}

export async function getClienteById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const mensaje = await ClientesService.getClienteById(id);
    res.status(mensaje.code).json(mensaje);
}

export async function createCliente(req: Request, res: Response) {
    const { nombre, email, telefono } = req.body;
    const mensaje = await ClientesService.createCliente(nombre, email, telefono);
    res.status(mensaje.code).json(mensaje);
}

export async function updateCliente(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { nombre, email, telefono } = req.body;
    const mensaje = await ClientesService.updateCliente(id, nombre, email, telefono);
    res.status(mensaje.code).json(mensaje);
}

export async function deleteCliente(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const mensaje = await ClientesService.deleteCliente(id);
    res.status(mensaje.code).json(mensaje);
}

export async function searchClientes(req: Request, res: Response) {
    const query = req.query.q as string || '';
    const mensaje = await ClientesService.searchClientes(query);
    res.status(mensaje.code).json(mensaje);
}


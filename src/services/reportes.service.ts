import * as ReportesRepo from '../repositories/reportes.repo';
import * as ClientesRepo from '../repositories/clientes.repo';
import * as ColoracionesRepo from '../repositories/coloraciones.repo';
import { MensajeApi } from '../types/MensajeApi';

export async function getAllReportes(): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const reportes = await ReportesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getReporteById(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const reporte = await ReportesRepo.findById(id);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte obtenido correctamente';
        mensaje.data = reporte;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getReportesByCliente(clienteId: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const reportes = await ReportesRepo.findByCliente(clienteId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes del cliente obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes del cliente';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function createReporte(
    clienteId: number,
    fechaServicio: Date,
    horaServicio: string,
    coloracionId: number,
    formula: string,
    observaciones: string,
    precio: number
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        
        // Validate cliente exists
        const cliente = await ClientesRepo.findById(clienteId);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        
        // Validate coloracion exists
        const coloracion = await ColoracionesRepo.findById(coloracionId);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        
        const reporte = await ReportesRepo.create(
            clienteId,
            fechaServicio,
            horaServicio,
            coloracionId,
            formula,
            observaciones,
            precio
        );
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Reporte creado correctamente';
        mensaje.data = reporte;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function updateReporte(
    id: number,
    clienteId: number,
    fechaServicio: Date,
    horaServicio: string,
    coloracionId: number,
    formula: string,
    observaciones: string,
    precio: number
): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        
        // Validate reporte exists
        const existingReporte = await ReportesRepo.findById(id);
        if (!existingReporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        
        // Validate cliente exists
        const cliente = await ClientesRepo.findById(clienteId);
        if (!cliente) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Cliente no encontrado';
            return mensaje;
        }
        
        // Validate coloracion exists
        const coloracion = await ColoracionesRepo.findById(coloracionId);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        
        const reporte = await ReportesRepo.update(
            id,
            clienteId,
            fechaServicio,
            horaServicio,
            coloracionId,
            formula,
            observaciones,
            precio
        );
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte actualizado correctamente';
        mensaje.data = reporte;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function deleteReporte(id: number): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const deleted = await ReportesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reporte eliminado correctamente';
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function getReportesByDateRange(startDate: Date, endDate: Date): Promise<MensajeApi> {
    try {
        const mensaje = new MensajeApi();
        const reportes = await ReportesRepo.findByDateRange(startDate, endDate);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Reportes obtenidos correctamente';
        mensaje.data = reportes;
        return mensaje;
    } catch (error) {
        const mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener reportes por rango de fechas';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}


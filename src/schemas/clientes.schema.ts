import { z } from 'zod';

export const createClienteSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    email: z.string().email('Email inválido').max(255),
    telefono: z.string().min(1, 'El teléfono es requerido').max(255)
});

export const updateClienteSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    email: z.string().email('Email inválido').max(255),
    telefono: z.string().min(1, 'El teléfono es requerido').max(255)
});

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>;

export const buscadorClientesSchema = z.object({
    page: z.number().min(1, 'La página debe ser mayor o igual a 1'),
    size: z.number().min(1, 'El tamaño debe ser mayor o igual a 1'),
    clientName: z.string().optional(),
    clientEmail: z.string().optional(),
    clientPhone: z.string().optional(),
})
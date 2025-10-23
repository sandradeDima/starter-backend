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


import { z } from 'zod';

export const createColoracionSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: z.string().min(1, 'La descripción es requerida').max(255)
});

export const updateColoracionSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: z.string().min(1, 'La descripción es requerida').max(255)
});

export type CreateColoracionDTO = z.infer<typeof createColoracionSchema>;
export type UpdateColoracionDTO = z.infer<typeof updateColoracionSchema>;


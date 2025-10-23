import { z } from 'zod';

export const createFotoReporteSchema = z.object({
    reporteId: z.number().int().positive(),
    filename: z.string().min(1, 'El nombre del archivo es requerido').max(255)
});

export const updateFotoReporteSchema = z.object({
    reporteId: z.number().int().positive(),
    filename: z.string().min(1, 'El nombre del archivo es requerido').max(255)
});

export type CreateFotoReporteDTO = z.infer<typeof createFotoReporteSchema>;
export type UpdateFotoReporteDTO = z.infer<typeof updateFotoReporteSchema>;


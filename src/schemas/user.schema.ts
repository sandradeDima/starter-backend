import { z } from 'zod';

export const getUserByIdSchema = z.object({
    id: z.number()
});

export const getUserByEmailSchema = z.object({
    email: z.string().email()
});


export const updateUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    id: z.number()
});

export type GetUserByIdDTO = z.infer<typeof getUserByIdSchema>;
export type GetUserByEmailDTO = z.infer<typeof getUserByEmailSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
 
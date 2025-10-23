import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  userId: z.number()
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
  userId: z.number()
});

export const logoutAllSchema = z.object({
  userId: z.number()
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshDTO = z.infer<typeof refreshSchema>;
export type LogoutDTO = z.infer<typeof logoutSchema>;
export type LogoutAllDTO = z.infer<typeof logoutAllSchema>;

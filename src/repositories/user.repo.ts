import { compare } from '../utils/password';
import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';    
import { logger } from '../config/logger';


export type User = {
    id: number;
    email: string;
    passwordHash: string;
    name: string | null;
    role: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function findByEmail(email: string): Promise<User | null> {
    const [result] = await pool.execute<User[] & RowDataPacket[]>('SELECT id, email, password_hash as passwordHash, name, role_id as role, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?', [email]);
    logger.info('result: ' + result);
    return result[0] ?? null;
}

export async function findById(id: number): Promise<User | null> {
    const [result] = await pool.execute<User[] & RowDataPacket[]>('SELECT id, email, password_hash as passwordHash, name, role_id as role, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?', [id]);
    return result[0] ?? null;
}

export async function createUser(email: string, passwordHash: string, name: string, role: number): Promise<User> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO users (email, password_hash, name, role_id) VALUES (?, ?, ?, ?)',
        [email, passwordHash, name, role]
    );
    return { id: result.insertId, email, passwordHash, name, role, createdAt: new Date(), updatedAt: new Date() };
}

export async function updateUser(id: number, email: string, name: string, updatedAt: Date): Promise<User | null> {
    try{
     const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE users SET email = ?, name = ?, updated_at = ? WHERE id = ?',
        [email, name, updatedAt, id]
    );
    if (result.affectedRows === 0) return null;
    // Return the updated user by fetching it
    return await findById(id);
    } catch (error) {
    return null;

    }
    }

export async function signInUser (email: string, passwordHash: string): Promise<User | null> {
    const user = await findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) return null;
    return { ...user, passwordHash: '' };
}
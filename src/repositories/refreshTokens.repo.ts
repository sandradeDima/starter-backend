import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';
export type RefreshToken = {
    id: number;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}

export function sha256(s: string): string {
    return crypto.createHash('sha256').update(s).digest('hex');
}


export async function storeRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    const tokenHash = sha256(token);
    await pool.execute<ResultSetHeader>(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, tokenHash, expiresAt]
    );
}

export async function consumeRefreshToken(userId: number, token: string): Promise<RefreshToken | null> {
    try{

    const tokenHash = sha256(token);
    const [rows]=await pool.execute<(RefreshToken & RowDataPacket)[]>(
        'SELECT * FROM refresh_tokens WHERE user_id = ? AND token_hash = ?',
        [userId, tokenHash]
    );
    const row = rows[0];
    if(!row) throw new Error('Refresh token not found');
    if(row.expires_at < new Date()) throw new Error('Refresh token expired');
    await pool.execute<ResultSetHeader>(
        'DELETE FROM refresh_tokens WHERE id = ?',
        [row.id]
    );
    return { id: row.id, userId: row.user_id, tokenHash: row.token_hash, expiresAt: row.expires_at, createdAt: row.created_at };
    } catch (error) {
        return null;
    }
}

export async function revokeAllRefreshTokens(userId: number): Promise<void> {
    await pool.execute<ResultSetHeader>(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [userId]
    );
}

export async function revokeRefreshToken(userId: number, token: string): Promise<boolean> {
    try {
        const tokenHash = sha256(token);
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM refresh_tokens WHERE user_id = ? AND token_hash = ?',
            [userId, tokenHash]
        );
        return result.affectedRows > 0;
    } catch (error) {
        return false;
    }
}
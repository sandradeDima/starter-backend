import { pool } from '../db/pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type FotoReporte = {
    id: number;
    reporteId: number;
    filename: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function findAll(): Promise<FotoReporte[]> {
    const [rows] = await pool.execute<(FotoReporte & RowDataPacket)[]>(
        'SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes ORDER BY created_at DESC'
    );
    return rows;
}

export async function findById(id: number): Promise<FotoReporte | null> {
    const [rows] = await pool.execute<(FotoReporte & RowDataPacket)[]>(
        'SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
}

export async function findByReporte(reporteId: number): Promise<FotoReporte[]> {
    const [rows] = await pool.execute<(FotoReporte & RowDataPacket)[]>(
        'SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes WHERE reporte_id = ? ORDER BY created_at',
        [reporteId]
    );
    return rows;
}

export async function create(reporteId: number, filename: string): Promise<FotoReporte> {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO fotos_reportes (reporte_id, filename) VALUES (?, ?)',
        [reporteId, filename]
    );
    const foto = await findById(result.insertId);
    if (!foto) throw new Error('Failed to create foto reporte');
    return foto;
}

export async function update(id: number, reporteId: number, filename: string): Promise<FotoReporte | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE fotos_reportes SET reporte_id = ?, filename = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [reporteId, filename, id]
    );
    if (result.affectedRows === 0) return null;
    return await findById(id);
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM fotos_reportes WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
}

export async function removeByReporte(reporteId: number): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM fotos_reportes WHERE reporte_id = ?',
        [reporteId]
    );
    return result.affectedRows;
}


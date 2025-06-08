import { cn } from './conexion.js';

export async function getUsrId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idUser) as ultimoId from usuario');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}
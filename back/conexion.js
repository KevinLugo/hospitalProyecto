import mssql from "mssql";

//configuracion maisikuel
const cnSet = {
  server: 'localhost',
  port: 1434,
  database: 'prueba2',
  user: 'sa',
  password: '123',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

//le echa ganaz para conectar
export async function cn() {
  try {
    return await mssql.connect(cnSet);
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
}
export {mssql};
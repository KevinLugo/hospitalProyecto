import { cn } from './conexion.js';
import { mssql } from './conexion.js'; 

//busca el id del usuario y tipo de usuario con vase en el usr y psw
export const inLog = async (usr, psw) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('usr', mssql.VarChar, usr)
      .input('psw', mssql.VarChar, psw)
      .query('select tipoUser.tipoUs, usuario.idUser from usuario inner join tipoUser on usuario.idTipoUser=tipoUser.idTipoUser '+
        'where usuario.nomUser=@usr and usuario.contra=@psw');
    return result.recordset;
  } catch (err) {
    console.error("Error en buscar al usuario:", err);
    throw err;
  }
};

//busca el id del usuario y le incrementa 1
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

//busca el kurp y si ai igual le dise eier
export const buscaCurp = async (curp) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('curp', mssql.VarChar, curp)
      .query('select * from paciente where curp = @curp');
    return result.recordset;
  } catch (err) {
    console.error("Error en buscaCurp:", err);
    throw err;
  }
};

//ingreso los datos del usuario
export const regUser = async ({ idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser, correo, idTipoUser }) => {
  const pool = await cn();
  await pool.request()
    .input('idUser', mssql.Int, idUser)
    .input('nombre', mssql.VarChar, nom)
    .input('apPat', mssql.VarChar, apPat)
    .input('apMat', mssql.VarChar, apMat)
    .input('fechaNac', mssql.Date, fechaNac)
    .input('tel', mssql.VarChar, tel)
    .input('contra', mssql.VarChar, contra)
    .input('nomUser', mssql.VarChar, nomUser)
    .input('idTipoUser', mssql.Int, idTipoUser)
    .input('correo', mssql.VarChar, correo)
    .query(`insert into usuario (idUser, nom, apPat, apMat, edad, tel, contra, nomUser, correo, idTipoUser)
      values (@idUser, @nom, @apPat, @apMat, @fechaNac, @tel, @contra, @nomUser, @correo, @idTipoUser)`);
};

//busca el id del paciente y le zuma 1
export async function getPacId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idPac) as ultimoId from paciente');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos del paciente
export const regPac = async ({ idPac, idUser, tipoSeg, estatura, curp }) => {
  const pool = await cn();
  await pool.request()
    .input('idPac', mssql.Int, idPac)
    .input('idUser', mssql.Int, idUser)
    .input('tipoSeg', mssql.VarChar, tipoSeg)
    .input('estatura', mssql.VarChar, estatura)
    .input('curp', mssql.VarChar, curp)
    .query(`insert into paciente (idPac, idUser, tipoSeg, estatura, curp)
      values (@idPac, @idUser, @tipoSeg, @estatura, @curp)`);
};

//ingresamos la informacion del paciente en la vista del paciente
export const vistaPac = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query('select u.nom, u.apPat, u.apMat, p.tipoSeg, p.estatura, u.correo, u.fechaNac, u.tel, DATEDIFF(YEAR, u.fechaNac, GETDATE()) '+
        'as edad from usuario as u inner join paciente as p on u.idUser=p.idUser where u.idUser=@idUser');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac:", err);
    throw err;
  }
};

//ingresamos el resto de su info en la otra pagina

//obtenemos el id del paciente cuando le pika a generar cita y en las tablas de las citas
export const idPac = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("select idPac from paciente where idUser=@idUser");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener el ide del pac:", err);
    throw err;
  }
};

//hacemos consulta de cuantos docs hay con base en la especialidad
export const docEsp = async (esp) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('esp', mssql.VarChar, esp)
      .query("select u.nom+' '+ u.apPat+' '+ u.apMat as nomComp, d.cedula from usuario as u inner join empleado as e "+
        "on u.idUser=e.idUser inner join doctor as d on e.idEmp=d.idEmp inner join docEsp as de on d.cedula=de.cedula "+
        "inner join esp as es on de.idEsp=es.idEsp where es.nomEsp=@esp");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta el nombre del doc:", err);
    throw err;
  }
};

//buscamos la cedula de los doctores que tengan cita con paciente
export const nopDocs = async (idPac) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idPac', mssql.Int, idPac)
      .query("select cedula from cita where idPac=@idPac");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener el ide del pac:", err);
    throw err;
  }
};

//buscamos el orario del doc
export const horario = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query("select h.horaEnt, h.horaSal, dias, day(dateadd(hour, 48, getdate())) as d48, month(dateadd(hour, 48, getdate())) "+
        "as m48, day(dateadd(month, 3, getdate())) as d3, month(dateadd(month, 3, getdate())) as m3 from horario as h inner join "+
        "empleado as e on h.idEmp=e.idEmp inner join doctor as d on d.idEmp=e.idEmp where d.cedula=@cedula");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener el hor:", err);
    throw err;
  }
};

//kitamos las fechas y la hora donde el doc tenga citas 
export const nopFecha = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query("select fechaR, horaCita from cita where cedula=@cedula");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener fecha y hora del doc en cita:", err);
    throw err;
  }
};

//busca el id de la tabla pago y le suma 1
export async function getPagoId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idPago) as ultimoId from pago');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id de pago:", err);
    throw err;
  }
}

//busca el id de la tabla cita y le suma 1
export async function getCitaId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idCita) as ultimoId from cita');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id de cita:", err);
    throw err;
  }
}

//ingreso los datos del pago
export const regPago = async ({ idPago, monto, formaPago, limPago, statPago }) => {
  const pool = await cn();
  await pool.request()
    .input('idPago', mssql.Int, idPago)
    .input('monto', mssql.Int, monto)
    .input('formaPago', mssql.VarChar, formaPago)
    .input('limPago', mssql.DateTime, limPago)
    .input('statPago', mssql.VarChar, statPago)
    .query(`insert into pago (idPago, monto, formaPago, limPago, statPago)
      values (@idPago, @monto, @formaPago, @limPago, @statPago)`);
};

//ingreso los datos de la cita
export const regCita = async ({ idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita }) => {
  const pool = await cn();
  await pool.request()
    .input('idCita', mssql.Int, idCita)
    .input('cedula', mssql.Int, cedula)
    .input('idPac', mssql.Int, idPac)
    .input('idPago', mssql.Int, idPago)
    .input('fechaC', mssql.Date, fechaC)
    .input('fechaR', mssql.Date, fechaR)
    .input('statCita', mssql.VarChar, statCita)
    .input('horaCita', mssql.VarChar, horaCita)
    .query(`insert into cita (idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita)
      values (@idCita, @cedula, @idPac, @idPago, @fechaC, @fechaR, @statCita, @horaCita)`);
};

//comparamos fechas y si son iguales le decimos nel
export const noHora = async (cedula, fechaR, horaCita) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .input('fechaR', mssql.Date, fechaR)
      .input('horaCita', mssql.VarChar, horaCita)
      .query("select fechaR, horaCita from cita where cedula=@cedula and fechaR=@fechaR and horaCita=@horaCita");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener fecha y hora del doc en cita 2:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const citas = async (idPac) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idPac', mssql.Int, idPac)
      .query('select p.idPago, c.idCita, c.statCita, c.fechaC, c.fechaR, c.horaCita, co.noCon, co.planta, u.nom,u.apPat,u.apMat, '+
        'esp.nomEsp, p.statPago, p.monto, p.limPago, p.formaPago from pago as p inner join cita as c on p.idPago=c.idPago inner join doctor '+
        'as d on c.cedula=d.cedula inner join empleado as e on e.idEmp=d.idEmp inner join usuario as u on u.idUser=e.idUser inner join '+
        'asigCon as a on a.cedula=d.cedula inner join consul as co on co.idCon=a.idCon inner join docEsp as de on de.cedula=d.cedula '+
        'inner join esp on esp.idEsp=de.idEsp where c.idPac=@idPac');
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener las ciats del pacientye:", err);
    throw err;
  }
};

//le ago update al pago
export const formaPagos = async ({ idPago, formaPago }) => {
  const pool = await cn();
  await pool.request()
    .input('idPago', mssql.Int, idPago)
    .input('formaPago', mssql.VarChar, formaPago)
    .query(`update pago set formaPago=@formaPago where idPago=@idPago`);
};

//le ago update ala cita el pasiente kanselo
export const canCitaP = async ({ idCita}) => {
  const pool = await cn();
  await pool.request()
    .input('idCita', mssql.Int, idCita)
    .query(`update cita set statCita='Cancelada Paciente' where idCita=@idCita`);
};
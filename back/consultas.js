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

export const inLog2 = async (usr, psw) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('usr', mssql.VarChar, usr)
      .input('psw', mssql.VarChar, psw)
      .query("select e.estatus, tipoUser.tipoUs, usuario.idUser, te.tipoEmp from usuario inner join tipoUser on usuario.idTipoUser=tipoUser.idTipoUser "
        +"inner join empleado as e on e.idUser=usuario.idUser inner join tipoEmp as te on te.idTipoEmp=e.idTipoEmp"
      +" where usuario.nomUser=@usr and usuario.contra=@psw");
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

//busca el rfc y si ai igual le dise eier
export const buscaRfc = async (rfc) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('rfc', mssql.VarChar, rfc)
      .query('select * from empleado where rfc = @rfc');
    return result.recordset;
  } catch (err) {
    console.error("Error en buscaRFC:", err);
    throw err;
  }
};

//busca el nomUser y si ai igual le dise eier
export const buscaUsr = async (nomUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('nomUser', mssql.VarChar, nomUser)
      .query('select * from usuario where nomUser = @nomUser');
    return result.recordset;
  } catch (err) {
    console.error("Error en nomUser:", err);
    throw err;
  }
};

//busca el nomUser y si ai igual le dise eier
export const buscaCed = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query('select * from doctor where cedula = @cedula');
    return result.recordset;
  } catch (err) {
    console.error("Error en nomUser:", err);
    throw err;
  }
};

//ingreso los datos del usuario
export const regUser = async ({ idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser, correo, idTipoUser }) => {
  const pool = await cn();
  await pool.request()
    .input('idUser', mssql.Int, idUser)
    .input('nom', mssql.VarChar, nom)
    .input('apPat', mssql.VarChar, apPat)
    .input('apMat', mssql.VarChar, apMat)
    .input('fechaNac', mssql.Date, fechaNac)
    .input('tel', mssql.VarChar, tel)
    .input('contra', mssql.VarChar, contra)
    .input('nomUser', mssql.VarChar, nomUser)
    .input('correo', mssql.VarChar, correo)
    .input('idTipoUser', mssql.Int, idTipoUser)
    .query(`insert into usuario (idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser, correo, idTipoUser)
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

//busca el id del histMed y le suma 1
export async function getHistId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idHistMed) as ultimoId from histMed');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id del hist", err);
    throw err;
  }
}

//ingreso los datos del paciente
export const regHistMed = async ({ idHistMed, idPac, tipoSangre, alergias, vacunas, enferCron, anteFam }) => {
  const pool = await cn();
  await pool.request()
    .input('idHistMed', mssql.Int,idHistMed )
    .input('idPac', mssql.Int, idPac)
    .input('tipoSangre', mssql.VarChar, tipoSangre)
    .input('alergias', mssql.VarChar, alergias)
    .input('vacunas', mssql.VarChar, vacunas)
    .input('enferCron', mssql.VarChar, enferCron)
    .input('anteFam', mssql.VarChar, anteFam)
    .query(`insert into histMed (idHistMed, idPac, tipoSangre, alergias, vacunas, enferCron, anteFam)
      values (@idHistMed, @idPac, @tipoSangre, @alergias, @vacunas, @enferCron, @anteFam)`);
};

//busca el id del empleado y le zuma 1
export async function getEmpId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idEmp) as ultimoId from empleado');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos del empleado
export const regEmp = async ({ idEmp, idUser, salario, estatus, rfc, idTipoEmp }) => {
  const pool = await cn();
  await pool.request()
    .input('idEmp', mssql.Int,idEmp)
    .input('idUser', mssql.Int, idUser)
    .input('salario', mssql.VarChar, salario)
    .input('estatus', mssql.VarChar, estatus)
    .input('rfc', mssql.VarChar, rfc)
    .input('idTipoEmp', mssql.Int, idTipoEmp)
    .query(`insert into empleado (idEmp, idUser, salario, estatus, rfc, idTipoEmp)
      values (@idEmp, @idUser, @salario, @estatus, @rfc, @idTipoEmp)`);
};


//busca el id del horario y le suma 1
export async function getHoraId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idHora) as ultimoId from horario');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos del empleado
export const regHora = async ({ idHora, idEmp, dias, horaEnt, horaSal, turno }) => {
  const pool = await cn();
  await pool.request()
    .input('idHora', mssql.Int, idHora)
    .input('idEmp', mssql.Int,idEmp)
    .input('dias', mssql.VarChar, dias)
    .input('horaEnt', mssql.VarChar, horaEnt)
    .input('horaSal', mssql.VarChar, horaSal)
    .input('turno', mssql.VarChar, turno)
    .query(`insert into horario (idHora, idEmp, dias, horaEnt, horaSal, turno )
      values (@idHora, @idEmp, @dias, @horaEnt, @horaSal, @turno )`);
};

//busca el id de la recep y le zuma 1
export async function getRecepId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idRecep) as ultimoId from recep');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos dela recepcionista
export const regRecep = async ({ idRecep, idEmp}) => {
  const pool = await cn();
  await pool.request()
    .input('idRecep', mssql.Int,idRecep)
    .input('idEmp', mssql.Int,idEmp)
    .query(`insert into recep (idRecep, idEmp)
      values (@idRecep, @idEmp)`);
};

//ingreso los datos del doc
export const regDoc = async ({ cedula, idEmp}) => {
  const pool = await cn();
  await pool.request()
    .input('cedula', mssql.Int,cedula)
    .input('idEmp', mssql.Int,idEmp)
    .query(`insert into doctor (cedula, idEmp)
      values (@cedula,  @idEmp)`);
};

//busca el id del docEsp y le zuma 1
export async function getDocEspId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idDocEsp) as ultimoId from docEsp');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos del docEsp
export const regDocEsp = async ({ idDocEsp, cedula, idEsp, statEsp }) => {
  const pool = await cn();
  await pool.request()
    .input('idDocEsp', mssql.Int,idDocEsp)
    .input('cedula', mssql.Int,cedula)
    .input('idEsp', mssql.Int,idEsp)
    .input('statEsp', mssql.VarChar,statEsp)
    .query(`insert into docEsp (idDocEsp, cedula, idEsp, statEsp)
      values (@idDocEsp, @cedula, @idEsp, @statEsp)`);
};

//busca el id de asigConsul y le zuma 1
export async function getACId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idAsigCon) as ultimoId from asigCon');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//busca ids que esten en consultorio pero que no esten en asigCon
export async function consulSi() {
  try {
    const pool = await cn();
    const result = await pool.request()
    .query('select c.idCon, c.noCon from consul as c left join asigCon as a on c.idCon = a.idCon where a.idCon is null;');
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener consultorios libres:", err);
    throw err;
  }
}

//ingreso los datos del asigConsul
export const regAC = async ({ idAsigCon, cedula, idCon, statCon, horaIn, horaFin, dias }) => {
  const pool = await cn();
  await pool.request()
    .input('idAsigCon', mssql.Int,idAsigCon)
    .input('cedula', mssql.Int,cedula)
    .input('idCon', mssql.Int,idCon)
    .input('statCon', mssql.VarChar,statCon)
    .input('horaIn', mssql.VarChar,horaIn)
    .input('horaFin', mssql.VarChar,horaFin)
    .input('dias', mssql.VarChar,dias)
    .query(`insert into asigCon(idAsigCon, cedula, idCon, statCon, horaIn, horaFin, dias)
      values (@idAsigCon, @cedula, @idCon, @statCon, @horaIn, @horaFin, @dias)`);
};

//ingresamos la informacion del paciente en la vista del paciente
export const vistaPac = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query('select u.nom, u.apPat, u.apMat, p.tipoSeg, p.estatura, u.correo, u.fechaNac, u.tel, DATEDIFF(YEAR, u.fechaNac, GETDATE()) '+
        'as edad, u.nomUser, u.contra, p.curp from usuario as u inner join paciente as p on u.idUser=p.idUser where u.idUser=@idUser');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac:", err);
    throw err;
  }
};

//ingresamos el resto de su info en la otra pagina
export const vistaPac2 = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query('select hm.tipoSangre, hm.alergias, hm.vacunas, hm.enferCron, hm.anteFam '+
        'from usuario as u inner join paciente as p on u.idUser=p.idUser inner join histMed as hm '
        +'on p.idPac=hm.idPac where u.idUser=@idUser');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac2:", err);
    throw err;
  }
};


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

//hacemos consulta de cuantos docs hay con base en la especialidad y si estan disponibles
export const docEsp = async (esp) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('esp', mssql.VarChar, esp)
      .query("select u.nom+' '+ u.apPat+' '+ u.apMat as nomComp, d.cedula from usuario as u inner join empleado as e "+
        "on u.idUser=e.idUser inner join doctor as d on e.idEmp=d.idEmp inner join docEsp as de on d.cedula=de.cedula "+
        "inner join esp as es on de.idEsp=es.idEsp where es.nomEsp=@esp and e.estatus='activo'");
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
      .query("select cedula from cita where idPac=@idPac and statCita in ('Agendada pendiente de pago', 'Pagada pendiente por atender')");
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
      .query("select fechaR, horaCita from cita where cedula=@cedula and statCita in ('Agendada pendiente de pago', "
        +"'Pagada pendiente por atender')");
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
export const regCita = async ({ idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita, esp }) => {
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
    .input('esp', mssql.VarChar, esp)
    .query(`insert into cita (idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita, esp)
      values (@idCita, @cedula, @idPac, @idPago, @fechaC, @fechaR, @statCita, @horaCita, @esp)`);
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

//Mostramos la info de las citas al paciente
export const citas = async (idPac) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idPac', mssql.Int, idPac)
      .query('select p.idPago, c.idCita, c.statCita, c.fechaC, c.fechaR, c.horaCita, co.noCon, co.planta, u.nom,u.apPat,u.apMat, '+
        'p.statPago, p.monto, p.limPago, p.formaPago, c.esp from pago as p inner join cita as c on p.idPago=c.idPago inner '
        +'join doctor as d on c.cedula=d.cedula inner join empleado as e on e.idEmp=d.idEmp inner join usuario as u on u.idUser=e.idUser '
        +'inner join asigCon as a on a.cedula=d.cedula inner join consul as co on co.idCon=a.idCon where c.idPac=@idPac order by c.fechaC desc');
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener las ciats del pacientye:", err);
    throw err;
  }
};

//Mostramos la info del pago al paciente
export const infoPagoCita = async (idPago) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idPago', mssql.Int, idPago)
      .query('select u.nom, u.apPat, u.apMat, c.esp, c.fechaR, c.horaCita, p.monto, p.formaPago, p.limPago, p.statPago from usuario '
        +'as u inner join empleado as e on u.idUser=e.idUser inner join doctor as d on d.idEmp=e.idEmp inner join cita as c on '
        +'c.cedula=d.cedula inner join pago as p on p.idPago=c.idPago where p.idPago=@idPago');
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
    .query(`update pago set formaPago=@formaPago, statPago='Pagado' where idPago=@idPago`);
};

//le ago update al pago
export const pagoCita = async ({ idPago }) => {
  const pool = await cn();
  await pool.request()
    .input('idPago', mssql.Int, idPago)
    .query(`update cita set statCita='Pagada pendiente por atender' where idPago=@idPago`);
};

//le ago update ala cita el pasiente kanselo y se le aplika politka
export const canCitaP = async ({ idCita, nuevoEstado }) => {
  try {
    const pool = await cn();
    await pool.request()
      .input('idCita', mssql.Int, idCita)
      .input('nuevoEstado', mssql.VarChar, nuevoEstado)
      .query(`update cita set statCita =@nuevoEstado where idCita = @idCita`);
  } catch (err) {
    console.error("Error al cancelar cita del paciente:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const vistaRec = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query('select u.nom, u.apPat, u.apMat, u.correo, u.fechaNac, u.tel, DATEDIFF(YEAR, u.fechaNac, GETDATE()) '+
        'as edad, u.nomUser, u.contra, e.salario, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno from usuario as u inner '
        +'join empleado as e on u.idUser=e.idUser inner join horario as h on e.idEmp=h.idEmp where u.idUser=@idUser');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac:", err);
    throw err;
  }
};

//mostramos todo lo del paciente
export const elPac = async (curp) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('curp', mssql.VarChar, curp)
      .query('select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, p.curp, p.estatura ,p.tipoSeg, hm.tipoSangre, '
        +'hm.alergias, hm.vacunas, hm.enferCron, hm.anteFam from usuario as u inner join paciente as p on u.idUser=p.idUser inner join histMed '
        +'as hm on p.idPac=hm.idPac where p.curp=@curp');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta elPac:", err);
    throw err;
  }
};

//mostramos todo lo de la recep
export const laRecep = async (rfc) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('rfc', mssql.VarChar, rfc)
      .query("select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, e.salario, e.estatus, e.rfc, h.dias, "
        +"h.horaEnt, h.horaSal, h.turno from usuario as u inner join empleado as e on u.idUser=e.idUser inner join horario as h on "
        +"h.idEmp=e.idEmp inner join tipoEmp as te on te.idTipoEmp=e.idTipoEmp where te.tipoEmp='recepcionista' and rfc=@rfc");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta laRecep:", err);
    throw err;
  }
};

//mostramos todo lo del doc
export const elDoc = async (rfc) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('rfc', mssql.VarChar, rfc)
      .query("select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, e.salario, e.estatus, e.rfc, h.dias, "
        +"h.horaEnt, h.horaSal, h.turno, d.cedula, string_agg(es.nomEsp,', ') as especialidades, c.noCon, c.planta from usuario as u inner "
        +"join empleado as e on u.idUser=e.idUser inner join horario as h on h.idEmp=e.idEmp inner join doctor as d on e.idEmp=d.idEmp inner "
        +"join docEsp as de on de.cedula=d.cedula inner join asigCon as a on a.cedula=d.cedula inner join consul as c on c.idCon=a.idCon inner "
        +"join esp as es on es.idEsp=de.idEsp where e.rfc=@rfc group by u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, "
        +"u.nomUser,u.contra, e.salario, e.estatus, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno, d.cedula, c.noCon, c.planta");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta elDoc:", err);
    throw err;
  }
};

//obtenemos todos los pacientes
export const allPac = async () => {
  try{
  const pool = await cn();
  const result = await pool.query(`select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra,p.curp, p.estatura, 
    p.tipoSeg, hm.tipoSangre, hm.alergias, hm.vacunas, hm.enferCron, hm.anteFam from usuario as u inner join paciente as p on u.iduser=p.iduser 
    inner join histmed as hm on p.idpac=hm.idpac`);
  return result.recordset;
  }catch(err){
    console.error("Error en consulta allPac:", err);
    throw err;
  }
};

//obtenemos a todas las recep
export const allRec = async () => {
  try {
    const pool = await cn();
  const result = await pool.query(`select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, e.salario, 
    e.estatus, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno from usuario as u inner join empleado as e on u.idUser=e.idUser inner 
    join horario as h on h.idEmp=e.idEmp inner join tipoEmp as te on te.idTipoEmp=e.idTipoEmp where te.tipoEmp='recepcionista'`);
  return result.recordset;
  } catch (err) {
    console.error("Error en consulta allRec:", err);
    throw err;
  }
};

//obtenemos a todos los docs
export const allDoc = async () => {
  try {
    const pool = await cn();
  const result = await pool.query(`select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, e.salario, 
    e.estatus, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno, d.cedula, string_agg(es.nomEsp,', ') as especialidades, c.noCon, c.planta from 
    usuario as u inner join empleado as e on u.idUser=e.idUser inner join horario as h on h.idEmp=e.idEmp inner join doctor as d on 
    e.idEmp=d.idEmp inner join docEsp as de on de.cedula=d.cedula inner join asigCon as a on a.cedula=d.cedula inner join consul as c on 
    c.idCon=a.idCon inner join esp as es on es.idEsp=de.idEsp group by u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser, 
    u.contra, e.salario, e.estatus, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno, d.cedula, c.noCon, c.planta`);
  return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac:", err);
    throw err;
  }
};


//alv al doc
export const byeDoc = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("update e set e.estatus='No activo' from empleado as e inner join usuario as u on u.idUser=e.idUser inner join doctor as d on "
        +"d.idEmp=e.idEmp where u.idUser=@idUser and not exists (select 1 from cita as c where c.cedula = d.cedula and c.statCita in "
        +"('Agendada pendiente de pago', 'Pagada pendiente por atender'))");
    return result;
  } catch (err) {
    console.error("Error en consulta byeDoc:", err);
    throw err;
  }
};

//alv al doc
export const olaDoc = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("update e set e.estatus='activo' from empleado as e inner join usuario as u on u.idUser=e.idUser where u.idUser=@idUser");
    return result;
  } catch (err) {
    console.error("Error en consulta olaDoc:", err);
    throw err;
  }
};

//stock medicamentoz
export const stock = async () => {
  try {
    const pool = await cn();
  const result = await pool.query(`select idMed, nomMed, feCad, stock, descMed, precioMed from med`);
  return result.recordset;
  } catch (err) {
    console.error("Error en cosultar stock:", err);
    throw err;
  }
};

//stock por nombreMed
export const stock2 = async (nomMed) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('nomMed', mssql.VarChar, `%${nomMed}%`)
      .query("select idMed, nomMed, feCad, stock, descMed, precioMed from med where nomMed like '%'+@nomMed+'%'");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta olaDoc:", err);
    throw err;
  }
};

//stock medicamentoz
export const servicios = async () => {
  try {
    const pool = await cn();
  const result = await pool.query(`select idServ, nomServ, precio from servicio`);
  return result.recordset;
  } catch (err) {
    console.error("Error en cosultar serbisios:", err);
    throw err;
  }
};

//busco el id dela recep
export const idRecep = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("select r.idRecep from recep as r inner join empleado as e on e.idEmp=r.idEmp inner join usuario as u on u.idUser=e.idUser "
        +"where u.idUser=@idUser");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta olaDoc:", err);
    throw err;
  }
};

//busca el id de la tabla tiket y le suma 1
export async function getTicketId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idTicket) as ultimoId from ticket');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id del ticket:", err);
    throw err;
  }
}

//ingreso los datos del tiket mayor
export const regTicket = async ({ idTicket, idRecep, fechaTicket, total }) => {
  const pool = await cn();
  await pool.request()
    .input('idTicket', mssql.Int, idTicket)
    .input('idRecep', mssql.Int, idRecep)
    .input('fechaTicket', mssql.Date, fechaTicket)
    .input('total', mssql.Int, total)
    .query(`insert into ticket (idTicket, idRecep, fechaTicket, total)
      values (@idTicket, @idRecep, @fechaTicket, @total)`);
};

//busca el id de la tabla detTicket y le suma 1
export async function getDTicketId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idDTicket) as ultimoId from detTicket');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id del detTicket:", err);
    throw err;
  }
}

//ingreso los datos delos mini tikets
export const regDT = async ({ idDTicket, idTicket, noServ, noMed, subtotal, idServ, idMed }) => {
  const pool = await cn();
  await pool.request()
    .input('idDTicket', mssql.Int, idDTicket)
    .input('idTicket', mssql.Int, idTicket)
    .input('noServ', mssql.Int, noServ)
    .input('noMed', mssql.Int, noMed)
    .input('subTotal', mssql.Int, subtotal)
    .input('idServ', mssql.Int, idServ)
    .input('idMed', mssql.Int, idMed)
    .query(`insert into detTicket (idDTicket, idTicket, noServ, noMed, subtotal, idServ, idMed)
      values (@idDTicket, @idTicket, @noServ, @noMed, @subtotal, @idServ, @idMed)`);
};

//busca el id de la tabla pagoT y le suma 1
export async function getpagoTId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idPagoT) as ultimoId from pagoT');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id del pagoT:", err);
    throw err;
  }
}

//ingreso los datos del pagoT
export const  regPagoT = async ({ idPagoT, idTicket, fechaPago, montoT }) => {
  const pool = await cn();
  await pool.request()
    .input('idPagoT', mssql.Int, idPagoT)
    .input('idTicket', mssql.Int, idTicket)
    .input('fechaPago', mssql.Date, fechaPago)
    .input('montoT', mssql.Int, montoT)
    .query(`insert into pagoT(idPagoT, idTicket, fechaPago, montoT)
      values (@idPagoT, @idTicket, @fechaPago, @montoT)`);
};

//resto medicamentos
export const menMed = async ({ idMed, noMed }) => {
  if (!Number.isInteger(idMed) || idMed <= 0) {
    throw new Error(`idMed inválido recibido: ${idMed}`);
  }
  if (!Number.isInteger(noMed) || noMed <= 0) {
    throw new Error(`noMed inválido recibido: ${noMed}`);
  }
  const pool = await cn();
  await pool.request()
    .input('idMed', mssql.Int, idMed)
    .input('noMed', mssql.Int, noMed)
    .query("update med set stock = stock - @noMed where idMed = @idMed");
};


//mostramos todo lo del doc
export const vistaDoc = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("select u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, u.nomUser ,u.contra, e.salario, e.estatus, e.rfc, h.dias, "
        +"h.horaEnt, h.horaSal, h.turno, d.cedula, string_agg(es.nomEsp,', ') as especialidades, c.noCon, c.planta from usuario as u inner "
        +"join empleado as e on u.idUser=e.idUser inner join horario as h on h.idEmp=e.idEmp inner join doctor as d on e.idEmp=d.idEmp inner "
        +"join docEsp as de on de.cedula=d.cedula inner join asigCon as a on a.cedula=d.cedula inner join consul as c on c.idCon=a.idCon inner "
        +"join esp as es on es.idEsp=de.idEsp where u.idUser=@idUser group by u.idUser, u.nom, u.apPat ,u.apMat, u.fechaNac, u.tel, u.correo, "
        +"u.nomUser,u.contra, e.salario, e.estatus, e.rfc, h.dias, h.horaEnt, h.horaSal, h.turno, d.cedula, c.noCon, c.planta");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaDoc:", err);
    throw err;
  }
};

//mostramos todo lo del doc
export const ced = async (idUser) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idUser', mssql.Int, idUser)
      .query("select d.cedula from doctor as d inner join empleado as e on e.idEmp=d.idEmp inner join usuario as u on u.idUser=e.idUser "
        +"where u.idUser=@idUser");
    return result.recordset;
  } catch (err) {
    console.error("Error al obtener cedula doc:", err);
    throw err;
  }
};

//mostramos todo lo del doc
export const citasPendientes = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query("select c.idCita, u.nom, u.apPat, u.apMat, c.fechaC, c.fechaR, c.statCita, c.horaCita, c.esp from cita as c inner join paciente "
        +"as p on p.idPac=c.idPac inner join usuario as u on u.idUser=p.idUser where c.cedula=@cedula and "
        +"c.statCita='Pagada pendiente por atender'");
    return result.recordset;
  } catch (err) {
    console.error("Error en citasDoc:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const datosPaciente = async (idCita) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('idCita', mssql.Int, idCita)
      .query('select u.nom, u.apPat, u.apMat, p.tipoSeg, u.fechaNac, DATEDIFF(YEAR, u.fechaNac, GETDATE()) as edad, p.estatura, '
        +'hm.tipoSangre, hm.alergias, hm.vacunas, hm.enferCron, hm.anteFam from usuario as u inner join paciente as p on '
        +'u.idUser=p.idUser inner join histMed as hm on hm.idPac=p.idPac inner join cita as c on c.idPac=p.idPac where idCita=@idCita');
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta vistaPac:", err);
    throw err;
  }
};

//busca el id de receta y le zuma 1
export async function getRecetaId() {
  try {
    const pool = await cn();
    const result = await pool.request().query('select max(idRec) as ultimoId from receta');
    const ultimoId=result.recordset[0].ultimoId || 0;
    return ultimoId+1;
  } catch (err) {
    console.error("Error al obtener el ultimo id", err);
    throw err;
  }
}

//ingreso los datos de la receta
export const regReceta = async ({ idRec, idCita, diag, med, dosis, intervalo, fechaRe, observ }) => {
  const pool = await cn();
  await pool.request()
    .input('idRec', mssql.Int, idRec)
    .input('idCita', mssql.Int, idCita)
    .input('diag', mssql.VarChar, diag)
    .input('med', mssql.VarChar, med)
    .input('dosis', mssql.VarChar, dosis)
    .input('intervalo', mssql.VarChar, intervalo)
    .input('fechaRe', mssql.Date, fechaRe)
    .input('observ', mssql.VarChar, observ)
    .query(`insert into receta (idRec, idCita, diag, med, dosis, intervalo, fechaRe, observ)
      values (@idRec, @idCita, @diag, @med, @dosis, @intervalo, @fechaRe, @observ)`);
};

//le ago update ala cita
export const atendida = async ({ idCita }) => {
  const pool = await cn();
  await pool.request()
    .input('idCita', mssql.Int, idCita)
    .query(`update cita set statCita='Atendida' where idCita=@idCita`);
};

//ingresamos la informacion del paciente en la vista del paciente
export const recetas = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query("select u.nom, u.apPat, u.apMat, r.idRec, r.idCita, r.diag, r.med, r.dosis, r.intervalo, r.fechaRe, r.observ from receta "
        +"as r inner join cita as c on c.idCita=r.idCita inner join paciente as p on p.idPac=c.idPac inner join usuario as u "
        +"on u.idUser=p.idUser where c.cedula=@cedula");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta recetas:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const recetas2 = async (cedula, nombre) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('nombre', mssql.VarChar, `%${nombre}%`)
      .input('cedula', mssql.Int, cedula)
      .query("select u.nom, u.apPat, u.apMat, r.idRec, r.idCita, r.diag, r.med, r.dosis, r.intervalo, r.fechaRe, r.observ from receta "
        +"as r inner join cita as c on c.idCita=r.idCita inner join paciente as p on p.idPac=c.idPac inner join usuario as u on "
        +"u.idUser=p.idUser where c.cedula=@cedula and u.nom like '%'+@nombre+'%' or u.apPat like '%'+@nombre+'%' or u.apMat like '%'+@nombre+'%'");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta recetas2:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const bitacora = async (cedula) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('cedula', mssql.Int, cedula)
      .query("select b.idBit, b.idCita, b.idRec, b.nomP, b.apPatP, b.apMatP, b.nomD, b.apPatD, b.apMatD, b.esp, b.fechaCita, b.horaCita, "
        +"b.diag, b.med, b.dosis, b.intervalo, b.observ from bitacora as b where b.cedula=@cedula");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta recetas:", err);
    throw err;
  }
};

//ingresamos la informacion del paciente en la vista del paciente
export const bitacora2 = async (cedula, nombre) => {
  try {
    const pool = await cn(); 
    const result = await pool
      .request()
      .input('nombre', mssql.VarChar, `%${nombre}%`)
      .input('cedula', mssql.Int, cedula)
      .query("select b.idBit, b.idCita, b.idRec, b.nomP, b.apPatP, b.apMatP, b.nomD, b.apPatD, b.apMatD, b.esp, b.fechaCita, b.horaCita, "
        +"b.diag, b.med, b.dosis, b.intervalo, b.observ from bitacora as b where b.cedula=@cedula and b.nomP like '%'+@nombre+'%' or "
        +"b.apPatP like '%'+@nombre+'%' or b.apMatP like '%'+@nombre+'%'");
    return result.recordset;
  } catch (err) {
    console.error("Error en consulta recetas:", err);
    throw err;
  }
};
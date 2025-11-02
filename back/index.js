
//librerias kreo
import "dotenv/config";
import express from "express";
import cors from "cors";

//kueris de la base
import { inLog } from './consultas.js';
import { inLog2 } from './consultas.js';
import { buscaCurp } from "./consultas.js";
import { buscaRfc } from "./consultas.js";
import { buscaUsr } from "./consultas.js";
import { getUsrId } from "./consultas.js";
import { regUser } from './consultas.js';
import { getPacId } from './consultas.js';
import { regPac } from './consultas.js';
import { getHistId } from './consultas.js';
import { regHistMed } from './consultas.js';
import { getEmpId } from './consultas.js';
import { regEmp } from './consultas.js';
import { getHoraId } from './consultas.js';
import { regHora } from './consultas.js';
import { getRecepId } from './consultas.js';
import { regRecep } from './consultas.js';
import { buscaCed } from './consultas.js';
import { regDoc } from './consultas.js';
import { getDocEspId } from './consultas.js';
import { regDocEsp } from './consultas.js';
import { getACId } from './consultas.js';
import { consulSi } from './consultas.js';
import { regAC } from './consultas.js';
import { idPac } from './consultas.js';
import { docEsp } from './consultas.js';
import { horario } from './consultas.js';
import { nopDocs } from './consultas.js';
import { nopFecha } from './consultas.js';
import { getPagoId } from './consultas.js';
import { getCitaId } from './consultas.js';
import { regPago } from './consultas.js';
import { regCita } from './consultas.js';
import { noHora } from './consultas.js';
import { citas } from './consultas.js';
import { formaPagos } from './consultas.js';
import { pagoCita } from './consultas.js';
import { canCitaP } from './consultas.js';
import { vistaRec } from './consultas.js';
import { elPac } from './consultas.js';
import { laRecep } from './consultas.js';
import { elDoc } from './consultas.js';
import { allPac} from './consultas.js';
import { allRec } from './consultas.js';
import { allDoc } from './consultas.js';
import { byeDoc } from './consultas.js';
import { olaEmp } from './consultas.js';
import { infoPagoCita } from './consultas.js';
import { stock } from './consultas.js';
import { stock2 } from './consultas.js';
import { servicios } from './consultas.js';
import { idRecep } from './consultas.js';
import { getTicketId } from './consultas.js';
import { regTicket } from './consultas.js';
import { getDTicketId } from './consultas.js';
import { regDT } from './consultas.js';
import { getpagoTId } from './consultas.js';
import { regPagoT } from './consultas.js';
import { menMed } from './consultas.js';
import { vistaDoc } from './consultas.js';
import { ced } from './consultas.js';
import { citasPendientes } from './consultas.js';
import { datosPaciente } from './consultas.js';
import { getRecetaId} from './consultas.js';
import { regReceta} from './consultas.js';
import { atendida } from './consultas.js';
import { recetas } from './consultas.js';
import { recetas2 } from './consultas.js';
import { bitacora } from './consultas.js';
import { bitacora2 } from './consultas.js';
import { elPac2 } from './consultas.js';
import { laRecep2 } from './consultas.js';
import { elDoc2 } from './consultas.js';
import { infoUser } from './consultas.js';
import { infoPac } from './consultas.js';
import { infoHM } from './consultas.js';
import { consulSi2 } from './consultas.js';
import { infoEmp } from './consultas.js';
import { infoHor } from './consultas.js';
import { espDoc } from './consultas.js';
import { delDocEsp } from './consultas.js';
import { infoAC } from './consultas.js';
import { actCed } from './consultas.js';
import { changeDU } from './consultas.js';
import { cancCitaDoc } from './consultas.js';
import { devolPago } from './consultas.js';
import { vistaAdm } from './consultas.js';
import { byeRecep } from './consultas.js';

//configurasion del espres
const app = express();
const PORT = process.env.PORT || 5000;

//cosas relacionadas con los endpoints
app.use(cors());
app.use(express.json());

//busca el usuario y contraseña de la tabla usuario pal login
app.post("/api/login", async (req, res) => {
  const { usr } = req.body;
  const { psw } = req.body;
  try {
    const resultado = await inLog(usr, psw);
    if (resultado.length == 0) {
      res.json({
        encontrado: false,
        mensaje: `No se encontro al usuario o contraseña que ingreso`,
        datos: ''
      });
    } else {
      res.json({
        encontrado: true,
        mensaje: `Login exitoso`,
        datos: resultado[0],
      });
    }
  } catch (error) {
    console.error("Error al buscar usuario", error);
    res
      .status(500)
      .json({ error: "Error al buscar el usuario en la base de datos" });
  }
});

//si el usuario nosta actibo lo manda alv
app.post("/api/login2", async (req, res) => {
  const { usr } = req.body;
  const { psw } = req.body;
  try {
    const resultado = await inLog2(usr, psw);
    if (resultado.length == 0) {
      res.json({
        encontrado: false,
        mensaje: `No se encontro al usuario o contraseña que ingreso`,
        datos: ''
      });
    } else {
      res.json({
        encontrado: true,
        mensaje: `Login exitoso`,
        datos: resultado[0],
      });
    }
  } catch (error) {
    console.error("Error al buscar usuario", error);
    res
      .status(500)
      .json({ error: "Error al buscar el usuario en la base de datos" });
  }
});

//creo el endpoint para buscar usuario y sumarle 1
app.get("/api/sigIdUsr", async (req, res) => {
  try {
    const sigIdUser = await getUsrId();
    res.json({ sigIdUser });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idUser" });
  }
});

//buscar si ya existe el curp para decirle nel
app.post("/api/buscarCurp", async (req, res) => {
  const { curp } = req.body;
  try {
    const resultado = await buscaCurp(curp);

    if (resultado.length > 0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe alguien con ese curp en el sistema`,
        datos: resultado[0],
      });
    }else {
      res.json({
        encontrado: false,
    });
  }   
  } catch (error) {
    console.error("Error al buscar CURP:", error);
    res
      .status(500)
      .json({ error: "Error al buscar el CURP en la base de datos" });
  }
});

//buscar si ya existe el rfc para decirle nel
app.post("/api/buscarRfc", async (req, res) => {
  const { rfc } = req.body;
  try {
    const resultado = await buscaRfc(rfc);

    if (resultado.length > 0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe alguien con ese rfc en el sistema`,
        datos: resultado[0],
      });
    }else {
      res.json({
        encontrado: false,
    });
  }   
  } catch (error) {
    console.error("Error al buscar RFC:", error);
    res
      .status(500)
      .json({ error: "Error al buscar el rfc en la base de datos" });
  }
});

//buscar si ya existe un usuario kon ese nombre para decirle nel
app.post("/api/buscarUser", async (req, res) => {
  const { nomUser } = req.body;
  try {
    const resultado = await buscaUsr(nomUser);

    if (resultado.length > 0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe alguien con ese nombre de usuario en el sistema`,
        datos: resultado[0],
      });
    }else {
      res.json({
        encontrado: false,
    });
  }   
  } catch (error) {
    console.error("Error al buscar nomUser:", error);
    res
      .status(500)
      .json({ error: "Error al buscar el nomUser en la base de datos" });
  }
});

//buscar si ya existe el curp para decirle nel
app.post("/api/buscarCed", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resultado = await buscaCed(cedula);

    if (resultado.length > 0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe alguien con esa cedula en el sistema`,
        datos: resultado[0],
      });
    }else {
      res.json({
        encontrado: false,
    });
  }   
  } catch (error) {
    console.error("Error al buscar cedula:", error);
    res
      .status(500)
      .json({ error: "Error al buscar la cedula en la base de datos" });
  }
});

//aka es el endpoint para registrar al usuario
app.post("/api/regUser", async (req, res) => {
  try {
    const { idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser, correo, idTipoUser } =
      req.body;
    await regUser({idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser, correo, idTipoUser});
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regUser" });
  }
});

//creo el endpoint para buscar paciente y sumarle 1
app.get("/api/sigIdPac", async (req, res) => {
  try {
    const sigIdPac = await getPacId();
    res.json({ sigIdPac });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente paciente" });
  }
});

//aka es el endpoint para registrar al paciente
app.post("/api/regPaciente", async (req, res) => {
  try {
    const { idPac, idUser, tipoSeg, estatura, curp } = req.body;
    await regPac({ idPac, idUser, tipoSeg, estatura, curp });
    res.json({ mensaje: "Paciente registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar pasiente:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regPac" });
  }
});

//creo el endpoint para buscar hisMed y sumarle 1
app.get("/api/sigIdHistMed", async (req, res) => {
  try {
    const sigIdHistMed = await getHistId();
    res.json({ sigIdHistMed });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idhistMed" });
  }
});

//aka es el endpoint para registrar al histMed
app.post("/api/regHistMed", async (req, res) => {
  try {
    const { idHistMed, idPac, tipoSangre, alergias, vacunas, enferCron, anteFam } = req.body;
    await regHistMed({ idHistMed, idPac, tipoSangre, alergias, vacunas, enferCron, anteFam });
    res.json({ mensaje: "Historial medico registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar el historial medico:", err);
    res.status(500).json({ mensaje: "Error en el servidor en histMed" });
  }
});

//creo el endpoint para buscar id del empleado y sumarle 1
app.get("/api/sigIdEmp", async (req, res) => {
  try {
    const sigIdEmp = await getEmpId();
    res.json({ sigIdEmp });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idEmp" });
  }
});

//aka es el endpoint para registrar al empleado
app.post("/api/regEmp", async (req, res) => {
  try {
    const { idEmp, idUser, salario, estatus, rfc, idTipoEmp } = req.body;
    await regEmp({ idEmp, idUser, salario, estatus, rfc, idTipoEmp });
    res.json({ mensaje: "Empleado registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar al empleado:", err);
    res.status(500).json({ mensaje: "Error en el servidor en empleado" });
  }
});

//creo el endpoint para buscar id del horario y sumarle 1
app.get("/api/sigIdHora", async (req, res) => {
  try {
    const sigIdHora = await getHoraId();
    res.json({ sigIdHora });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la siguiente id Hora" });
  }
});

//aka es el endpoint para registrar el horario del empleado
app.post("/api/regHora", async (req, res) => {
  try {
    const { idHora, idEmp, dias, horaEnt, horaSal, turno } = req.body;
    await regHora({ idHora, idEmp, dias, horaEnt, horaSal, turno });
    res.json({ mensaje: "Horario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar horario:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regHora" });
  }
});


//creo el endpoint para buscar id de la recep y sumarle 1
app.get("/api/sigIdRecep", async (req, res) => {
  try {
    const sigIdRecep = await getRecepId();
    res.json({ sigIdRecep });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idRecep" });
  }
});

//aka es el endpoint para registrar a la recep
app.post("/api/regRecep", async (req, res) => {
  try {
    const { idRecep, idEmp } = req.body;
    await regRecep({ idRecep, idEmp });
    res.json({ mensaje: "Recepcionista registrada correctamente" });
  } catch (err) {
    console.error("Error al registrar la recepcionista:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regRecep" });
  }
});

//aka es el endpoint para registrar al doc
app.post("/api/regDoc", async (req, res) => {
  try {
    const { cedula, idEmp } = req.body;
    await regDoc({ cedula, idEmp });
    res.json({ mensaje: "Doctor registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar al doc:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regDoc" });
  }
});

//creo el endpoint para buscar idDocEsp y sumarle 1
app.get("/api/sigDocEspId", async (req, res) => {
  try {
    const sigDocEspId = await getDocEspId();
    res.json({ sigDocEspId });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la siguiente idDE" });
  }
});

//aka es el endpoint para registrar al docEsp
app.post("/api/regDocEsp", async (req, res) => {
  try {
    const { idDocEsp, cedula, idEsp, statEsp } = req.body;
    await regDocEsp({ idDocEsp, cedula, idEsp, statEsp });
    res.json({ mensaje: "Doctor esp registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar al docEsp:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regDocEsp" });
  }
});

//creo el endpoint para buscar el idAsigCon y sumarle 1
app.get("/api/sigACId", async (req, res) => {
  try {
    const sigACId = await getACId();
    res.json({ sigACId });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la siguiente id acid" });
  }
});

// crea el endpoint para buscar consultorios disponibles
app.get("/api/consul", async (req, res) => {
  try {
    const consul = await consulSi();
    res.json({ consul });
  } catch (err) {
    console.error("Error en /api/consul:", err);
    res.status(500).json({ error: "Error al obtener consultorios disponibles" });
  }
});

//aka es el endpoint para registrar al asigCon
app.post("/api/regAC", async (req, res) => {
  try {
    const { idAsigCon, cedula, idCon, statCon, horaIn, horaFin, dias } = req.body;
    await regAC({ idAsigCon, cedula, idCon, statCon, horaIn, horaFin, dias });
    res.json({ mensaje: "asigCon registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar el asigCon:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regAC" });
  }
});

//busca el ide del pac api para generar cita
app.post("/api/idPac", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await idPac(idUser);
    res.json(resul[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el id del paciente" });
  }
});

//busca el nombre del doc api
app.post("/api/nomDoc", async (req, res) => {
  const { esp } = req.body;
  try {
    const resul = await docEsp(esp);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del doctor" });
  }
});

//busca cedula de docs para descatar api
app.post("/api/nopDoc", async (req, res) => {
  const { idPac } = req.body;
  try {
    const resul = await nopDocs(idPac);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la cedula de los docs" });
  }
});

//busca el horario del doc api
app.post("/api/horario", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await horario(cedula);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el horario del doc" });
  }
});

//api para kitarle la fecha donde el doctor ya tenga una cita api
app.post("/api/nonoFecha", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await nopFecha(cedula);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener nono fecha del doc in cita" });
  }
});

//creo el endpoint para buscar pago y sumarle 1
app.get("/api/sigPagoId", async (req, res) => {
  try {
    const sigIdPago = await getPagoId();
    res.json({ sigIdPago });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idPago" });
  }
});

//creo el endpoint para buscar cita y sumarle 1
app.get("/api/sigCitaId", async (req, res) => {
  try {
    const sigIdCita = await getCitaId();
    res.json({ sigIdCita });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idCita" });
  }
});

//registrar el pago api
app.post("/api/regPago", async (req, res) => {
  try {
    const { idPago, monto, formaPago, limPago, statPago } = req.body;
    await regPago({ idPago, monto, formaPago, limPago, statPago });
    res.json({ mensaje: "Pago registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar pago:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regPago" });
  }
});

//registrar la cita api
app.post("/api/regCita", async (req, res) => {
  try {
    const { idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita, esp } = req.body;
    await regCita({ idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita, esp });
    res.json({ mensaje: "Cita registrada correctamente" });
  } catch (err) {
    console.error("Error al registrar cita:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regCita", error: err.message });
  }
});

//api para mandar alerta no supe kitar ora api
app.post("/api/gandalf", async (req, res) => {
  const { cedula, fechaR, horaCita } = req.body;
  try {
    const resul = await noHora(cedula, fechaR, horaCita);
    res.json(resul);
  } catch (err) {
    console.error("Error en gandalf:", err);
    res.status(500).json({ error: "Error al obtener fecha y hora del doc en cita" });
  }
});

//busca el ide de la info de las citas del pasiente api
app.post("/api/citas", async (req, res) => {
  const { idPac } = req.body;
  try {
    const resul = await citas(idPac);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las citas del paciente" });
  }
});

//muestra la info del pago al paciente api
app.post("/api/infoPagoCita", async (req, res) => {
  const { idPago } = req.body;
  try {
    const resul = await infoPagoCita(idPago);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la info del pago" });
  }
});

//api para aktualisar el pago
app.post('/api/formaPago', async (req, res) => {
  try {
    const { idPago, formaPago } = req.body;
    await formaPagos({ idPago, formaPago }); 
    res.json({ mensaje: 'Forma de pago actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la forma de pago:", error);
    res.status(500).json({ error: "Error al actualizar la forma de pago" });
  }
});

//api para aktualisar el pago en tabla cita
app.post('/api/pagoCita', async (req, res) => {
  try {
    const { idPago } = req.body;
    await pagoCita({ idPago }); 
    res.json({ mensaje: 'Forma de pago actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la forma de pago en cita:", error);
    res.status(500).json({ error: "Error al actualizar la forma de pago en cita" });
  }
});

//api para aktualisar la sita el paciente kanselo
app.post('/api/canCitaP', async (req, res) => {
  try {
    const { idCita, nuevoEstado} = req.body;
    await canCitaP({ idCita, nuevoEstado}); 
    res.json({ mensaje: 'Se cancelo la cita correctamente' });
  } catch (error) {
    console.error("Error al actualizar al cancelar la cita:", error);
    res.status(500).json({ error: "Error al cancelar la cita:" });
  }
});

//busca los datos de la recep para darselos api
app.post("/api/datosRec", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await vistaRec(idUser);
    res.json(resul[0]); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de la recepcionista" });
  }
});

//busca todos los datos del paciente para darselos api
app.post("/api/elPac", async (req, res) => {
  const { curp } = req.body;
  try {
    const resul = await elPac(curp);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de  EL paciente" });
  }
});

//busca todos los datos de la recep para darselos api
app.post("/api/laRec", async (req, res) => {
  const { rfc } = req.body;
  try {
    const resul = await laRecep(rfc);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de LA recepcionista" });
  }
});

//busca todos los datos del doc para darselos api
app.post("/api/elDoc", async (req, res) => {
  const { rfc } = req.body;
  try {
    const resul = await elDoc(rfc);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de EL doctor" });
  }
});

//api todos los pacientes
app.get("/api/todosPac", async (req, res) => {
  try {
    const pacientes = await allPac();
    res.json(pacientes);
  } catch (err) {
    console.error("Error al obtener todos los pacientes:", err);
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
});

//api todos las recep
app.get("/api/todasRec", async (req, res) => {
  try {
    const recepcionistas = await allRec();
    res.json(recepcionistas);
  } catch (err) {
    console.error("Error al obtener recepcionistas:", err);
    res.status(500).json({ error: "Error al obtener recepcionistas" });
  }
});

//api todos los doctores
app.get("/api/todosDoc", async (req, res) => {
  try {
    const doctores = await allDoc();
    res.json(doctores);
  } catch (err) {
    console.error("Error al obtener doctores:", err);
    res.status(500).json({ error: "Error al obtener doctores" });
  }
});

//saka alv al doc
app.post("/api/byeDoc", async (req, res) => {
  const { idUser } = req.body;
  try {
    const result = await byeDoc(idUser);
    //Si result es falso o vacio, envia un objeto por defecto
    res.json(result || { rowsAffected: [0] });
  } catch (err) {
    console.error("Error en /api/byeDoc:", err);
    res.status(500).json({ error: "No jalo el byeDoc" });
  }
});

//regresamos alv al doc
app.post("/api/olaEmp", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await olaEmp(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "No jalo el olaEmp" });
  }
});

//api stock medikamentos
app.get("/api/med", async (req, res) => {
  try {
    const nomMed = await stock();
    res.json(nomMed);
  } catch (err) {
    console.error("Error al obtener medicinas:", err);
    res.status(500).json({ error: "Error al obtener medicinas" });
  }
});

//api medicamentos por buskeda
app.post("/api/med2", async (req, res) => {
  const { nomMed } = req.body;
  try {
    const resul = await stock2(nomMed);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las medisinas" });
  }
});

//api info de serbisios
app.get("/api/servicios", async (req, res) => {
  try {
    const serv = await servicios();
    res.json(serv);
  } catch (err) {
    console.error("Error al obtener serbicios:", err);
    res.status(500).json({ error: "Error al obtener serbicios" });
  }
});

//api obtener id dela recep
app.post("/api/idRecep", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await idRecep(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el id dela recep" });
  }
});

//creo el endpoint para buscar id del tiket y sumarle 1
app.get("/api/sigTicketId", async (req, res) => {
  try {
    const sigIdTicket = await getTicketId();
    res.json({ sigIdTicket });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idTicket" });
  }
});

//registrar el tiket mayor api
app.post("/api/regTicket", async (req, res) => {
  try {
    const { idTicket, idRecep, fechaTicket, total } = req.body;
    await regTicket({ idTicket, idRecep, fechaTicket, total });
    res.json({ mensaje: "Ticket registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar tiket:", err);
    res.status(500).json({ mensaje: "Error en el servidor en tiket" });
  }
});

//creo el endpoint para buscar Dticket y sumarle 1
app.get("/api/sigDTicketId", async (req, res) => {
  try {
    const sigIdDTicket = await getDTicketId();
    res.json({ sigIdDTicket });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idDTicket" });
  }
});

//registrar el mini tiket api
app.post("/api/regDTicket", async (req, res) => {
  try {
    const { idDTicket, idTicket, noServ, noMed, subtotal, idServ, idMed } = req.body;
    await regDT({ idDTicket, idTicket, noServ, noMed, subtotal, idServ, idMed });
    res.json({ mensaje: "DTicket registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar DeTiket:", err);
    res.status(500).json({ mensaje: "Error en el servidor en DeTiket" });
  }
});

//creo el endpoint para buscar tiket mayor y sumarle 1
app.get("/api/sigPagoTId", async (req, res) => {
  try {
    const sigIdPagoT = await getpagoTId();
    res.json({ sigIdPagoT });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idPagoT" });
  }
});

//registrar el pago del tiket api
app.post("/api/regPagoT", async (req, res) => {
  try {
    const { idPagoT, idTicket, fechaPago, montoT } = req.body;
    await regPagoT({ idPagoT, idTicket, fechaPago, montoT });
    res.json({ mensaje: "pagoT registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar pagoT:", err);
    res.status(500).json({ mensaje: "Error en el servidor en pagoT" });
  }
});

//api para restar medikamentos
app.post('/api/menosMed', async (req, res) => {
  try {
    const { idMed, noMed } = req.body;
    await menMed({ idMed, noMed }); 
    res.json({ mensaje: 'Se resto los medicamentos de manera exitosa' });
  } catch (error) {
    console.error("Error al actualizar los medicamentos:", error);
    res.status(500).json({ error: "Error al actualizar los medicamentos" });
  }
});

//busca los datos del doc para darselos api
app.post("/api/datosDoc", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await vistaDoc(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del doc" });
  }
});

//obtengo cedula kon idUsuario api
app.post("/api/cedula", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await ced(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la cedula del doc" });
  }
});

//busca las citas pendientes del doc
app.post("/api/citasDoc", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await citasPendientes(cedula);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las citas del doc" });
  }
});

//datos paciente cita
app.post("/api/datosPaciente", async (req, res) => {
  const { idCita } = req.body;
  try {
    const resul = await datosPaciente(idCita);
    res.json(resul[0]); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del paciente de la cita" });
  }
});

//creo el endpoint para buscar receta y sumarle 1
app.get("/api/sigRecetaId", async (req, res) => {
  try {
    const sigRecetaId = await getRecetaId();
    res.json({ sigRecetaId });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la sigueinte id receta" });
  }
});

//registrar la receta aki
app.post("/api/regReceta", async (req, res) => {
  try {
    const { idRec, idCita, diag, med, dosis, intervalo, fechaRe, observ } = req.body;
    await regReceta({ idRec, idCita, diag, med, dosis, intervalo, fechaRe, observ });
    res.json({ mensaje: "Receta registrada correctamente" });
  } catch (err) {
    console.error("Error al registrar receta:", err);
    res.status(500).json({ mensaje: "Error en el servidor en regReceta" });
  }
});

//api para aktualisar la cita yase atendio
app.post('/api/atendida', async (req, res) => {
  try {
    const { idCita } = req.body;
    await atendida({ idCita }); 
    res.json({ mensaje: 'Cita atendida' });
  } catch (error) {
    console.error("Error al actualizar cita atendida:", error);
    res.status(500).json({ error: "Error al actualizar cita atendida" });
  }
});

//recetas creadas
app.post("/api/recetas", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await recetas(cedula);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de las recetas" });
  }
});

//recetas creadas
app.post("/api/recetas2", async (req, res) => {
  const { cedula, nombre } = req.body;
  try {
    const resul = await recetas2(cedula, nombre);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de las recetas2" });
  }
});

//bikatora
app.post("/api/bitacora", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await bitacora(cedula);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de la bitacora" });
  }
});

//bitakora kon buskeda
app.post("/api/bitacora2", async (req, res) => {
  const { cedula, nombre } = req.body;
  try {
    const resul = await bitacora2(cedula, nombre);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de la bitacora2" });
  }
});

//a partir de aki empese yo kon modifikaciones para terminar la pagina chida por culpa de progra web
//busca los datos del paciente pa modificarlos api
app.post("/api/elPac2", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await elPac2(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de  EL paciente 2" });
  }
});

//busca los datos de la recep pa modifikarlos api
app.post("/api/laRec2", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await laRecep2(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de LA recepcionista 2" });
  }
});

//busca los datos del doc para modifikarlos api
app.post("/api/elDoc2", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await elDoc2(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de EL doctor 2" });
  }
});

//api para aktualisar info del usuario
app.post('/api/infoUser', async (req, res) => {
  try {
    const { idUser, nom, apPat ,apMat, fechaNac, tel, correo, nomUser ,contra } = req.body;
    await infoUser({ idUser, nom, apPat ,apMat, fechaNac, tel, correo, nomUser ,contra }); 
    res.json({ mensaje: 'Informacion del usuario actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del usuario:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del usuario" });
  }
});

//api para aktualisar info del paciente
app.post('/api/infoPac', async (req, res) => {
  try {
    const { idUser, tipoSeg, estatura , curp } = req.body;
    await infoPac({ idUser, tipoSeg, estatura, curp }); 
    res.json({ mensaje: 'Informacion del paciente actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del paciente:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del paciente" });
  }
});

//api para aktualisar info del istorial mediko
app.post('/api/infoHM', async (req, res) => {
  try {
    const { idUser, tipoSangre, alergias , vacunas, enferCron, anteFam } = req.body;
    await infoHM({ idUser, tipoSangre, alergias , vacunas, enferCron, anteFam }); 
    res.json({ mensaje: 'Informacion del historial medico actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del historial medico:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del historial medico" });
  }
});

//crea la api para buzkar konsultorios junto con el consul del doc
app.post("/api/consul2", async (req, res) => {
  try {
    const { idUser } = req.body;
    const result = await consulSi2(idUser);
    res.json({ consul2: result });
  } catch (error) {
    console.error("Error al obtener consultorios:", error);
    res.status(500).json({ error: "Error en consul2" });
  }
});

//api para aktualisar info del empleado
app.post('/api/infoEmp', async (req, res) => {
  try {
    const { idUser, salario, estatus, rfc } = req.body;
    await infoEmp({ idUser, salario, estatus, rfc }); 
    res.json({ mensaje: 'Informacion del empleado actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del empleado:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del empleado" });
  }
});

//api para aktualisar info del horario
app.post('/api/infoHor', async (req, res) => {
  try {
    const { idUser, dias, horaEnt, horaSal, turno } = req.body;
    await infoHor({ idUser, dias, horaEnt, horaSal, turno }); 
    res.json({ mensaje: 'Informacion del horario actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del horario:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del horario" });
  }
});

//api pa actuializar sedula
app.put("/api/actCed", async (req, res) => {
  const { idUser, cedula } = req.body;
  const resultado = await actCed(idUser, cedula);
  if (resultado.success) res.json({ mensaje: "Cedula actualizada correctamente" });
  else res.status(500).json({ error: resultado.error });
});

//crea la api para buzkar las esp que tiene el doc aorita para comparar y eliminar o agregar
app.get("/api/espDoc/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    const result = await espDoc(parseInt(idUser));
    res.json(result);
  } catch (error) {
    console.error("Error al obtener las especialidades del doctor:", error);
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
});

//elimina una espesialidad del doctor
app.delete('/api/delDocEsp/:cedula/:idEsp', async (req, res) => {
  try {
    const { cedula, idEsp } = req.params;
    await delDocEsp({ cedula, idEsp });
    res.json({ mensaje: `Especialidad ${idEsp} eliminada correctamente para el doctor ${cedula}` });
  } catch (error) {
    console.error("Error al eliminar especialidad:", error);
    res.status(500).json({ error: "Error al eliminar especialidad del doctor" });
  }
});

//api para aktualisar info del asigCon
app.post('/api/infoAC', async (req, res) => {
  try {
    const { cedula, idCon, statCon, horaIn, horaFin, dias } = req.body;
    await infoAC({ cedula, idCon, statCon, horaIn, horaFin, dias }); 
    res.json({ mensaje: 'Informacion del AC actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info del AC:", error);
    res.status(500).json({ error: "Error al actualizar la informacion del AC" });
  }
});

//api para aktualizar algunoz datoz del usuario
app.post('/api/changeDU', async (req, res) => {
  try {
    const { idUser, nomUser, contra, correo, tel } = req.body;
    await changeDU({ idUser, nomUser, contra, correo, tel }); 
    res.json({ mensaje: 'Informacion actualizada correctamente' });
  } catch (error) {
    console.error("Error al actualizar la info en changeDU:", error);
    res.status(500).json({ error: "Error al actualizar la informacion" });
  }
});

//api para k el doc pueda cancelar cita
app.post('/api/cancCitaDoc', async (req, res) => {
  try {
    const { idCita } = req.body;
    await cancCitaDoc({ idCita }); 
    res.json({ mensaje: 'Cita cancelada correctamente' });
  } catch (error) {
    console.error("Error al cancelar la cita por parte del doc:", error);
    res.status(500).json({ error: "Error al cancelar la cita" });
  }
});

//api para aktualizar algunaz infos usuario
app.post('/api/devolPago', async (req, res) => {
  try {
    const { idCita } = req.body;
    await devolPago({ idCita }); 
    res.json({ mensaje: 'Devolucion hecha correctamente' });
  } catch (error) {
    console.error("Error al devolver el pago:", error);
    res.status(500).json({ error: "Error al devolver pago" });
  }
});

//busca el nombre del admin para darselos api
app.post("/api/datosAdm", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await vistaAdm(idUser);
    res.json(resul[0]); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del admin" });
  }
});

//saka alv a la recep
app.post("/api/byeRecep", async (req, res) => {
  const { idUser } = req.body;
  try {
    const result = await byeRecep(idUser);
    res.json(result || { rowsAffected: [0] });
  } catch (err) {
    console.error("Error en /api/byeRecep:", err);
    res.status(500).json({ error: "No jalo el byeRecep" });
  }
});

//pongo algo en localhost:5000 para saber si esta chido el serbidor
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(PORT, () => {
  //si pongo cosas aqui inicializan junto con el serbidor
  console.log(`Servidor chido en el puerto ${PORT}`);
});


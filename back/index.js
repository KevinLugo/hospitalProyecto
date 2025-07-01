
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
import { vistaPac } from './consultas.js';
import { vistaPac2 } from './consultas.js';
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
import { olaDoc } from './consultas.js';
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
        datos: resultado[0], // contiene idUser y tipoUs
      });
    }
  } catch (error) {
    console.error("Error al buscar usuario", error);
    res
      .status(500)
      .json({ error: "Error al buscar el usuario en la base de datos" });
  }
});

//busca el usuario y contraseña de la tabla usuario pal login2
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
        datos: resultado[0], // contiene idUser y tipoUs
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

//buscar si ya existe el curp para decirle nel
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

//creo el endpoint para buscar hisMed y sumarle 1
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

//creo el endpoint para buscar paciente y sumarle 1
app.get("/api/sigIdHora", async (req, res) => {
  try {
    const sigIdHora = await getHoraId();
    res.json({ sigIdHora });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la siguiente id Hora" });
  }
});

//aka es el endpoint para registrar al paciente
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


//creo el endpoint para buscar hisMed y sumarle 1
app.get("/api/sigIdRecep", async (req, res) => {
  try {
    const sigIdRecep = await getRecepId();
    res.json({ sigIdRecep });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idRecep" });
  }
});

//aka es el endpoint para registrar al histMed
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
    const consul = await consulSi(); // ← aquí estaba mal el nombre
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

//busca los datos del paciente para darselos api
app.post("/api/datosPac", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await vistaPac(idUser);
    res.json(resul[0]); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del paciente" });
  }
});

//busca los datos del paciente2 para darselos api
app.post("/api/datosPac2", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await vistaPac2(idUser);
    res.json(resul[0]); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos del paciente2" });
  }
});

//busca el ide del pac api
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

//creo el endpoint para bbuscar pago y sumarle 1
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
    console.error("Error al registrar cita:", err); // <-- MUY IMPORTANTE
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
    console.error("Error al obtener nono hora:", err);
    res.status(500).json({ error: "Error al obtener fecha y hora del doc en cita" });
  }
});

//busca el ide del pac api
app.post("/api/citas", async (req, res) => {
  const { idPac } = req.body;
  try {
    const resul = await citas(idPac);
    res.json(resul);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las citas del paicnete" });
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

//api para aktualisar el pago
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

//busca los datos del paciente para darselos api
app.post("/api/elPac", async (req, res) => {
  const { curp } = req.body;
  try {
    const resul = await elPac(curp);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de  EL paciente" });
  }
});

//busca los datos del paciente para darselos api
app.post("/api/laRec", async (req, res) => {
  const { rfc } = req.body;
  try {
    const resul = await laRecep(rfc);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de LA recepcionista" });
  }
});

//busca los datos del paciente para darselos api
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
    //Si result es falsy o vacío, envía un objeto por defecto
    res.json(result || { rowsAffected: [0] });
  } catch (err) {
    console.error("Error en /api/byeDoc:", err);
    res.status(500).json({ error: "No jalo el byeDoc" });
  }
});

//regresamos alv al doc
app.post("/api/olaDoc", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await olaDoc(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "No jalo el olaDoc" });
  }
});


//muestra la info del pago al paciente api
app.post("/api/infoPagoCita", async (req, res) => {
  const { idPago } = req.body;
  try {
    const resul = await infoPagoCita(idPago); //
    res.json(resul); //
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la info del pago" });
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

//api stock medikamentos
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

//creo el endpoint para buscar cita y sumarle 1
app.get("/api/sigTicketId", async (req, res) => {
  try {
    const sigIdTicket = await getTicketId();
    res.json({ sigIdTicket });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idTicket" });
  }
});

//registrar el tiket api
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

//creo el endpoint para buscar cita y sumarle 1
app.get("/api/sigDTicketId", async (req, res) => {
  try {
    const sigIdDTicket = await getDTicketId();
    res.json({ sigIdDTicket });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idDTicket" });
  }
});

//registrar el tiket api
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

//creo el endpoint para buscar cita y sumarle 1
app.get("/api/sigPagoTId", async (req, res) => {
  try {
    const sigIdPagoT = await getpagoTId();
    res.json({ sigIdPagoT });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idPagoT" });
  }
});

//registrar el tiket api
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

//api para aktualisar el pago
app.post('/api/menosMed', async (req, res) => {
  try {
    const { idMed, noMed } = req.body;
    await menMed({ idMed, noMed }); 
    res.json({ mensaje: 'Se resto los medicamentos de manera exitosa' });
  } catch (error) {
    console.error("Error al actualizar los medicamentos:", error);
    res.status(500).json({ error: "Error al actualizar la forma de pago" });
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

//busca los datos del doc para darselos api
app.post("/api/cedula", async (req, res) => {
  const { idUser } = req.body;
  try {
    const resul = await ced(idUser);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la cedula del doc" });
  }
});

//busca las citas del doc
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

//api para aktualisar el pago
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

//recetas creadas
app.post("/api/bitacora", async (req, res) => {
  const { cedula } = req.body;
  try {
    const resul = await bitacora(cedula);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de la bitacora" });
  }
});

//recetas creadas
app.post("/api/bitacora2", async (req, res) => {
  const { cedula, nombre } = req.body;
  try {
    const resul = await bitacora2(cedula, nombre);
    res.json(resul); 
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los datos de la bitacora2" });
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


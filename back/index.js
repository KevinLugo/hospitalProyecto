//librerias kreo
import "dotenv/config";
import express from "express";
import cors from "cors";

//kueris de la base
import { getUsrId } from "./consultas.js";
import { buscaCurp } from "./consultas.js";
import { inLog } from './consultas.js';
import { regPac } from './consultas.js';
import { getPacId } from './consultas.js';
import { regUser } from './consultas.js';
import { vistaPac } from './consultas.js';
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
import { canCitaP } from './consultas.js';


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
    }
  } catch (error) {
    console.error("Error al buscar CURP:", error);
    res
      .status(500)
      .json({ error: "Error al buscar el CURP en la base de datos" });
  }
});

//aka es el endpoint para registrar al usuario
app.post("/api/regUser", async (req, res) => {
  try {
    const { idUser, nom, apPat, apMat, fechaNac, tel, contra, nomUser } =
      req.body;
    await regUser({idUser,nom,apPat,apMat,fechaNac,tel,contra,nomUser,});
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
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
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
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
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

//registrar la cita api
app.post("/api/regCita", async (req, res) => {
  try {
    const { idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita } = req.body;
    await regCita({ idCita, cedula, idPac, idPago, fechaC, fechaR, statCita, horaCita });
    res.json({ mensaje: "Cita registrada correctamente" });
  } catch (err) {
    console.error("Error al registrar cita:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
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

//api para aktualisar la sita el paciente kanselo
app.post('/api/canCitaP', async (req, res) => {
  try {
    const { idCita} = req.body;
    await canCitaP({ idCita,}); 
    res.json({ mensaje: 'Se cancelo la cita correctamente' });
  } catch (error) {
    console.error("Error al actualizar al cancelar la cita:", error);
    res.status(500).json({ error: "Error al cancelar la cita:" });
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


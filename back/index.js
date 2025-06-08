//librerias kreo
import 'dotenv/config';
import express from 'express';
import cors from "cors";

//kueris de la base
import { getUsrId } from "./consultas.js";


//configurasion del espres
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/sigIdUsr", async (req, res) => {
  try {
    const siguienteId = await getUsrId();
    res.json({ siguienteId });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el siguiente idUser" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(PORT, () => {
    //si pongo cosas aqui inicializan junto con el serbidor
    console.log(`Servidor chido en el puerto ${PORT}`);

});

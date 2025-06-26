(async function () {
//aca obttuve la id desde el login
const idUsuario = sessionStorage.getItem("idUsuario");
if (!idUsuario) {
  alert("No hay sesión activa. Por favor inicia sesión.");
  throw new Error("idUsuario no está definido");
}

//aca le pongo sus datos al paciente
try {
  const dataPac = await fetch("http://localhost:5000/api/datosPac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: idUsuario }),
  });
  const datosPac = await dataPac.json();
  let datos = {
    nombre: datosPac.nom,
    apellidoP: datosPac.apPat,
    apellidoM: datosPac.apMat,
    TSeguro: datosPac.tipoSeg,
    Estatura: datosPac.estatura,
    correo: datosPac.correo,
    edad: datosPac.edad,
    telefono: datosPac.tel,
    curp: datosPac.curp,
    nomUser: datosPac.nomUser,
    contra: datosPac.contra,
    usuarioT: "PACIENTE",
  };
  document.getElementById("TSeguro").innerText = datos.TSeguro;
  document.getElementById("Estatura").innerText = datos.Estatura;
  document.getElementById("edad_persona").innerText = datos.edad;
  document.getElementById("correo").innerText = datos.correo;
  document.getElementById("telefono").innerText = datos.telefono;
  document.getElementById("nombreF").innerText = datos.nombre;
  document.getElementById("apellidoM").innerText = datos.apellidoM;
  document.getElementById("apellidoP").innerText = datos.apellidoP;
  document.getElementById("curp").innerText = datos.curp;
  document.getElementById("user").innerText = datos.nomUser;
  document.getElementById("psw").innerText = datos.contra;
} catch (err) {
  console.error("Error en la solicitud:", err);
  alert("Error al consultar los datos del pac.");
}
})();
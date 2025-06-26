(async function () {
//aca obttuve la id desde el login
const idUsuario = sessionStorage.getItem("idUsuario");
if (!idUsuario) {
  alert("No hay sesión activa. Por favor inicia sesión.");
  throw new Error("idUsuario no está definido");
}

//aca le pongo sus datos al paciente
try {
  const dataRec = await fetch("http://localhost:5000/api/datosRec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: idUsuario }),
  });
  const datosRec = await dataRec.json();
  let datos = {
    nombre: datosRec.nom,
    apPat: datosRec.apPat,
    apMat: datosRec.apMat,
    correo: datosRec.correo,
    edad: datosRec.edad,
    telefono: datosRec.tel,
    rfc: datosRec.rfc,
    sal: dataRec.salario,
    dias: dataRec.dias,
    horaEnt: dataRec.horaEnt,
    horaSal: dataRec.horaSal, 
    turno: dataRec.turno
  };
  let nombreComp=datos.apPat+' '+datos.apMat +' '+datos.nombre;
  const nombre = "Nombre";
    const hora = new Date().getHours();
    let saludo = "Bienvenido";

    if (hora < 12) saludo = "Buenos días";
    else if (hora < 18) saludo = "Buenas tardes";
    else saludo = "Buenas noches";
  document.getElementById("welcome").textContent = `${saludo}, ${nombreComp}`;
} catch (err) {
  console.error("Error en la solicitud:", err);
  alert("Error al consultar los datos del pac.");
}
})();
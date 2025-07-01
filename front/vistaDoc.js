(async function () {
//aca obttuve la id desde el login
const idUsuario = sessionStorage.getItem("idUsuario");
if (!idUsuario) {
  alert("No hay sesión activa. Por favor inicia sesión.");
  throw new Error("idUsuario no está definido");
}

//aca le pongo sus datos al paciente
try {
  const dataDoc = await fetch("http://localhost:5000/api/datosDoc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: idUsuario }),
  });
  const datosDoc = (await dataDoc.json())[0];

  let datos = {
    nombre: datosDoc.nom,
    apPat: datosDoc.apPat,
    apMat: datosDoc.apMat,
    correo: datosDoc.correo,
    edad: datosDoc.edad,
    telefono: datosDoc.tel,
    rfc: datosDoc.rfc,
    sal: datosDoc.salario,
    dias: datosDoc.dias,
    horaEnt: datosDoc.horaEnt,
    horaSal: datosDoc.horaSal, 
    turno: datosDoc.turno
  };
  let nombreComp=datos.apPat+' '+datos.apMat +' '+datos.nombre;
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
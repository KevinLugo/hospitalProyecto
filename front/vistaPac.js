(async function () {
//aca obttuve la id desde el login
const idUsuario = sessionStorage.getItem("idUsuario");
if (!idUsuario) {
  alert("No hay sesion activa, por favor inicia sesion");
  throw new Error("idUsuario no esta definido");
}

//aca le pongo sus datos a la recepcionista
try {
  const dataPac = await fetch("http://localhost:5000/api/elPac2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: idUsuario }),
  });
  const datosPac = await dataPac.json();
  let datos = datosPac[0];
  let nombreComp=datos.apPat+' '+datos.apMat +' '+datos.nom;
    const hora = new Date().getHours();
    let saludo = "Bienvenido";

    if (hora < 12) saludo = "Buenos dias";
    else if (hora < 18) saludo = "Buenas tardes";
    else saludo = "Buenas noches";
  document.getElementById("welcome").textContent = `${saludo}, ${nombreComp}`;
} catch (err) {
  console.error("Error en la solicitud:", err);
  alert("Error al consultar los datos del paciente");
}
})();
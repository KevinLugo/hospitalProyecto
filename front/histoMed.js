(async function () {
  //aca obttuve la id desde el login
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    throw new Error("idUsuario no está definido");
  }

  //aca le pongo sus datos2 al paciente
  try {
    const dataPac2 = await fetch("http://localhost:5000/api/datosPac2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: idUsuario }),
    });
    const datosPac2 = await dataPac2.json();
    
    document.getElementById("Ecronica").innerText = datosPac2.enferCron;
    document.getElementById("Vacuna").innerText = datosPac2.vacunas;
    document.getElementById("AnteFam").innerText = datosPac2.anteFam;
    document.getElementById("Alergias").innerText = datosPac2.alergias;
    document.getElementById("TipSangre").innerText = datosPac2.tipoSangre;
  } catch (err) {
    console.error("Error en la solicitud:", err);
    alert("Error al consultar los datos2 del pac.");
  }
})();

document.getElementById("boton2").addEventListener("click", function () {
  window.location.href = "vistaPac.html"; // Redirige a otra página
});

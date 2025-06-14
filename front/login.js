document.getElementById("boton1").addEventListener("click", async () => {
  const usr = document.getElementById("user").value;
  const psw = document.getElementById("psw").value;
  if (usr == "" || psw == "") {
    alert("kepaso maistro?");
  } else {
    //aki ago consulta y si existe yamame
    try {
      const tipoUsr = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usr, psw })//variables que le envio a la funcion
      });
      const dataUsr = await tipoUsr.json();
      if (dataUsr.encontrado==false) {
        alert(dataUsr.mensaje);
        return; // salimos si ya existe
      }else{
        const idUsuario = dataUsr.datos.idUser;
        sessionStorage.setItem("idUsuario", idUsuario);
        if(dataUsr.datos.tipoUs=="Paciente"){
            window.location.href = "vistaPac.html";
        }else{
            alert("Todavia no llegamos a ese mero")
            window.location.href = "login.html";
        }
      }
    } catch (err) {
      console.error("Error en la solicitud del usuario:", err);
      alert("Error al consultar el usuario.");
      return;
    }
  }
});

document.getElementById("boton2").addEventListener("click", function () {
  window.location.href = "regPac.html"; // Redirige a otra página
});

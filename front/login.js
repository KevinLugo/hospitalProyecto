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
        body: JSON.stringify({ usr, psw }), //variables que le envio a la funcion
      });
      const dataUsr = await tipoUsr.json();
      if (dataUsr.encontrado == false) {
        alert(dataUsr.mensaje);
        return; // salimos
      } else {
        const idUsuario = dataUsr.datos.idUser;
        sessionStorage.setItem("idUsuario", idUsuario);
        if (dataUsr.datos.tipoUs == "Paciente") {
          alert("Bienvendo!");
          window.location.href = "vistaPac.html";
        } else if (dataUsr.datos.tipoUs == "Empleado") {
          try {
            const tipoUsr2 = await fetch("http://localhost:5000/api/login2", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usr, psw }), //variables que le envio a la funcion
            });
            const dataUsr2 = await tipoUsr2.json();
            if (dataUsr2.encontrado == false) {
              alert(dataUsr2.mensaje);
              return;
            } else {
              if (dataUsr2.datos.tipoEmp == "doctor" && dataUsr2.datos.estatus=="activo") {
                alert("Bienvendo!");
                window.location.href = "vistaDoc.html";
              } else if (dataUsr2.datos.tipoEmp == "recepcionista" && dataUsr2.datos.estatus=="activo") {
                alert("Bienvendo!");
                window.location.href = "vistaRec.html";
              } else if(dataUsr2.datos.estatus=="No activo"){
                alert("Ya lo dimos de baja don");
              }else{
                alert("Y ute kiene¿");
              }
            }
          } catch (err) {
            console.error("Error en la solicitud del usuario2:", err);
            alert("Error al consultar el usuario2.");
            return;
          }
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

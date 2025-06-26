 document.addEventListener("DOMContentLoaded", async () => {
    const idUser = sessionStorage.getItem("idUsuario");
    if (!idUser) {
      alert("No hay sesión iniciada.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/datosRec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser: parseInt(idUser) }),
      });

      const datos = await res.json();

      // Llena los campos de la página
      const nombreCompleto = `${datos.nom} ${datos.apPat} ${datos.apMat}`;
      document.getElementById("nombre").textContent = nombreCompleto;
      document.getElementById("rfc").textContent = datos.rfc;
      document.getElementById("usuario").textContent = datos.nomUser;
      document.getElementById("contra").textContent = datos.contra;
      document.getElementById("telefono").textContent = datos.tel;
      document.getElementById("correo").textContent = datos.correo;
      document.getElementById("fechaNac").textContent = new Date(datos.fechaNac).toLocaleDateString();
      document.getElementById("turno").textContent = datos.turno;
      document.getElementById("dias").textContent = datos.dias;
      document.getElementById("entrada").textContent = datos.horaEnt;
      document.getElementById("salida").textContent = datos.horaSal;
      document.getElementById("salario").textContent = `$${parseFloat(datos.salario).toLocaleString("es-MX", { style: "decimal", minimumFractionDigits: 2 })} MXN`;
    //   document.getElementById("estatus").textContent = datos.estatus;

    } catch (err) {
      console.error("Error al obtener los datos de la recepcionista:", err);
      alert("No se pudieron cargar los datos.");
    }
  });
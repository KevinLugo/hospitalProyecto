document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa.");
    return;
  }

  let cedula;
  try {
    const res = await fetch("http://localhost:5000/api/cedula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: parseInt(idUsuario) })
    });
    const data = await res.json();
    cedula = data[0]?.cedula;
  } catch (err) {
    console.error("Error al obtener la cédula:", err);
    return;
  }

  const buscador = document.getElementById("buscador");
  const tbody = document.querySelector("#tablaBitacora tbody");

  async function cargarBitacora(payload, endpoint) {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const datos = await res.json();

      tbody.innerHTML = "";
      if (!datos || datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10">No se encontraron registros</td></tr>`;
        return;
      }

      datos.forEach(r => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${r.nomP} ${r.apPatP} ${r.apMatP}</td>
          <td>${r.nomD} ${r.apPatD} ${r.apMatD}</td>
          <td>${r.esp}</td>
          <td>${r.fechaCita?.split("T")[0]}</td>
          <td>${r.horaCita}</td>
          <td>${r.diag}</td>
          <td>${r.med}</td>
          <td>${r.dosis}</td>
          <td>${r.intervalo}</td>
          <td>${r.observ}</td>
        `;
        tbody.appendChild(fila);
      });
    } catch (err) {
      console.error("Error al cargar bitácora:", err);
    }
  }

  if (cedula) cargarBitacora({ cedula: parseInt(cedula) }, "bitacora");

  buscador.addEventListener("input", () => {
    const texto = buscador.value.trim();
    if (texto === "") {
        cargarBitacora({ cedula: parseInt(cedula) }, "bitacora");
    } else {
        cargarBitacora({ cedula: parseInt(cedula), nombre: texto }, "bitacora2");
    }
});
});

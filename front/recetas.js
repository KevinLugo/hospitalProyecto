document.addEventListener("DOMContentLoaded", async () =>  {
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    return;
  }


  // Paso 1: Obtener cédula
  let cedula;
  try {
    const ced = await fetch("http://localhost:5000/api/cedula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: parseInt(idUsuario) }),
    });
    const cedulaObj = await ced.json();
    cedula = cedulaObj[0]?.cedula;
    console.log("Cédula:", cedula);
  } catch (err) {
    console.error("Error al obtener cédula:", err);
    alert("No se pudo obtener la cédula.");
    return;
  }
  const buscador = document.getElementById("buscador");
  const tbody = document.querySelector("#tablaRecetas tbody");

  async function cargarRecetas(data, endpoint) {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const recetas = await res.json();

      tbody.innerHTML = ""; // Limpiar tabla

      if (!recetas || recetas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No se encontraron recetas</td></tr>`;
        return;
      }

      recetas.forEach(r => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${r.nom} ${r.apPat} ${r.apMat}</td>
            <td>${r.diag}</td>
            <td>${r.med}</td>
            <td>${r.dosis}</td>
            <td>${r.intervalo}</td>
            <td>${r.fechaRe.split("T")[0]}</td>
            <td>${r.observ}</td>
        `;
  tbody.appendChild(fila);
});

    } catch (err) {
      console.error("Error al cargar recetas:", err);
    }
  }

  // Cargar recetas inicialmente con la cédula
  if (cedula) cargarRecetas({ cedula: parseInt(cedula) }, "recetas");

  // Evento del buscador
  buscador.addEventListener("input", () => {
  const texto = buscador.value.trim();
  if (texto === "") {
    cargarRecetas({ cedula: parseInt(cedula) }, "recetas");
  } else {
    cargarRecetas({ cedula: parseInt(cedula), nombre: texto }, "recetas2");
  }
});
});

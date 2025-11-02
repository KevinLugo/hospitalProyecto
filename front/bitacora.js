document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesion activa");
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
    console.error("Error al obtener la cedula:", err);
    return;
  }

  const buscador = document.getElementById("buscador");
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);

  async function cargarBitacora(payload, endpoint) {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const datos = await res.json();

      contenedor.innerHTML = "";
      if (!datos || datos.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center;">No se encontraron registros</p>`;
        return;
      }

      //agrupa por idCita
      const grupos = {};
      datos.forEach(r => {
        if (!grupos[r.idCita]) grupos[r.idCita] = [];
        grupos[r.idCita].push(r);
      });

      //crea una tarjeta por agrupasion
      Object.keys(grupos).forEach(idCita => {
        const grupo = grupos[idCita];
        const r0 = grupo[0];
        const fecha = r0.fechaCita ? r0.fechaCita.split("T")[0] : "Sin fecha";

        const div = document.createElement("div");
        div.classList.add("bitacora-card");
        div.style.border = "2px solid #888";
        div.style.borderRadius = "10px";
        div.style.padding = "15px";
        div.style.margin = "20px 0";
        div.style.background = "#f9f9f9";

        div.innerHTML = `
          <h3>Paciente: ${r0.nomP ?? ""} ${r0.apPatP ?? ""} ${r0.apMatP ?? ""}</h3>
          <p><strong>Doctor:</strong> ${r0.nomD ?? ""} ${r0.apPatD ?? ""} ${r0.apMatD ?? ""}</p>
          <p><strong>Especialidad:</strong> ${r0.esp ?? ""}</p>
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p><strong>Hora:</strong> ${r0.horaCita ?? ""}</p>
          <p><strong>Diagnostico:</strong> ${r0.diag ?? "Sin diagnostico"}</p>
        `;

        //crea la tabla de medicamentos de la cita
        const tabla = document.createElement("table");
        tabla.style.width = "100%";
        tabla.style.borderCollapse = "collapse";
        tabla.style.marginTop = "10px";
        tabla.border = "1";

        tabla.innerHTML = `
          <thead>
            <tr style="background:#ddd;">
              <th>Medicamento</th>
              <th>Dosis</th>
              <th>Intervalo</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${grupo.map(f => `
              <tr>
                <td>${f.med ?? ""}</td>
                <td>${f.dosis ?? ""}</td>
                <td>${f.intervalo ?? ""}</td>
                <td>${f.observ ?? ""}</td>
              </tr>
            `).join("")}
          </tbody>
        `;

        div.appendChild(tabla);
        contenedor.appendChild(div);
      });

    } catch (err) {
      console.error("Error al cargar bitacora:", err);
    }
  }

  //karga la bitakora
  if (cedula) cargarBitacora({ cedula: parseInt(cedula) }, "bitacora");

  //buskeda de bitakoras
  buscador.addEventListener("input", () => {
    const texto = buscador.value.trim();
    if (texto === "") {
      cargarBitacora({ cedula: parseInt(cedula) }, "bitacora");
    } else {
      cargarBitacora({ cedula: parseInt(cedula), nombre: texto }, "bitacora2");
    }
  });
});

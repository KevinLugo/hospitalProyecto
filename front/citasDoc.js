document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    return;
  }

  const tbody = document.querySelector("#tablaCitas tbody");

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

  // Paso 2: Cargar citas (ya con cedula lista)
  const radios = document.getElementsByName("filtroHora");
  radios.forEach(r => r.addEventListener("change", cargarCitas));
  await cargarCitas();

  async function cargarCitas() {
    try {
      const filtroHora = document.querySelector('input[name="filtroHora"]:checked').value;

      const res = await fetch("http://localhost:5000/api/citasDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: parseInt(cedula) }),
      });

      const citas = await res.json();
      tbody.innerHTML = "";

      if (!citas || citas.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="9" style="text-align:center;font-weight:bold;">No tiene citas agendadas</td>`;
        tbody.appendChild(fila);
        return;
      }

      citas.forEach(cita => {
        const fila = document.createElement("tr");
        let habilitado = true;
        if (filtroHora === "si") {
          habilitado = estaEnHora(cita.fechaC, cita.horaCita);
        }

        fila.innerHTML = `
          <td>${cita.nom}</td>
          <td>${cita.apPat}</td>
          <td>${cita.apMat}</td>
          <td>${soloFecha(cita.fechaR)}</td>
          <td>${cita.statCita}</td>
          <td>${cita.horaCita}</td>
          <td>${cita.esp}</td>
          <td><button class="btn-atender" data-idcita="${cita.idCita}" ${!habilitado ? "disabled" : ""}>Atender</button></td>
        `;
        tbody.appendChild(fila);
      });
    } catch (err) {
      console.error("Error al cargar citas:", err);
      alert("Hubo un problema al cargar las citas.");
    }
  }

  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-atender")) {
      const idCita = e.target.dataset.idcita;
      window.location.href = `atender.html?idCita=${idCita}`;
    }
  });
});

function estaEnHora(fechaCita, horaRango) {
  const hoy = new Date();
  const fecha = new Date(fechaCita + "T00:00:00");

  // La cita debe ser hoy
  if (
    hoy.getFullYear() !== fecha.getFullYear() ||
    hoy.getMonth() !== fecha.getMonth() ||
    hoy.getDate() !== fecha.getDate()
  ) {
    return false;
  }

  const [inicioStr, finStr] = horaRango.split("-").map(s => s.trim());
  const [h1, m1] = inicioStr.split(":").map(Number);
  const [h2, m2] = finStr.split(":").map(Number);

  const inicio = new Date(fecha);
  inicio.setHours(h1, m1, 0, 0);

  const fin = new Date(fecha);
  fin.setHours(h2, m2, 0, 0);

  const ahora = new Date();
  return ahora >= inicio && ahora <= fin;
}

//fechaChida
function soloFecha(fecha) {
  return fecha.split("T")[0].split("-").reverse().join("/");
}
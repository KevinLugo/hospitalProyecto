(async function () {
  let idPac;
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    throw new Error("idUsuario no está definido");
  }

  try {
    const datoPac = await fetch("http://localhost:5000/api/idPac", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: idUsuario }),
    });

    const dataId = await datoPac.json();
    idPac = dataId.idPac;
  } catch (err) {
    console.error("no obtuvimos idPac:", err);
    alert("Error al consultar la id del paciente.");
    return;
  }

  try {
    const dataCita = await fetch("http://localhost:5000/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPac: idPac }),
    });

    const datosCita = await dataCita.json();
    console.log("Datos recibidos:", datosCita);

    const tabla = document
      .getElementById("tablaCitas")
      .getElementsByTagName("tbody")[0];
    tabla.innerHTML = "";

    datosCita.forEach((cita) => {
      const fila = document.createElement("tr");
      fila.setAttribute("data-idCita", cita.idCita);
      fila.setAttribute("data-idPago", cita.idPago);
      let metodoPagoHTML = "";

      if (cita.statCita === "Agendada pendiente de pago") {
        metodoPagoHTML = `<button class="btn-pagar" data-idpago="${cita.idPago}">Pagar</button>`;
      } else if (cita.formaPago === "debito") {
        metodoPagoHTML = `<span>Pagó con débito</span>`;
      } else if (cita.formaPago === "credito") {
        metodoPagoHTML = `<span>Pagó con crédito</span>`;
      } else {
        metodoPagoHTML = `<span>${cita.statCita}</span>`;
      }

      // Botón cancelar (opcional: solo si está pendiente)
      let botonCancelarHTML = "";
      if (
        cita.statCita === "Agendada pendiente de pago" ||
        cita.statCita === "Pagada pendiente por atender"
      ) {
        botonCancelarHTML = `<button class="btn-cancelar">Cancelar Cita</button>`;
      } else {
        botonCancelarHTML = `<span>${cita.statCita}</span>`;
      }

      fila.innerHTML = `
        <td>${cita.statCita}</td>
        <td>${soloFecha(cita.fechaC)}</td>         <!-- Fecha de la cita -->
        <td>${soloFecha(cita.fechaR)}</td>         <!-- Fecha de creación -->
        <td>${cita.horaCita}</td>
        <td>${cita.nom} ${cita.apPat} ${cita.apMat}</td>
        <td>${cita.esp}</td>
        <td>${cita.noCon}</td>
        <td>${cita.planta}</td>
        <td>${cita.statPago}</td>
        <td>${cita.monto}</td>
        <td>${fechaConHora(cita.limPago)}</td>     <!-- Fecha límite con hora -->
        <td>${metodoPagoHTML}</td>
        <td>${botonCancelarHTML}</td>
      `;

      tabla.appendChild(fila);
    });
  } catch (err) {
    console.error("Error en la solicitud:", err);
    alert("Error al consultar los datos del paciente.");
  }
  // Delegar evento para los botones de pago
  tabla.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnPago")) {
      const metodo = e.target.dataset.metodo;
      const fila = e.target.closest("tr");
      fila.setAttribute("data-idPago", cita.idPago);
      console.log("Método de pago seleccionado:", metodo);
      // Aquí puedes extraer más datos de la fila si necesitas hacer una petición
    }

    if (e.target.classList.contains("btnCancelar")) {
      const fila = e.target.closest("tr");
      console.log("Cita a cancelar:", fila);
      // Aquí puedes extraer identificadores y hacer una solicitud para cancelar
    }
  });
})();

//cancela la cita y le apliko politika d cancelacion
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-cancelar")) {
    const fila = e.target.closest("tr");
    const idCita = fila.getAttribute("data-idCita");

    if (!idCita) {
      console.error("No se encontró idCita en la fila.");
      alert("Error interno al cancelar la cita.");
      return;
    }

    const confirmar = confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      const fechaTexto = fila.children[2].textContent; // <td>fechaR</td>
      const horaTexto = fila.children[3]?.textContent?.trim();

      // Permite "15:00-16:00" o "15:00 - 16:00" o incluso "15:00   -    16:00"
      const partesHora = horaTexto.split(/\s*-\s*/);

      if (partesHora.length !== 2) {
        alert("Error: La hora de la cita no está bien definida.");
        console.error("Hora inválida:", horaTexto);
        return;
      }

      const [horaInicio, horaFin] = partesHora;

      const fechaBase = new Date(fechaTexto);
      const [hIni, mIni] = horaInicio.split(":").map(Number);
      const [hFin, mFin] = horaFin.split(":").map(Number);

      const inicio = new Date(fechaBase);
      inicio.setHours(hIni, mIni, 0, 0);

      const fin = new Date(fechaBase);
      fin.setHours(hFin, mFin, 0, 0);

      const ahora = new Date();

      // Bloquear si ya está dentro del rango de la cita
      if (ahora >= inicio && ahora <= fin) {
        alert("No puedes cancelar la cita porque ya está en curso.");
        return;
      }

      // Política de cancelación
      const horasDiferencia = (inicio - ahora) / (1000 * 60 * 60);
      let mensaje = "";
      let nuevoEstado = "";

      if (horasDiferencia >= 48) {
        nuevoEstado = "Cancelada paciente 48h";
        mensaje = "Se le aplica política de cancelación de 48h. Le regresamos el 100% de su dinero.";
      } else if (horasDiferencia >= 24) {
        nuevoEstado = "Cancelada paciente 24h";
        mensaje = "Se le aplica política de cancelación de 24h. Le regresamos el 50% de su dinero.";
      } else {
        nuevoEstado = "Cancelada paciente <24h";
        mensaje = "Se le aplica política de cancelación de menos de 24h. No le regresaremos el dinero.";
      }

      // Enviar a backend
      const res = await fetch("http://localhost:5000/api/canCitaP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCita: parseInt(idCita), nuevoEstado }),
      });

      const data = await res.json();
      alert(`${mensaje}\n\n${data.mensaje}`);
      location.reload();

    } catch (err) {
      console.error("Error al cancelar la cita:", err);
      alert("Ocurrió un error al cancelar la cita.");
    }
  }
});


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("boton1").addEventListener("click", function () {
    window.location.href = "vistaPac.html";
  });
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-pagar")) {
    const idPago = e.target.dataset.idpago;
    sessionStorage.setItem("idPago", idPago);
    window.location.href = "pago.html";
  }
});
//fechaChida
function soloFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

//fechaChida2
function fechaConHora(fecha) {
  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
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

      if (cita.formaPago === "No seleccionada") {
        metodoPagoHTML = `
      <button class="btn-debito">Débito</button>
      <button class="btn-credito">Crédito</button>
    `;
      } else if (cita.formaPago === "debito") {
        metodoPagoHTML = `<span>Pagó con débito</span>`;
      } else if (cita.formaPago === "credito") {
        metodoPagoHTML = `<span>Pagó con crédito</span>`;
      } else {
        metodoPagoHTML = `<span>Forma de pago: ${cita.formaPago}</span>`;
      }

      // Botón cancelar (opcional: solo si está pendiente)
      const botonCancelarHTML =
        cita.statCita === "Agendada pendiente de pago" ||
        cita.statPago === "Pagada pendiente por atender"
          ? `<button class="btn-cancelar">Cancelar Cita</button>`
          : "";

      fila.innerHTML = `
    <td>${cita.statCita}</td>
    <td>${cita.fechaC}</td>
    <td>${cita.fechaR}</td>
    <td>${cita.horaCita}</td>
    <td>${cita.nom} ${cita.apPat} ${cita.apMat}</td>
    <td>${cita.nomEsp}</td>
    <td>${cita.noCon}</td>
    <td>${cita.planta}</td>
    <td>${cita.statPago}</td>
    <td>${cita.monto}</td>
    <td>${cita.limPago}</td>
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

document.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("btn-debito") ||
    e.target.classList.contains("btn-credito")
  ) {
    const formaPago = e.target.classList.contains("btn-debito")
      ? "debito"
      : "credito";

    // Obtener el idPago desde alguna parte de la fila (ajusta esto según tu estructura)
    const fila = e.target.closest("tr");
    const idPago = fila.getAttribute("data-idPago"); // Asegúrate de poner data-idPago en <tr>

    try {
      const res = await fetch("http://localhost:5000/api/formaPago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPago: parseInt(idPago), formaPago }),
      });

      const data = await res.json();
      alert(data.mensaje);
      location.reload(); // recarga para actualizar la tabla
    } catch (err) {
      console.error("Error al actualizar forma de pago:", err);
      alert("Ocurrió un error al registrar la forma de pago.");
    }
  }
});

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
      const res = await fetch("http://localhost:5000/api/canCitaP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCita: parseInt(idCita) })
      });

      const data = await res.json();
      alert(data.mensaje);
      location.reload(); // recargar tabla
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

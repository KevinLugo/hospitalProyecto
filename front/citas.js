//bariable global
let tipoUsrAc = sessionStorage.getItem("tipoUs");

(async function () {
  let idPac;
  let idUsuario;
  //aca obtuve la id desde el login o desde la tabla de usuarios
  if(tipoUsrAc=="Paciente") {
    idUsuario = sessionStorage.getItem("idUsuario");
  } else if(tipoUsrAc=="Empleado" || tipoUsrAc=="Admin"){
    idUsuario = sessionStorage.getItem("idUsuario2");
  }
  if (!idUsuario) {
      alert("No hay sesion activa. Por favor inicia sesion");
      throw new Error("idUsuario no esta definido");
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
    alert("Error al consultar la id del paciente");
    return;
  }

  try {
    const dataCita = await fetch("http://localhost:5000/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPac: idPac }),
    });

    const datosCita = await dataCita.json();
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
        metodoPagoHTML = `<span>Pago con debito</span>`;
      } else if (cita.formaPago === "credito") {
        metodoPagoHTML = `<span>Pago con credito</span>`;
      } else {
        metodoPagoHTML = `<span>${cita.statCita}</span>`;
      }

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
        <td>${soloFecha(cita.fechaC)}</td>
        <td>${soloFecha(cita.fechaR)}</td>
        <td>${cita.horaCita}</td>
        <td>${cita.nom} ${cita.apPat} ${cita.apMat}</td>
        <td>${cita.esp}</td>
        <td>${cita.noCon}</td>
        <td>${cita.planta}</td>
        <td>${cita.statPago}</td>
        <td>${cita.monto}</td>
        <td>${fechaConHora(cita.limPago)}</td>
        <td>${metodoPagoHTML}</td>
        <td>${botonCancelarHTML}</td>
      `;

      tabla.appendChild(fila);
    });
    tabla.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-pagar")) {
        const idPago = e.target.dataset.idpago;
        sessionStorage.setItem("idPago", idPago);
        window.location.href = "pago.html";
      }
    });
  } catch (err) {
    console.error("Error en la solicitud:", err);
    alert("Error al consultar las citas del paciente");
  }
})();


//cancela la cita y le apliko politika d cancelacion
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-cancelar")) {
    const fila = e.target.closest("tr");
    const idCita = fila.getAttribute("data-idCita");

    if (!idCita) {
      console.error("No se encontro idCita en la fila.");
      alert("Error interno al cancelar la cita.");
      return;
    }

    const confirmar = confirm("¿Estas seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      const fechaTexto = fila.children[2].textContent;
      const horaTexto = fila.children[3]?.textContent?.trim();

      //separa la ora si la tengo como por ejemplo 15:30-16:30
      const partesHora = horaTexto.split(/\s*-\s*/);

      if (partesHora.length !== 2) {
        alert("Error: La hora de la cita no esta bien definida.");
        console.error("Hora invalida:", horaTexto);
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

      //bloquea si ya esta en la cita
      if (ahora >= inicio && ahora <= fin) {
        alert("No puedes cancelar la cita porque ya esta en curso.");
        return;
      }

      //politika de cancelacion
      const horasDiferencia = (inicio - ahora) / (1000 * 60 * 60);
      let mensaje = "";
      let nuevoEstado = "";

      if (horasDiferencia >= 48) {
        nuevoEstado = "Cancelada paciente 48h";
        mensaje = "Se le aplica politica de cancelacion de 48h. Le regresamos el 100% de su dinero.";
      } else if (horasDiferencia >= 24) {
        nuevoEstado = "Cancelada paciente 24h";
        mensaje = "Se le aplica politica de cancelacion de 24h. Le regresamos el 50% de su dinero.";
      } else {
        nuevoEstado = "Cancelada paciente <24h";
        mensaje = "Se le aplica politica de cancelacion de menos de 24h. No le regresaremos el dinero.";
      }

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
      alert("Ocurrio un error al cancelar la cita.");
    }
  }
});


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("boton1").addEventListener("click", (e) => {
      e.preventDefault();//es para k el a no haga su funcion normal
      if (tipoUsrAc=="Paciente") {
      window.location.href = "vistaPac.html";
    } else if(tipoUsrAc=="Empleado" || tipoUsrAc=="Admin"){
      window.location.href = "citasRec.html";
    }
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
  return fecha.split("T")[0].split("-").reverse().join("/");
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
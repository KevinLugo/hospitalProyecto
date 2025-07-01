document.addEventListener("DOMContentLoaded", async () => {
  const idPago = sessionStorage.getItem("idPago");
  if (!idPago) {
    alert("No se encontró el pago. Redirigiendo...");
    window.location.href = "menuCitas.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/infoPagoCita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPago: parseInt(idPago) }),
    });

    const data = (await res.json())[0]; // Recordset es un array, tomamos el primero

    document.getElementById("especialidad").textContent = data.esp;
    document.getElementById("doctor").textContent = `Dr. ${data.nom} ${data.apPat} ${data.apMat}`;
    document.getElementById("fechaCita").textContent = formatearSoloFecha(data.fechaR);
    document.getElementById("horaCita").textContent = data.horaCita;
    document.getElementById("precio").textContent = `$${data.monto} MXN`;
    document.getElementById("limitePago").textContent = formatearFecha(data.limPago);
    document.getElementById("estatus").textContent = data.statPago;
  } catch (err) {
    console.error("Error al cargar info del pago:", err);
    alert("No se pudo obtener la información del pago.");
  }

  document.getElementById("btnPagar").addEventListener("click", async () => {
    const formaPago = document.getElementById("formaPago").value;
    if (!formaPago) {
      alert("Selecciona una forma de pago.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/formaPago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPago: parseInt(idPago), formaPago }),
      });

      const result = await res.json();
    } catch (err) {
      console.error("Error al registrar pago:", err);
      alert("Ocurrió un error al procesar el pago.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/pagoCita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPago: parseInt(idPago) }),
      });

      const result = await res.json();
      alert(result.mensaje || "Pago registrado correctamente.");
      window.location.href = "citas.html";
    } catch (err) {
      console.error("Error al registrar pago:", err);
      alert("Ocurrió un error al procesar el pago.");
    }
  });
});

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false //puedo cambiar a true si prefiero formato 12h con AM/PM
  });
}

//fecha para la fecha
function formatearSoloFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

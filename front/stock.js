//valido caracteres  del nombre, nombre del seguro, y alergias
function valido(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  // Permitir letras, acentos, ñ, etc.
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  // También permitimos códigos ASCII específicos:
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}
//yatusae
document.getElementById("busqueda").addEventListener("keypress", valido);

//nosabes yonemoz
document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tablaMed tbody");
  const inputBuscar = document.getElementById("busqueda");
  const btnBuscar = document.getElementById("btnBuscar");

  // Al cargar la página, mostrar todos los medicamentos
  cargarTodosLosMedicamentos();

  // Búsqueda por nombre
  btnBuscar.addEventListener("click", async () => {
    const nombre = inputBuscar.value.trim();

    if (!nombre) {
      alert("Escribe un nombre para buscar.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/med2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomMed: nombre })
      });

      const data = await res.json();
      mostrarTabla(data);
    } catch (err) {
      console.error("Error al buscar medicamento:", err);
      alert("Error al buscar medicamentos.");
    }
  });

  // Función para cargar todos los medicamentos
  async function cargarTodosLosMedicamentos() {
    try {
      const res = await fetch("http://localhost:5000/api/med");
      const data = await res.json();
      mostrarTabla(data);
    } catch (err) {
      console.error("Error al cargar medicamentos:", err);
      alert("Error al cargar todos los medicamentos.");
    }
  }

  // Mostrar medicamentos en la tabla
  function mostrarTabla(meds) {
    tabla.innerHTML = "";

    if (!Array.isArray(meds) || meds.length === 0) {
      tabla.innerHTML = `<tr><td colspan="6">No se encontraron medicamentos.</td></tr>`;
      return;
    }

    meds.forEach((med) => {
      const fila = document.createElement("tr");

      // Convertimos la fecha de caducidad al formato YYYY-MM-DD
      const fechaCad = new Date(med.feCad);
      const fechaFormateada = fechaCad.toISOString().split("T")[0];

      fila.innerHTML = `
        <td>${med.idMed}</td>
        <td>${med.nomMed}</td>
        <td>${fechaFormateada}</td>
        <td>${med.stock}</td>
        <td>${med.descMed}</td>
        <td>$${med.precioMed.toFixed(2)}</td>
      `;
      tabla.appendChild(fila);
    });
  }
});

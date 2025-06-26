//para k no agarre mas de lo k no ai
const contadorMed = {};

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
document.getElementById("busquedaMed").addEventListener("keypress", valido);

let totalVenta = 0;

// Cargar servicios y todos los medicamentos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await cargarServicios();
  await cargarMedicamentos(); // Carga todo

  document.getElementById("busquedaMed").addEventListener("input", async (e) => {
    const texto = e.target.value.trim();
    if (texto === "") {
      await cargarMedicamentos(); // Muestra todos
    } else {
      await buscarMedicamentos(texto);
    }
  });
});

// Cargar todos los medicamentos
async function cargarMedicamentos() {
  try {
    const res = await fetch("http://localhost:5000/api/med");
    const datos = await res.json();
    llenarSelectMedicamentos(datos);
  } catch (err) {
    console.error("Error cargando medicamentos:", err);
  }
}

// Buscar medicamentos por texto
async function buscarMedicamentos(texto) {
  try {
    const res = await fetch("http://localhost:5000/api/med2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomMed: texto })
    });
    const datos = await res.json();
    llenarSelectMedicamentos(datos);
  } catch (err) {
    console.error("Error buscando medicamentos:", err);
  }
}

// Rellenar el select con medicamentos
function llenarSelectMedicamentos(medicamentos) {
  const select = document.getElementById("listaMedicamentos");
  select.innerHTML = "";

  medicamentos.forEach(med => {
    // Verifica que el stock sea mayor que 0
    const option = document.createElement("option");
    option.value = parseInt(med.idMed);
    option.textContent = `${med.nomMed} - $${parseFloat(med.precioMed).toFixed(2)} (Stock: ${med.stock})`;
    option.dataset.precio = med.precioMed;
    option.dataset.nombre = med.nomMed;
    option.dataset.tipo = "Medicamento";
    option.dataset.stock = med.stock;

    if (parseInt(med.stock) === 0) {
      option.disabled = true;
      option.textContent += " [Sin stock]";
    }

    select.appendChild(option);
  });
}

async function cargarServicios() {
  const res = await fetch("http://localhost:5000/api/servicios");
  const datos = await res.json();
  const lista = document.getElementById("listaServicios");
  datos.forEach(serv => {
    const option = document.createElement("option");
    option.value = serv.idServ;
    option.textContent = `${serv.nomServ} - $${serv.precio}`;
    option.dataset.precio = serv.precio;
    option.dataset.nombre = serv.nomServ;
    lista.appendChild(option);
  });
}

function agregarServicio() {
  const lista = document.getElementById("listaServicios");
  const option = lista.options[lista.selectedIndex];
  const idServ = option.value;
  const nombre = option.dataset.nombre;
  const precio = parseFloat(option.dataset.precio);

  venta.push({ tipo: "Servicio", id: idServ, nombre, precio });

  agregarFila("Servicio", nombre, precio);
}

function agregarFila(tipo, nombre, precio) {
  const tabla = document.getElementById("tablaVenta");
  const fila = document.createElement("tr");
  
    fila.innerHTML = `
    <td>${tipo}</td>
    <td>${nombre}</td>
    <td>$${precio}</td>
    <td><button class="eliminar">Eliminar</button></td>
  `;
  fila.querySelector(".eliminar").addEventListener("click", () => {
    const index = Array.from(tabla.children).indexOf(fila);
    venta.splice(index, 1);
    fila.remove();
    calcularTotal();
  });

  tabla.appendChild(fila);
  calcularTotal();
}

// Agregar medicamento
document.getElementById("agregarMed").addEventListener("click", () => {
  const select = document.getElementById("listaMedicamentos");
  const option = select.options[select.selectedIndex];

  if (!option) return;

  const idMed = option.value;
  const nombre = option.dataset.nombre;
  const precio = option.dataset.precio;
  const stock = parseInt(option.dataset.stock);

  // Verificar cuántos ya se han agregado
  const yaAgregados = contadorMed[idMed] || 0;

  if (yaAgregados >= stock) {
    alert(`⚠ Ya se ha agregado el máximo disponible de ${nombre} (Stock: ${stock}).`);
    return;
  }

  // Agregar medicamento a la tabla
  agregarAFila("Medicamento", nombre, precio);

  // Incrementar el contador
  contadorMed[idMed] = yaAgregados + 1;
});

// Agregar servicio
document.getElementById("agregarServ").addEventListener("click", () => {
  const select = document.getElementById("listaServicios");
  const option = select.options[select.selectedIndex];
  if (option) {
    agregarAFila("Servicio", option.dataset.nombre, option.dataset.precio);
  }
});

// Agregar a la tabla de venta
function agregarAFila(tipo, nombre, precio) {
  const tbody = document.getElementById("tablaVenta");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${tipo}</td>
    <td>${nombre}</td>
    <td>$${parseFloat(precio).toFixed(2)}</td>
    <td><button class="btn-quitar">Quitar</button></td>
  `;

  tbody.appendChild(fila);
  actualizarTotal(precio);
}
// Quitar elemento
document.getElementById("tablaVenta").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-quitar")) {
    const fila = e.target.closest("tr");
    const tipo = fila.children[0].textContent;
    const nombre = fila.children[1].textContent;
    const precio = parseFloat(fila.children[2].textContent.replace("$", ""));
    fila.remove();
    actualizarTotal(-precio);

    // Si es medicamento, bajar el contador
    if (tipo === "Medicamento") {
      const opt = [...document.getElementById("listaMedicamentos").options]
        .find(o => o.dataset.nombre === nombre);
      if (opt) {
        const idMed = opt.value;
        contadorMed[idMed] = Math.max((contadorMed[idMed] || 1) - 1, 0);
      }
    }
  }
});


function actualizarTotal(cambio) {
  totalVenta += parseFloat(cambio);
  document.getElementById("total").textContent = totalVenta.toFixed(2);
}

document.getElementById("btnRegistrar").addEventListener("click", async () => {
  if (totalVenta === 0) {
    alert("No hay elementos para registrar.");
    return;
  }

  const confirmacion = confirm("¿Deseas registrar esta venta?");
  if (!confirmacion) return;

  const idUser = sessionStorage.getItem("idUsuario");
  if (!idUser) {
    alert("No hay sesión iniciada.");
    return;
  }

  try {
    // 1. Obtener ID de recepcionista
    const resRecep = await fetch("http://localhost:5000/api/idRecep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: parseInt(idUser) }),
    });
    const [{ idRecep }] = await resRecep.json();

    // 2. Obtener ID nuevo de ticket
    const resTicketId = await fetch("http://localhost:5000/api/sigTicketId");
    const { sigIdTicket } = await resTicketId.json();

    // 3. Registrar ticket
    const hoy = new Date().toISOString().split("T")[0];
    await fetch("http://localhost:5000/api/regTicket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idTicket: sigIdTicket,
        idRecep,
        fechaTicket: hoy,
        total: totalVenta,
      }),
    });

    // 4. Obtener ID base para detTicket
    const resDT = await fetch("http://localhost:5000/api/sigDTicketId");
    let { sigIdDTicket } = await resDT.json();

    const filas = document.querySelectorAll("#tablaVenta tr");
    for (const fila of filas) {
      const tipo = fila.children[0].textContent;
      const nombre = fila.children[1].textContent;
      const precio = parseFloat(fila.children[2].textContent.replace("$", ""));

      let idMed = null;
      let idServ = null;
      let noMed = 0;
      let noServ = 0;

      if (tipo === "Medicamento") {
        const opt = [...document.getElementById("listaMedicamentos").options]
            .find(o => o.dataset.nombre === nombre);
        if (!opt) continue;

        idMed = parseInt(opt.value);
        noMed = 1;
        console.log("Intentando restar medicamento:", { idMed, noMed });

        if (!Number.isInteger(idMed) || idMed <= 0) {
        console.error("❌ ID de medicamento inválido:", idMed);
        continue;
        }
        // ✅ Validación extra aquí:
        if (!isNaN(idMed) && idMed > 0) {
            await fetch("http://localhost:5000/api/menosMed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idMed, noMed }),
            });
        }
        } else if (tipo === "Servicio") {
        const opt = [...document.getElementById("listaServicios").options]
          .find(o => o.dataset.nombre === nombre);
        if (!opt) continue;

        idServ = parseInt(opt.value);
        noServ = 1;
      }

      // Insertar en detTicket
      await fetch("http://localhost:5000/api/regDTicket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDTicket: sigIdDTicket++,
          idTicket: sigIdTicket,
          noServ,
          noMed,
          subtotal: precio,
          idServ,
          idMed,
        }),
      });
    }

    alert("Venta registrada correctamente.");
    document.getElementById("btnCobrar").style.display = "inline-block";
  } catch (err) {
    console.error("Error en registro de venta:", err);
    alert("Ocurrió un error al registrar la venta.");
  }
});

document.getElementById("btnCobrar").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/sigPagoTId");
    const { sigIdPagoT } = await res.json();

    const res2 = await fetch("http://localhost:5000/api/sigTicketId");
    const { sigIdTicket } = await res2.json();
    const idTicket = sigIdTicket - 1;

    const hoy = new Date().toISOString().split("T")[0];

    await fetch("http://localhost:5000/api/regPagoT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPagoT: sigIdPagoT,
        idTicket,
        fechaPago: hoy,
        montoT: totalVenta
      }),
    });

    alert("Pago registrado correctamente.");
    location.reload();
  } catch (err) {
    console.error("Error al cobrar:", err);
    alert("Ocurrió un error al procesar el pago.");
  }
});

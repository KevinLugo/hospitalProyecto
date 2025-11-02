//para k no agarre mas de lo k no ai
const contadorMed = {};

//valido caracteres  del nombre, nombre del seguro, y alergias
function valido(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  //ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}
//yatusae
document.getElementById("busquedaMed").addEventListener("keypress", valido);

let totalVenta = 0;

//kargar med y serbisios
document.addEventListener("DOMContentLoaded", async () => {
  await cargarServicios();
  await cargarMedicamentos();

  //buska dependiendo del testo
  document.getElementById("busquedaMed").addEventListener("input", async (e) => {
    const texto = e.target.value.trim();
    if (texto === "") {
      await cargarMedicamentos();
    } else {
      await buscarMedicamentos(texto);
    }
  });
});

//medikamentos
async function cargarMedicamentos() {
  try {
    const res = await fetch("http://localhost:5000/api/med");
    const datos = await res.json();
    llenarSelectMedicamentos(datos);
  } catch (err) {
    console.error("Error cargando medicamentos:", err);
  }
}

//medicamentos por testo
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

//reyena el selec con medicamentos
function llenarSelectMedicamentos(medicamentos) {
  const select = document.getElementById("listaMedicamentos");
  select.innerHTML = "";

  medicamentos.forEach(med => {
    //checka k el stock sea mayor a 0
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

//agrega medisina
document.getElementById("agregarMed").addEventListener("click", () => {
  const select = document.getElementById("listaMedicamentos");
  const option = select.options[select.selectedIndex];

  if (!option) return;

  const idMed = option.value;
  const nombre = option.dataset.nombre;
  const precio = option.dataset.precio;
  const stock = parseInt(option.dataset.stock);

  const yaAgregados = contadorMed[idMed] || 0;

  if (yaAgregados >= stock) {
    alert(`Ya se ha agregado el maximo disponible de ${nombre} (Stock: ${stock}).`);
    return;
  }

  //agrega medisina a la tabla
  agregarAFila("Medicamento", nombre, precio);
  contadorMed[idMed] = yaAgregados + 1;
});

//agrega serbisios
document.getElementById("agregarServ").addEventListener("click", () => {
  const select = document.getElementById("listaServicios");
  const option = select.options[select.selectedIndex];
  if (option) {
    agregarAFila("Servicio", option.dataset.nombre, option.dataset.precio);
  }
});

//agrega serbisios a la tabla
function agregarAFila(tipo, nombre, precio) {
  const tbody = document.getElementById("tablaVenta");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${tipo}</td>
    <td>${nombre}</td>
    <td>$${parseFloat(precio).toFixed(2)}</td>
    <td><button class="button">Quitar</button></td>
  `;

  tbody.appendChild(fila);
  actualizarTotal(precio);
}

document.getElementById("tablaVenta").addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    const fila = e.target.closest("tr");
    const tipo = fila.children[0].textContent;
    const nombre = fila.children[1].textContent;
    const precio = parseFloat(fila.children[2].textContent.replace("$", ""));
    fila.remove();
    actualizarTotal(-precio);
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
    alert("No hay elementos para registrar");
    return;
  }

  const confirmacion = confirm("¿Deseas registrar esta venta?");
  if (!confirmacion) return;

  const idUser = sessionStorage.getItem("idUsuario");
  if (!idUser) {
    alert("No hay sesion iniciada");
    return;
  }

  try {
    //obtiene id dela recep
    const resRecep = await fetch("http://localhost:5000/api/idRecep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: parseInt(idUser) }),
    });
    const [{ idRecep }] = await resRecep.json();

    //obtiene id del tiket
    const resTicketId = await fetch("http://localhost:5000/api/sigTicketId");
    const { sigIdTicket } = await resTicketId.json();

    //guarda el tiket
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

    //obtiene id del Dtiket
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

        if (!Number.isInteger(idMed) || idMed <= 0) {
        console.error("ID de medicamento invalido:", idMed);
        continue;
        }
        //balidasion estra
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

      //mete el Dtiket
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

    alert("Venta registrada correctamente");
    document.getElementById("btnCobrar").style.display = "inline-block";
  } catch (err) {
    console.error("Error en registro de venta:", err);
    alert("Ocurrio un error al registrar la venta");
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

    alert("Pago registrado correctamente");
    location.reload();
  } catch (err) {
    console.error("Error al cobrar:", err);
    alert("Ocurrio un error al procesar el pago");
  }
});
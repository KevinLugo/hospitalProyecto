//desactivo algunas listas para que tenga sentido la chanba
document.getElementById("doc").disabled = true;
document.getElementById("mes").disabled = true;
document.getElementById("hora").disabled = true;
document.getElementById("dia").disabled = true;
//un par de bariables globales para barias kositas
let idPacG = null;
let idDocG;
let minDia, minMes, maxDia, maxMes;
let fechaNo = [];

//paso los dias y mes minimos y maximos
function setFechas(d48, m48, d3, m3) {
  minDia = d48;
  minMes = m48;
  maxDia = d3;
  maxMes = m3;
}

//obtengo el id del paciente
(async function () {
  //aca obttuve la id desde el login
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesión activa. Por favor inicia sesión.");
    throw new Error("idUsuario no está definido");
  }

  //aca busco el id del pac
  try {
    const idPa = await fetch("http://localhost:5000/api/idPac", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: idUsuario }),
    });
    const idPac = await idPa.json();
    idPacG = idPac.idPac;
  } catch (err) {
    console.error("Error en la solicitud:", err);
    alert("Error al consultar los datos del pac.");
  }
})();

//pus aka namas el usuario selecciona especialidad y busca el nombre de los chanbiadores doktores
document.getElementById("esp").addEventListener("change", async function () {
  const especialidad = this.value;
  const select = document.getElementById("doc");
  select.innerHTML = "";
  if (!especialidad) {
    select.disabled = true;
    nop("mes");
    nop("dia");
    nop("hora");
    return;
  }

  try {
    //obtenemos nombre y id del doc
    const respDoc = await fetch("http://localhost:5000/api/nomDoc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ esp: especialidad }),
    });
    const docs = await respDoc.json();

    //pedimos ids de docs con cita que tenga el paciente
    const respNo = await fetch("http://localhost:5000/api/nopDoc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPac: idPacG }),
    });
    const noDocs = await respNo.json(); // array de objetos con propiedad `cedula`

    //convertimos cedulas a set nose porke para k les miento
    const noCedulas = new Set(noDocs.map((d) => d.cedula));

    //kitamos los docs que ya tengan cita con el paciente
    const docsOk = docs.filter((doc) => !noCedulas.has(doc.cedula));

    //resultados de la chanba
    if (docsOk.length > 0) {
      //ponemoz opsions para k no esplote
      const defult = document.createElement("option");
      defult.value = "";
      defult.textContent = "Opciones:";
      defult.disabled = true;
      defult.selected = true;
      select.appendChild(defult);
      //ingresamos doctores chidos
      docsOk.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.cedula;
        option.textContent = doc.nomComp;
        select.appendChild(option);
      });
      select.disabled = false;
    } else {
      //sino ai tedice k noai
      const defult = document.createElement("option");
      defult.value = "";
      defult.textContent = "No hay doctores disponibles";
      defult.disabled = true;
      defult.selected = true;
      select.appendChild(defult);
      select.disabled = true;
      //porsi hay algun chistosito
      nop("mes");
      nop("dia");
      nop("hora");
    }
  } catch (err) {
    console.error("Error al cargar a los docs:", err);
    const option = document.createElement("option");
    option.textContent = "Error al cargar doctorez";
    option.disabled = true;
    select.appendChild(option);
    select.disabled = true;
  }
});

//cuando el broder seleccione al doc agarra su cedula para buscar su horario y para luego el reg de la cita
document.getElementById("doc").addEventListener("change", async function () {
  const cedula = this.value;
  try {
    // 1. Obtener horario
    const response = await fetch("http://localhost:5000/api/horario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula }),
    });
    const data = await response.json();
    if (!data || data.length === 0) return;
    const horario = data[0];

    // 2. Obtener fechas ocupadas
    const respOcupado = await fetch("http://localhost:5000/api/nonoFecha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula }),
    });
    const ocupados = await respOcupado.json();

    // Guardamos fechaC y horaCita en una lista
    fechaNo = ocupados.map((cita) => ({
      fecha: cita.fechaR.split("T")[0], // YYYY-MM-DD
      hora: cita.horaCita,
    }));

    // 3. Llenar selects
    setFechas(horario.d48, horario.m48, horario.d3, horario.m3);
    setHora(horario.horaEnt, horario.horaSal);
    setMes(horario.m48, horario.m3);
  } catch (err) {
    console.error("Error al obtener horario o citas ocupadas:", err);
  }
});

//aca es para que cuando seleccione el mes le ponga los dias completos del mes
document.getElementById("mes").addEventListener("change", function () {
  const mesVal = parseInt(this.value); // el mes que eligió el usuario
  let diaInicio, diaFin;
  if (mesVal === minMes && mesVal === maxMes) {
    diaInicio = minDia;
    diaFin = maxDia;
  } else if (mesVal === minMes) {
    diaInicio = minDia;
    diaFin = diaMes(mesVal);
  } else if (mesVal === maxMes) {
    diaInicio = 1;
    diaFin = maxDia;
  } else {
    diaInicio = 1;
    diaFin = diaMes(mesVal);
  }
  //hace la funcion de que obtiene los dias del mes
  function diaMes(mes) {
    const year = new Date().getFullYear(); // ajusta si manejas otro año
    return new Date(year, mes, 0).getDate(); // mes 1-12, devuelve los días del mes
  }
  //manda a llamar la funcion dias y le pone los dias
  setDia(diaInicio, diaFin);
  document.getElementById("hora").disabled = false;
});

function setMes(mesInicio, mesFin) {
  const selectMes = document.getElementById("mes");
  selectMes.innerHTML = "";
  // agregamos opsiones para k no esplote
  const defult = document.createElement("option");
  defult.value = "";
  defult.textContent = "Opciones:";
  defult.disabled = true;
  defult.selected = true;
  selectMes.appendChild(defult);
  //for chido para meter meses
  for (let m = mesInicio; m <= mesFin; m++) {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = new Date(0, m - 1).toLocaleString("default", {
      month: "long",
    });
    selectMes.appendChild(option);
  }

  selectMes.disabled = false;
  document.getElementById("dia").disabled = false;
}

//aki pone los dias funsion
function setDia(diaInicio, diaFin) {
  const selectDia = document.getElementById("dia");
  selectDia.innerHTML = "";
  if (diaInicio > diaFin) {
    [diaInicio, diaFin] = [diaFin, diaInicio];
  }
  // agregamos opsiones para k no esplote
  const defult = document.createElement("option");
  defult.value = "";
  defult.textContent = "Opciones:";
  defult.disabled = true;
  defult.selected = true;
  selectDia.appendChild(defult);
  //pone dias for
  for (let d = diaInicio; d <= diaFin; d++) {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    selectDia.appendChild(option);
  }
  selectDia.disabled = false;
}

//aki pone las horas funsion
function setHora(horaInicio, horaFin) {
  const selectHora = document.getElementById("hora");
  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const año = new Date().getFullYear();
  const selFecha = `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  selectHora.innerHTML = "";
  const hInicio = parseInt(horaInicio.split(":")[0]);
  const hFin = parseInt(horaFin.split(":")[0]);
  const defult = document.createElement("option");
  defult.value = "";
  defult.textContent = "Opciones:";
  defult.disabled = true;
  defult.selected = true;
  selectHora.appendChild(defult);

  for (let h = hInicio; h < hFin; h++) {
    const horaInS = `${h.toString().padStart(2, "0")}:00`;

    const ocupado = fechaNo.some((f) => {
      if (f.fecha !== selFecha) return false;
      const [horaInicioOcupada] = f.hora.split("-");
      return horaInicioOcupada === horaInS;
    });

    if (!ocupado) {
      const horaFinS = `${(h + 1).toString().padStart(2, "0")}:00`;
      const option = document.createElement("option");

      option.value = `${horaInS}-${horaFinS}`;
      option.textContent = `${horaInS}-${horaFinS}`;

      selectHora.appendChild(option);
    }
  }
}

//por si hay algun chistosito me cubro de eso
function nop(idSelect) {
  const select = document.getElementById(idSelect);
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Opciones:";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  select.appendChild(defaultOption);
  select.disabled = true;
}

//boton para registrar la cita
document.getElementById("boton2").addEventListener("click", async () => {
  const monto = 1500;
  const formaPago = "No seleccionada";
  const statPago = "Pendiente";
  const statCita = "Agendada pendiente de pago";

  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const horaCita = document.getElementById("hora").value;
  const cedula = document.getElementById("doc").value;
  const año = new Date().getFullYear();

  const esp=document.getElementById("esp").value;
  
  if (!dia || !mes || !horaCita || !cedula) {
    alert("Faltan datos por seleccionar.");
    return;
  }

  // Fecha límite de pago y fecha de cita (ambas iguales)
  const fechaCita = `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

  const ahora = new Date();
  const limPago = new Date(ahora.getTime() + 8 * 60 * 60 * 1000); // +8 horas
  const limPagoStr = limPago.toISOString().slice(0, 16).replace("T", " "); // YYYY-MM-DD HH:MM
  const hoy = ahora.toISOString().split("T")[0];

  let sigIdPago;
  let sigIdCita;

  try {
    const resPago = await fetch("http://localhost:5000/api/sigPagoId");
    const dataPago = await resPago.json();
    sigIdPago = dataPago.sigIdPago;
  } catch (err) {
    console.error("Error al obtener ID de pago:", err);
    return;
  }

  try {
    const resCita = await fetch("http://localhost:5000/api/sigCitaId");
    const dataCita = await resCita.json();
    sigIdCita = dataCita.sigIdCita;
  } catch (err) {
    console.error("Error al obtener ID de cita:", err);
    return;
  }
  // Verificar si ya existe una cita para esa hora
try {
  const checkRes = await fetch("http://localhost:5000/api/gandalf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cedula,
      fechaR: fechaCita,
      horaCita
    })
  });

  const data = await checkRes.json();
  if (data.length > 0) {
    alert("Ya existe una cita para esa hora con este doctor. Elige otra hora.");
    return; // Detener el flujo
    }
  } catch (err) {
    console.error("Error al verificar disponibilidad de la hora:", err);
    alert("Error al verificar disponibilidad. Intenta de nuevo.");
    return;
  }
  // 1. Insertar el pago
  try {
    await fetch("http://localhost:5000/api/regPago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      idPago: sigIdPago,
      monto,
      formaPago,
      limPago: limPagoStr,  // incluye fecha y hora
      statPago,
  }),
});
console.log("Pago registrado");
  } catch (err) {
    console.error("Error al registrar el pago:", err);
    alert("No se pudo registrar el pago.");
    return;
  }

  // 2. Insertar la cita
  try {
    await fetch("http://localhost:5000/api/regCita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCita: sigIdCita,
        cedula,
        idPac: idPacG,
        idPago: sigIdPago,
        fechaC: hoy,
        fechaR: fechaCita,
        statCita,
        horaCita,
        esp
      }),
    });
    alert("¡Cita registrada con éxito!");
    window.location.href = "pago.html";
  } catch (err) {
    console.error("Error al registrar la cita:", err);
    alert("No se pudo registrar la cita.");
  }
});
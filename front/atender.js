//valido caracteres
function valido(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  // Permitir letras, acentos, ñ, números del 1 al 9, arroba, etc.
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  // También permitimos códigos ASCII específicos:
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

(async function () {
const urlParams = new URLSearchParams(window.location.search);
const idCita = urlParams.get("idCita");
//aca le pongo sus datos al paciente
try {
  const dataPac = await fetch("http://localhost:5000/api/datosPaciente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idCita }),
  });
  const datosPac = await dataPac.json();
  let datos = {
    nombre: datosPac.nom,
    apellidoP: datosPac.apPat,
    apellidoM: datosPac.apMat,
    TSeguro: datosPac.tipoSeg,
    Estatura: datosPac.estatura,
    edad: datosPac.edad,
    enferCron: datosPac.enferCron,
    vacunas:datosPac.vacunas,
    anteFam: datosPac.anteFam,
    alergias: datosPac.alergias,
    tipoSangre: datosPac.tipoSangre
  };
  console.log(datos);
  document.getElementById("TSeguro").innerText = datos.TSeguro;
  document.getElementById("Estatura").innerText = datos.Estatura;
  document.getElementById("edad_persona").innerText = datos.edad;
  document.getElementById("nombreF").innerText = datos.nombre;
  document.getElementById("apellidoM").innerText = datos.apellidoM;
  document.getElementById("apellidoP").innerText = datos.apellidoP;
  document.getElementById("enfCron").innerText = datos.enferCron;
  document.getElementById("vac").innerText = datos.vacunas;
  document.getElementById("anteFam").innerText = datos.anteFam;
  document.getElementById("ale").innerText = datos.alergias;
  document.getElementById("tipoSangre").innerText = datos.tipoSangre;

} catch (err) {
  console.error("Error en la solicitud:", err);
  alert("Error al consultar los datos del pac.");
}
})();

let idCita = new URLSearchParams(window.location.search).get("idCita");
    let idRecetaGlobal;

    async function obtenerIdReceta() {
      const res = await fetch("http://localhost:5000/api/sigRecetaId");
      const data = await res.json();
      idRecetaGlobal = data.sigRecetaId;
    }

    function agregarFila() {
        const tbody = document.getElementById("cuerpoTabla");
        const fila = document.createElement("tr");

        // Crear cada input con su evento de validación
        const diag = document.createElement("input");
        diag.type = "text";
        diag.name = "diag";
        diag.addEventListener("keypress", valido);

        const med = document.createElement("input");
        med.type = "text";
        med.name = "med";
        med.addEventListener("keypress", valido);

        const dosis = document.createElement("input");
        dosis.type = "text";
        dosis.name = "dosis";
        dosis.addEventListener("keypress", valido);

        const intervalo = document.createElement("input");
        intervalo.type = "text";
        intervalo.name = "intervalo";
        intervalo.addEventListener("keypress", valido);

        const observ = document.createElement("input");
        observ.type = "text";
        observ.name = "observ";
        observ.addEventListener("keypress", valido);

        // Crear celdas y agregar los inputs
        const celdas = [diag, med, dosis, intervalo, observ].map(input => {
            const td = document.createElement("td");
            td.appendChild(input);
            return td;
        });

        celdas.forEach(td => fila.appendChild(td));
        tbody.appendChild(fila);
    }

    document.getElementById("btnAgregarFila").addEventListener("click", agregarFila);

document.getElementById("formReceta").addEventListener("submit", async function (e) {
  e.preventDefault();
  const fechaHoy = new Date().toISOString().split("T")[0];
  const filas = document.querySelectorAll("#cuerpoTabla tr");

  let recetas = [];

  // 🔍 Primero: validar que ningún campo esté vacío
  for (let fila of filas) {
    const diag = fila.querySelector("input[name='diag']").value.trim();
    const med = fila.querySelector("input[name='med']").value.trim();
    const dosis = fila.querySelector("input[name='dosis']").value.trim();
    const intervalo = fila.querySelector("input[name='intervalo']").value.trim();
    const observ = fila.querySelector("input[name='observ']").value.trim();

    if (!diag || !med || !dosis || !intervalo || !observ) {
      alert("Por favor, completa todos los campos en todas las filas antes de enviar la receta.");
      return; // Detiene el proceso antes de insertar
    }

    recetas.push({ diag, med, dosis, intervalo, observ });
  }

  // ✅ Segundo: ahora que todos los datos están validados, enviamos las recetas
  let idRecActual = idRecetaGlobal;

  for (let receta of recetas) {
    await fetch("http://localhost:5000/api/regReceta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idRec: idRecActual,
        idCita: parseInt(idCita),
        diag: receta.diag,
        med: receta.med,
        dosis: receta.dosis,
        intervalo: receta.intervalo,
        fechaRe: fechaHoy,
        observ: receta.observ
      })
    });

    idRecActual++;
  }
  try {
      const aten = await fetch("http://localhost:5000/api/atendida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idCita: parseInt(idCita) }),
      });

      const resultado = await aten.json();
    } catch (err) {
      console.error("Error al registrar pago:", err);
      alert("Ocurrió un error al procesar el pago.");
    }
  alert("Receta registrada correctamente");
  window.location.href = "vistaDoc.html";
});

    (async function () {
      await obtenerIdReceta();
      agregarFila();
    })();


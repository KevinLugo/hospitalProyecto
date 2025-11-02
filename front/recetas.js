document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = sessionStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("No hay sesion activa. Por favor inicia sesion");
    return;
  }

  //obtenemos cedula
  let cedula;
  try {
    const ced = await fetch("http://localhost:5000/api/cedula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUser: parseInt(idUsuario) }),
    });
    const cedulaObj = await ced.json();
    cedula = cedulaObj[0]?.cedula;
  } catch (err) {
    console.error("Error al obtener cedula:", err);
    alert("No se pudo obtener la cedula");
    return;
  }

  const buscador = document.getElementById("buscador");
  let contenedor = document.getElementById("contenedorRecetas");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "contenedorRecetas";
    document.body.appendChild(contenedor);
  }

  async function cargarRecetas(data, endpoint) {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const recetas = await res.json();

      contenedor.innerHTML = ""; //limpiamos todo antes de mostrar

      if (!recetas || recetas.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center;">No se encontraron recetas</p>`;
        return;
      }

      //agrupamos recetas por idCita
      const grupos = {};
      recetas.forEach(r => {
        const key = r.idCita ?? `rec${r.idRec}`; //fallback por si falta idCita
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(r);
      });

      //agrupasion por conjunto de receta
      Object.keys(grupos).forEach(idCita => {
        const grupo = grupos[idCita];
        const r0 = grupo[0];

        const fecha = r0.fechaRe ? r0.fechaRe.split("T")[0] : "Sin fecha";
        const nombrePaciente = `${r0.nom ?? ""} ${r0.apPat ?? ""} ${r0.apMat ?? ""}`.trim();

        const recetaDiv = document.createElement("div");
        recetaDiv.classList.add("receta");
        recetaDiv.style.border = "2px solid #888";
        recetaDiv.style.borderRadius = "10px";
        recetaDiv.style.padding = "15px";
        recetaDiv.style.margin = "20px 0";
        recetaDiv.style.background = "#fafafa";

        //head de la receta
        recetaDiv.innerHTML = `
          <h3 style="margin:0 0 8px 0;">Receta de ${escapeHtml(nombrePaciente)}</h3>
          <p style="margin:4px 0;"><strong>Diagnostico:</strong> ${escapeHtml(r0.diag ?? "Sin diagnostico")}</p>
          <p style="margin:4px 0 12px 0;"><strong>Fecha de emision:</strong> ${escapeHtml(fecha)}</p>
        `;

        //info de la receta
        const tabla = document.createElement("table");
        tabla.classList.add("tablaReceta");
        tabla.border = "1";
        tabla.style.width = "100%";
        tabla.style.borderCollapse = "collapse";
        tabla.style.marginBottom = "12px";
        tabla.innerHTML = `
          <thead>
            <tr style="background:#ddd;">
              <th style="padding:6px;">Medicamento</th>
              <th style="padding:6px;">Dosis</th>
              <th style="padding:6px;">Intervalo</th>
              <th style="padding:6px;">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${grupo.map(fila => `
              <tr>
                <td style="padding:6px;">${escapeHtml(fila.med ?? "")}</td>
                <td style="padding:6px;">${escapeHtml(fila.dosis ?? "")}</td>
                <td style="padding:6px;">${escapeHtml(fila.intervalo ?? "")}</td>
                <td style="padding:6px;">${escapeHtml(fila.observ ?? "")}</td>
              </tr>
            `).join("")}
          </tbody>
        `;

        recetaDiv.appendChild(tabla);

        //boton pa generar pdf
        const btnPDF = document.createElement("button");
        btnPDF.textContent = "Generar PDF";
        btnPDF.style.marginRight = "8px";
        btnPDF.addEventListener("click", () => generarPDFGrupo(grupo));

        recetaDiv.appendChild(btnPDF);

        //puedo agregar mas botones por si kiero imprimir o nose
        contenedor.appendChild(recetaDiv);
      });

    } catch (err) {
      console.error("Error al cargar recetas:", err);
    }
  }

  //kodigo para generar pdf
  function generarPDFGrupo(grupo) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Falta la libreria jsPDF, te falto: <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'></script>");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const r0 = grupo[0];
    const fecha = r0.fechaRe ? new Date(r0.fechaRe).toLocaleDateString() : "Sin fecha";
    const paciente = `${r0.nom ?? ""} ${r0.apPat ?? ""} ${r0.apMat ?? ""}`.trim();
    const idCita = r0.idCita ?? r0.idRec ?? "0";

    //kabesera
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Receta Medica", 40, 50);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Paciente: ${paciente}`, 40, 80);
    doc.text(`Fecha: ${fecha}`, 40, 100);
    doc.text(`Cita / Receta ID: ${idCita}`, 40, 120);
    doc.text(`Diagnostico: ${r0.diag ?? "Sin diagnostico"}`, 40, 140);

    //tabla
    let y = 170;
    const left = 40;
    const colWidths = [200, 80, 80, 160];
    const lineHeight = 16;

    //ekcabesados
    doc.setFont("helvetica", "bold");
    doc.text("Medicamento", left, y);
    doc.text("Dosis", left + colWidths[0] + 8, y);
    doc.text("Intervalo", left + colWidths[0] + colWidths[1] + 16, y);
    doc.text("Observaciones", left + colWidths[0] + colWidths[1] + colWidths[2] + 24, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");

    grupo.forEach((fila, idx) => {
      //nole entendi aclh
      if (y > 760) {
        doc.addPage();
        y = 40;
      }

      const med = fila.med ?? "";
      const dosis = fila.dosis ?? "";
      const intervalo = fila.intervalo ?? "";
      const observ = fila.observ ?? "";

      //obserbaciones
      const observLines = doc.splitTextToSize(observ, colWidths[3]);
      const medLines = doc.splitTextToSize(med, colWidths[0]);

      const maxLines = Math.max(medLines.length, observLines.length);

      for (let ln = 0; ln < maxLines; ln++) {
        const textMed = medLines[ln] ?? "";
        const textDosis = ln === 0 ? dosis : "";
        const textInterv = ln === 0 ? intervalo : "";
        const textObs = observLines[ln] ?? "";

        doc.text(textMed, left, y);
        doc.text(textDosis, left + colWidths[0] + 8, y);
        doc.text(textInterv, left + colWidths[0] + colWidths[1] + 16, y);
        doc.text(textObs, left + colWidths[0] + colWidths[1] + colWidths[2] + 24, y);
        y += lineHeight;
        //nueba pagina si es nesesario
        if (y > 760) {
          doc.addPage();
          y = 40;
        }
      }
      //pequeña separacion entre registros
      y += 4;
    });

    //guardamoz
    const filename = `Receta_${idCita}_${(r0.fechaRe || "").split("T")[0] || "sinFecha"}.pdf`;
    doc.save(filename);
  }

  //al parecer kodigo para evitar inyeccion HTML 
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
      })[s];
    });
  }

  //kargamos recetas
  if (cedula) cargarRecetas({ cedula: parseInt(cedula) }, "recetas");

  //buskeda mientras escribe
  buscador.addEventListener("input", () => {
    const texto = buscador.value.trim();
    if (texto === "") {
      cargarRecetas({ cedula: parseInt(cedula) }, "recetas");
    } else {
      cargarRecetas({ cedula: parseInt(cedula), nombre: texto }, "recetas2");
    }
  });
});

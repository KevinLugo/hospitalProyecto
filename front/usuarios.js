//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  // Mayúsculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  // Minúsculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,
  241,
];

//funcion paral rfc
function valRfc(e) {
  const codigo = e.keyCode || e.which;

  // Permitir Backspace, Tab, y flechas
  if ([8, 9, 37, 38, 39, 40].includes(codigo)) return;

  if (!rfcSi.includes(codigo)) {
    e.preventDefault();
  }
}

//selo apliko al uniko testo (por aora)
document.getElementById("clave").addEventListener("keypress", valRfc);

//busca a todos cuando le pika al usuario
document.getElementById("tipoUser").addEventListener("change", async () => {
  const tipo = document.getElementById("tipoUser").value;
  const label = document.getElementById("lblClave");
  label.textContent = tipo === "paciente" ? "CURP:" : "RFC:";
  document.getElementById("clave").value = "";

  // Si hay un tipo, muestra todos los registros
  let endpoint;
  if (tipo === "paciente") {
    endpoint = "/api/todosPac";
  } else if (tipo === "doctor") {
    endpoint = "/api/todosDoc";
  } else if (tipo === "recepcionista") {
    endpoint = "/api/todasRec";
  }

  if (endpoint) {
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`);
      const datos = await res.json();
      if (!datos || datos.length === 0) {
        alert("No hay registros disponibles.");
        return;
      }
      console.log("Datos recibidos:", datos);
      mostrarResultados(tipo, datos);
    } catch (err) {
      console.error("Error al cargar todos los usuarios:", err);
      alert("Error al mostrar usuarios.");
    }
  }
});

document.getElementById("tipoUser").addEventListener("change", () => {
  const tipo = document.getElementById("tipoUser").value;
  const label = document.getElementById("lblClave");
  label.textContent = tipo === "paciente" ? "CURP:" : "RFC:";
});

document.getElementById("btnBuscar").addEventListener("click", async () => {
  const tipo = document.getElementById("tipoUser").value;
  const clave = document.getElementById("clave").value;

  if (!tipo || !clave) {
    alert("Seleccione un tipo de usuario y proporcione un CURP o RFC.");
    return;
  }

  let endpoint;
  let body;

  // Decide endpoint y campo según el tipo
  if (tipo === "paciente") {
    endpoint = "/api/elPac";
    body = { curp: clave };
  } else if (tipo === "doctor") {
    endpoint = "/api/elDoc";
    body = { rfc: clave };
  } else if (tipo === "recepcionista") {
    endpoint = "/api/laRec";
    body = { rfc: clave };
  }

  try {
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!data || Object.keys(data).length === 0) {
      alert("No se encontró ningún usuario.");
      return;
    }

    mostrarResultados(tipo, data); //lo metemos como array kololabe
  } catch (err) {
    console.error("Error al buscar:", err);
    alert("Error en la búsqueda.");
  }
});

function mostrarResultados(tipo, datos) {
  const thead = document.getElementById("theadResultados");
  const tbody = document.getElementById("tbodyResultados");

  // Limpia la tabla
  thead.innerHTML = "";
  tbody.innerHTML = "";

  //Mapas clave → nombre real del campo en base de datos
  const baseMap = {
    Nombre: "nom",
    "Apellido paterno": "apPat",
    "Apellido materno": "apMat",
    Nacimiento: "fechaNac",
    Teléfono: "tel",
    Correro: "correo",
    Usuario: "nomUser",
    Contraseña: "contra",
  };

  const extraMap = {
    Seguro: "tipoSeg",
    Estatura: "estatura",
    CURP: "curp",
    Sangre: "tipoSangre",
    Alergias: "alergias",
    Vacunas: "vacunas",
    Crónicas: "enferCron",
    Antecedentes: "anteFam",
    RFC: "rfc",
    Salario: "salario",
    Estatus: "estatus",
    Días: "dias",
    "Hora Entrada": "horaEnt",
    "Hora Salida": "horaSal",
    Turno: "turno",
    Cédula: "cedula",
    Especialidad: "especialidades",
    Consultorio: "noCon",
    Planta: "planta",
  };

  // Columnas base y extras
  const baseCols = Object.keys(baseMap);
  let extraCols = [];
  if (tipo === "paciente") {
    extraCols = [
      "Seguro",
      "Estatura",
      "CURP",
      "Sangre",
      "Alergias",
      "Vacunas",
      "Crónicas",
      "Antecedentes",
    ];
  } else if (tipo === "recepcionista") {
    extraCols = [
      "RFC",
      "Salario",
      "Estatus",
      "Días",
      "Hora Entrada",
      "Hora Salida",
      "Turno",
    ];
  } else if (tipo === "doctor") {
    extraCols = [
      "RFC",
      "Salario",
      "Estatus",
      "Días",
      "Hora Entrada",
      "Hora Salida",
      "Turno",
      "Cédula",
      "Especialidad",
      "Consultorio",
      "Planta",
    ];
  }

  const actionCols = [
    "Modificar",
    tipo === "paciente" ? "Citas" : "Dar de baja",
  ];

  // Cabecera
  const headerRow = document.createElement("tr");
  [...baseCols, ...extraCols, ...actionCols].forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Filas
  datos.forEach((dato) => {
    const row = document.createElement("tr");

    baseCols.forEach((col) => {
      const td = document.createElement("td");
      const key = baseMap[col];
      let valor = dato[key] || "";

      // Si es fecha, formatea solo la parte YYYY-MM-DD
      if (key === "fechaNac" && valor) {
        valor = new Date(valor).toISOString().split("T")[0];
      }

      td.textContent = valor;
      row.appendChild(td);
    });

    extraCols.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = dato[extraMap[col]] || "";
      row.appendChild(td);
    });

    // Botón modificar
    const tdMod = document.createElement("td");
    const btnMod = document.createElement("button");
    btnMod.textContent = "Datos";

    // Redirige a la página correspondiente con el idUser como parámetro
    btnMod.onclick = () => {
      let pagina = "";
      if (tipo === "paciente") {
        pagina = "modPac.html";
      } else if (tipo === "doctor") {
        pagina = "modDoc.html";
      } else if (tipo === "recepcionista") {
        pagina = "modRec.html";
      }

      if (pagina) {
        // Redirige con query string ?id=...
        window.location.href = `${pagina}?id=${dato.idUser}`;
      }
    };

    tdMod.appendChild(btnMod);
    row.appendChild(tdMod);

    // Botón citas o baja/activar
    const tdExtra = document.createElement("td");
    const btnExtra = document.createElement("button");

    if (tipo === "paciente") {
      btnExtra.textContent = "Citas";
      btnExtra.onclick = () => {
        window.location.href = `menuCitas.html?id=${dato.idUser}`;
      };
    } else if (tipo === "recepcionista") {
      btnExtra.textContent = "No se puede";
      btnExtra.disabled = true;
      btnExtra.style.opacity = 0.5;
    } else if (tipo === "doctor") {
      const estatus = dato.estatus?.toLowerCase();

      const activarDoctor = async () => {
        const confirmar = confirm(`¿Activar nuevamente al doctor ${dato.nom}?`);
        if (!confirmar) return;

        try {
          const res = await fetch("http://localhost:5000/api/olaDoc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: dato.idUser }),
          });

          const result = await res.json();

          if (res.ok && result.rowsAffected?.[0] > 0) {
            alert(`Doctor ${dato.nom} activado correctamente.`);
            dato.estatus = "activo";
            btnExtra.textContent = "Dar de baja";
            btnExtra.onclick = darDeBaja; // ← Lo puedes enlazar de nuevo si quieres
          } else {
            alert("No se pudo activar al doctor.");
          }
        } catch (err) {
          console.error("Error al activar doctor:", err);
          alert("Error inesperado.");
        }
      };

      const darDeBaja = async () => {
        const confirmar = confirm(`¿Dar de baja al doctor ${dato.nom}?`);
        if (!confirmar) return;

        try {
          const res = await fetch("http://localhost:5000/api/byeDoc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: dato.idUser }),
          });

          const result = await res.json();

          if (res.ok && result.rowsAffected?.[0] > 0) {
            alert(`Doctor ${dato.nom} dado de baja correctamente.`);
            dato.estatus = "No activo";
            btnExtra.textContent = "Activar";
            btnExtra.onclick = activarDoctor;
          } else {
            alert("No se puede dar de baja porque tiene citas pendientes.");
          }
        } catch (err) {
          console.error("Error al dar de baja:", err);
          alert("Error inesperado.");
        }
      };

      if (estatus === "activo") {
        btnExtra.textContent = "Dar de baja";
        btnExtra.onclick = darDeBaja;
      } else {
        btnExtra.textContent = "Activar";
        btnExtra.onclick = activarDoctor;
      }
    }
    tdExtra.appendChild(btnExtra);
    row.appendChild(tdExtra);
    tbody.appendChild(row);
  });
}

// Traduce nombre columna → clave JSON esperada
function normalizaLlave(texto) {
  const equivalencias = {
    nombre: "nom",
    "apellido paterno": "apPat",
    "apellido materno": "apMat",
    nacimiento: "fechaNac",
    teléfono: "tel",
    correro: "correo", // <-- si está mal escrito en el th, ajústalo a "correo"
    usuario: "nomUser",
    contraseña: "contra",
    seguro: "tipoSeg",
    estatura: "estatura",
    curp: "curp",
    sangre: "tipoSangre",
    alergias: "alergias",
    vacunas: "vacunas",
    crónicas: "enferCron",
    antecedentes: "anteFam",
    rfc: "rfc",
    salario: "salario",
    estatus: "estatus",
    días: "dias",
    "hora entrada": "horaEnt",
    "hora salida": "horaSal",
    turno: "turno",
    cédula: "cedula",
    especialidad: "especialidades",
    consultorio: "noCon",
    planta: "planta",
  };

  texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  return equivalencias[texto] || texto.replace(/\s+/g, "");
}

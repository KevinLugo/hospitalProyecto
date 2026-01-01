//obtenemoz el tipo d ussuario para ber k permisos le otorgamos
const tipoUsrAc = sessionStorage.getItem("tipoUs");

document.addEventListener("DOMContentLoaded", () => {
  if (tipoUsrAc === "Admin") {
    //kambia colores
    document.documentElement.style.setProperty("--color-principal", "#9132bb");
    document.documentElement.style.setProperty("--color-principal-hover", "#7a28a0");
    document.documentElement.style.setProperty("--color-boton-texto", "#9132bb");
    document.documentElement.style.setProperty("--color-boton-hover", "white");
    document.documentElement.style.setProperty("--color-border", "#b051d8ff");
  }
});


//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  //mayusculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  //minusculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,
  241,
];

//funcion paral rfc
function valRfc(e) {
  const codigo = e.keyCode || e.which;

  //borrar, tab y flechas
  if ([8, 9, 37, 38, 39, 40].includes(codigo)) return;

  if (!rfcSi.includes(codigo)) {
    e.preventDefault();
  }
}

//selo apliko al uniko testo
document.getElementById("clave").addEventListener("keypress", valRfc);

document.getElementById("btn1").addEventListener("click", function () {
  if(tipoUsrAc=="Empleado"){
    window.location.href = "vistaRec.html";
  }else if(tipoUsrAc=="Admin"){
    window.location.href = "vistaAdm.html";
  }
});

//busca a todos cuando le pika al usuario
document.getElementById("tipoUser").addEventListener("change", async () => {
  const tipo = document.getElementById("tipoUser").value;
  const label = document.getElementById("lblClave");
  const thead = document.getElementById("theadResultados");
  const tbody = document.getElementById("tbodyResultados");

  //kita la tabla si elije la opsion elije
  if (tipo === "") {
    label.textContent = "CURP / RFC:";
    tbody.innerHTML = "";
    thead.innerHTML = "";
    document.getElementById("clave").value = "";
    return;
  }

  //kambia la tabla dependiendo del tipo k elijio
  label.textContent = tipo === "paciente" ? "CURP:" : "RFC:";
  document.getElementById("clave").value = "";

  //kambia el endpoint dependiendo d tipo
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
        alert("No hay registros disponibles");
        return;
      }
      mostrarResultados(tipo, datos);
    } catch (err) {
      console.error("Error al cargar todos los usuarios:", err);
      alert("Error al mostrar usuarios");
    }
  }
});

document.getElementById("tipoUser").addEventListener("change", () => {
  const tipo = document.getElementById("tipoUser").value;
  const label = document.getElementById("lblClave");
  label.textContent = tipo === "paciente" ? "CURP:" : "RFC:";
});

const inputClave = document.getElementById("clave");
const selectTipo = document.getElementById("tipoUser");

inputClave.addEventListener("input", async () => {
  const tipo = selectTipo.value;
  const clave = inputClave.value.trim();

  //no hace nada
  if (!tipo) return;

  //muestra todo si el kampo ta bacio
  if (clave === "") {
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
        mostrarResultados(tipo, datos);
      } catch (err) {
        console.error("Error al mostrar todos:", err);
      }
    }
    return;
  }

  //hace la buskeda con base al texto y dependiendo del tipo
  let endpoint;
  let body;

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
      // Si no hay coincidencias, limpiamos tabla
      document.getElementById("theadResultados").innerHTML = "";
      document.getElementById("tbodyResultados").innerHTML = "";
      return;
    }

    mostrarResultados(tipo, data);
  } catch (err) {
    console.error("Error en la busqueda:", err);
  }
});


function mostrarResultados(tipo, datos) {
  const thead = document.getElementById("theadResultados");
  const tbody = document.getElementById("tbodyResultados");
  thead.innerHTML = "";
  tbody.innerHTML = "";

  //info del usuario
  const baseMap = {
    Nombre: "nom",
    "Apellido paterno": "apPat",
    "Apellido materno": "apMat",
    Nacimiento: "fechaNac",
    Telefono: "tel",
    Correro: "correo",
    Usuario: "nomUser",
    Contraseña: "contra",
  };

  //resto d datos
  const extraMap = {
    Seguro: "tipoSeg",
    Estatura: "estatura",
    CURP: "curp",
    Sangre: "tipoSangre",
    Alergias: "alergias",
    Vacunas: "vacunas",
    Cronicas: "enferCron",
    Antecedentes: "anteFam",
    RFC: "rfc",
    Salario: "salario",
    Estatus: "estatus",
    Dias: "dias",
    "Hora Entrada": "horaEnt",
    "Hora Salida": "horaSal",
    Turno: "turno",
    Cedula: "cedula",
    Especialidad: "especialidades",
    Consultorio: "noCon",
    Planta: "planta",
  };

  //columnas base y extra
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
      "Cronicas",
      "Antecedentes",
    ];
  } else if (tipo === "recepcionista") {
    extraCols = [
      "RFC",
      "Salario",
      "Estatus",
      "Dias",
      "Hora Entrada",
      "Hora Salida",
      "Turno",
    ];
  } else if (tipo === "doctor") {
    extraCols = [
      "RFC",
      "Salario",
      "Estatus",
      "Dias",
      "Hora Entrada",
      "Hora Salida",
      "Turno",
      "Cedula",
      "Especialidad",
      "Consultorio",
      "Planta",
    ];
  }
  const actionCols = ["Modificar", tipo === "paciente" ? "Citas" : "Dar de baja"];

  //hed
  const headerRow = document.createElement("tr");
  [...baseCols, ...extraCols, ...actionCols].forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  //rous
  datos.forEach((dato) => {
    const row = document.createElement("tr");
    baseCols.forEach((col) => {
    const td = document.createElement("td");
    const key = baseMap[col];
    let valor = dato[key] || "";
    //fechaFormato
    if (key === "fechaNac" && valor) {
      valor = new Date(valor).toISOString().split("T")[0];
    }
    //nop
    if (key === "contra" && tipo === "recepcionista" && tipoUsrAc === "Empleado") {
      valor = "********";
    }
    td.textContent = valor;
    row.appendChild(td);
  });

    extraCols.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = dato[extraMap[col]] || "";
      row.appendChild(td);
    });

    //boton para modifikar
    const tdMod = document.createElement("td");
    const btnMod = document.createElement("button");
    btnMod.textContent = "Datos";
    btnMod.classList.add("btnMod");

    //kontrol d permisos para recepsionista
    if (tipo === "recepcionista" && tipoUsrAc === "Empleado") {
      btnMod.disabled = true;
      btnMod.textContent = "Sin permisos";
    } else {
      btnMod.onclick = () => {
        let pagina = "";
        if (tipo === "paciente") pagina = "modPac.html";
        else if (tipo === "doctor") pagina = "modDoc.html";
        else if (tipo === "recepcionista") pagina = "modRec.html";
        if (pagina) window.location.href = `${pagina}?id=${dato.idUser}`;
      };
    }
    tdMod.appendChild(btnMod);
    row.appendChild(tdMod);

    //otro boton estra
    const tdExtra = document.createElement("td");
    const btnExtra = document.createElement("button");
    btnExtra.classList.add("btn-cancelar");

    if (tipo === "paciente") {
      btnExtra.textContent = "Citas";
      btnExtra.onclick = () => {
        sessionStorage.setItem("idUsuario2", String(dato.idUser));
        window.location.href = "citasRec.html";
      };
    } else if (tipo === "recepcionista") {
      if (tipoUsrAc === "Admin") {
      const estatus = dato.estatus?.toLowerCase();

      const activarRecepcionista = async () => {
        const confirmar = confirm(`¿Activar nuevamente a ${dato.nom}?`);
        if (!confirmar) return;
        try {
          const res = await fetch("http://localhost:5000/api/olaEmp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: dato.idUser }),
          });
          const result = await res.json();
          if (res.ok) {
            alert(`${dato.nom} activada correctamente`);
            dato.estatus = "activo";
            btnExtra.textContent = "Dar de baja";
            btnExtra.onclick = darDeBajaRecep;
          }
        } catch (err) {
          console.error(err);
          alert("Error inesperado al activar");
        }
      };

      const darDeBajaRecep = async () => {
        const confirmar = confirm(`¿Dar de baja a ${dato.nom}?`);
        if (!confirmar) return;
        try {
          const res = await fetch("http://localhost:5000/api/byeRecep", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: dato.idUser }),
          });
          const result = await res.json();
          if (res.ok) {
            alert(`${dato.nom} dada de baja correctamente`);
            dato.estatus = "No activo";
            btnExtra.textContent = "Activar";
            btnExtra.onclick = activarRecepcionista;
          } else {
            alert("No se pudo dar de baja");
          }
        } catch (err) {
          console.error(err);
          alert("Error inesperado al dar de baja");
        }
      };

      //dependiendo del estatus del emp kambia el boton
      if (estatus === "activo") {
        btnExtra.textContent = "Dar de baja";
        btnExtra.onclick = darDeBajaRecep;
      } else {
        btnExtra.textContent = "Activar";
        btnExtra.onclick = activarRecepcionista;
      }
    } else {
      btnExtra.textContent = "Sin permisos";
      btnExtra.disabled = true;
      btnExtra.style.opacity = 0.5;
    }
    } else if (tipo === "doctor") {
      const estatus = dato.estatus?.toLowerCase();
      const activarDoctor = async () => {
        const confirmar = confirm(`¿Activar nuevamente al doctor ${dato.nom}?`);
        if (!confirmar) return;
        try {
          const res = await fetch("http://localhost:5000/api/olaEmp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: dato.idUser }),
          });
          const result = await res.json();
          if (res.ok) {
            alert(`Doctor ${dato.nom} activado correctamente.`);
            dato.estatus = "activo";
            btnExtra.textContent = "Dar de baja";
            btnExtra.onclick = darDeBaja;
          }
        } catch (err) {
          console.error(err);
          alert("Error inesperado");
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
          if (res.ok) {
            alert(`Doctor ${dato.nom} dado de baja correctamente`);
            dato.estatus = "No activo";
            btnExtra.textContent = "Activar";
            btnExtra.onclick = activarDoctor;
          } else alert("No se puede dar de baja porque tiene citas pendientes");
        } catch (err) {
          console.error(err);
          alert("Error inesperado");
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

//bariable=columna base
function normalizaLlave(texto) {
  const equivalencias = {
    nombre: "nom",
    "apellido paterno": "apPat",
    "apellido materno": "apMat",
    nacimiento: "fechaNac",
    telefono: "tel",
    correro: "correo",
    usuario: "nomUser",
    contraseña: "contra",
    seguro: "tipoSeg",
    estatura: "estatura",
    curp: "curp",
    sangre: "tipoSangre",
    alergias: "alergias",
    vacunas: "vacunas",
    cronicas: "enferCron",
    antecedentes: "anteFam",
    rfc: "rfc",
    salario: "salario",
    estatus: "estatus",
    dias: "dias",
    "hora entrada": "horaEnt",
    "hora salida": "horaSal",
    turno: "turno",
    cedula: "cedula",
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
//para k se buelba a ber el div cuando elija una opsion
document.addEventListener("DOMContentLoaded", () => {
  const tipoUser = document.getElementById("tipoUser");
  const tablaContainer = document.querySelector(".tabla-container");

  tipoUser.addEventListener("change", () => {
    if (tipoUser.value) {
      tablaContainer.style.display = "block";//mostramos el div
    } else {
      tablaContainer.style.display = "none";//lo okulta si elije la opcion opcion
    }
  });
});
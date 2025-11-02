//funcion para poner consultorios
window.addEventListener("DOMContentLoaded", konsul);

//constantez globalez para funsiones
let tur = document.getElementById("turno");
let mensaje = document.getElementById("mensajeTurno");
let noDias = document.querySelectorAll('input[name="dias"]');
let errorDias2 = false;
let container = document.getElementById("espec");
let salario = 20000;
document.getElementById("salario").textContent = 20000;

const tipoEsp = [
  { id: 1, nombre: "Cardiologia" },
  { id: 2, nombre: "Dermatologia" },
  { id: 3, nombre: "Ginecologia" },
  { id: 5, nombre: "Nefrologia" },
  { id: 6, nombre: "Nutriologia" },
  { id: 7, nombre: "Oftalmologia" },
  { id: 8, nombre: "Oncologia" },
  { id: 9, nombre: "Ortopedia" },
  { id: 10, nombre: "Pediatra" },
];

//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  // Mayusculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  // Minusculas
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

//valido caracteres  del usuario
function validA(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  //y ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del correo y contra
function validB(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //otros caracteres
  const asies = /^[a-zA-ZñÑ@0-9]$/;

  //otro ascii
  const codSi = [43, 45, 46, 95];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del nombre
function validC(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //otros otros caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  //otros otros ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas telefono
function validD(e) {
  const letra = e.key;

  //numero nomas
  const asies = /^[0-9]$/;
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//se lo aplico validasiones a todos los testos
document.getElementById("rfc").addEventListener("keypress", valRfc);
document.getElementById("user").addEventListener("keypress", validA);
document.getElementById("psw").addEventListener("keypress", validB);
document.getElementById("correo").addEventListener("keypress", validB);
document.getElementById("nom").addEventListener("keypress", validC);
document.getElementById("apPat").addEventListener("keypress", validC);
document.getElementById("apMat").addEventListener("keypress", validC);
document.getElementById("tel").addEventListener("keypress", validD);
document.getElementById("cedula").addEventListener("keypress", validD);

//pal lobi
document.getElementById("boton1").addEventListener("click", function () {
  window.location.href = "registrar.html";
});

//le pone los consultorios disponibles
async function konsul() {
  try {
    const res = await fetch("http://localhost:5000/api/consul");
    const data = await res.json();

    const consultorios = data.consul; //lo enbie del bak aszi
    const select = document.getElementById("consul");

    if (consultorios.length === 0) {
      alert("No hay consultorios disponibles actualmente");
      window.location.href = "registrar.html"; //amonos balio madre
      return;
    }

    //limpia opsiones
    select.innerHTML = "";

    //opsion por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Elige una opcion...";
    select.appendChild(defaultOption);

    //agrega opsiones
    consultorios.forEach(({ idCon, noCon }) => {
      const option = document.createElement("option");
      option.value = idCon;
      option.textContent = `Consultorio ${noCon}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar consultorios:", err);
    alert("Hubo un error al obtener los consultorios");
  }
}

//magia
document.getElementById("boton2").addEventListener("click", async () => {
  //bariables para comprobar errores
  let errorCed = false;
  let errorRFC = false;
  const extructRfc = /^[A-ZÑ]{4}[0-9]{6}[A-Z0-9]{2,3}$/i;
  let errorUser = false;
  let errorDias = false;
  let errorNoEsp=false;
  let dias = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  )
    .map((checkbox) => checkbox.value)
    .join(", ");
  if (!dias) {
    errorDias = true;
  }
  //bariables extras
  let numEsp = document.getElementById("noEsp").value;

  //bariables para meter registros en tablas usuario, empleado y recep
  //variables usuario
  let sigIdUser;
  let nom = document.getElementById("nom").value;
  let apPat = document.getElementById("apPat").value;
  let apMat = document.getElementById("apMat").value;
  let fechaNac = document.getElementById("fechaNac").value;
  let tel = document.getElementById("tel").value;
  let contra = document.getElementById("psw").value;
  let nomUser = document.getElementById("user").value;
  let correo = document.getElementById("correo").value;
  let idTipoUser = 22;

  //variables del empleado
  let sigIdEmp;
  let idUser;
  //salario;
  let estatus = "activo";
  let rfc = document.getElementById("rfc").value;
  let idTipoEmp = 1;

  //variables horario
  let sigIdHora;
  let idEmp;
  //dias
  let horaEnt;
  let horaSal;
  let turno = document.getElementById("turno").value;

  //variables del doc
  let cedula = document.getElementById("cedula").value;
  //idEmp;

  //variables docEsp
  let sigIdDE;
  //cedula;
  let idEsp; //aorita
  let statEsp = "Activo";

  //variables asigConsul
  let sigIdAC;
  //cedula;
  let idCon = parseInt(document.getElementById("consul").value);
  let statCon = "Activo";
  let horaIn;
  let horaFin;
  let diasCon;

  const cuales = [];
  for (let i = 1; i <= numEsp; i++) {
    const select = document.querySelector(`select[name="especialidad${i}"]`);
    if (select) {
      cuales.push(select.value);
    }
  }
  //Se verifica siai repetidos
  const rep = new Set(cuales).size !== cuales.length;
  if (rep) {
    alert("No puedes seleccionar la misma especialidad mas de una vez");
    return;
  }
  const idsEsp = cuales.map((nombre) => {
    const encontrado = tipoEsp.find((e) => e.nombre === nombre);
    return encontrado ? encontrado.id : null;
  });
  if (idsEsp.includes(null)) {
    alert("No selecciono especialidades");
    return;
  }
  // console.log("Especialidades seleccionadas:", cuales);

  // if (!idCon) {
  //   alert("Debe seleccionar un consultorio");
  // } else {
  //   console.log("Consultorio seleccionado con ID:", idCon);
  //   // Aqui puedes usar `idCon` para enviarlo en un fetch, etc.
  // }
  let sn = document.querySelector('input[name="opc"]:checked');
    if (!sn) {
    alert("Dejo un campo sin contestar");
  } else {
    let siono = sn.value;
    if (siono === "Si" && numEsp==="") {
      errorNoEsp = true;
    }
  }


  if (
    nom == "" || apPat == "" || apMat == "" || fechaNac == "" || tel == "" || contra == "" || user == "" || correo == "" || rfc == "" 
    || errorDias == true || turno == "" || cedula == "" || !idCon || errorNoEsp==true) {
    alert("Dejo un campo sin contestar");
  } else if (cedula.length < 8) {
    alert("Las cedulas medicas deben ser de 8 digitos");
  } else if (!extructRfc.test(rfc) || rfc.length < 12) {
    alert("El RFC que ingreso no cuenta con la estructura corercta de un RFC");
  } else if (errorDias2 == true) {
    alert("Tiene que elegir almenos 5 dias para trabajar");
  } else {
    //busco k no aya algien conla misma cedula
    try {
      const resCed = await fetch("http://localhost:5000/api/buscarCed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula }),
      });
      const dataCed = await resCed.json();
      if (dataCed.encontrado) {
        alert(dataCed.mensaje);
        errorCed = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert("Error al consultar la cedula");
      return;
    }

    //busco k noaya algien con ese rfc
    try {
      const resRfc = await fetch("http://localhost:5000/api/buscarRFC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfc }),
      });
      const dataRfc = await resRfc.json();
      if (dataRfc.encontrado) {
        alert(dataRfc.mensaje);
        errorRFC = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en la solicitud RFC:", err);
      alert("Error al consultar el RFC");
      return;
    }

    //busco k no aya nadie con ese nombre de usuario
    try {
      const resUser = await fetch("http://localhost:5000/api/buscarUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomUser }),
      });
      const DNU = await resUser.json();
      if (DNU.encontrado) {
        alert(DNU.mensaje);
        errorUser = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en buscar nomUser:", err);
      alert("Error al consultar el nomUser");
      return;
    }

    //compruebo k noexistan datos enel sistema
    if (errorCed == true) {
      alert("Ya existe un doctor con esa cedula en el sistema");
    } else if (errorRFC == true) {
      alert("Ya existe alguien con ese rfc en el sistema");
    } else if (errorUser == true) {
      alert("Ya existe alguien con ese usuario en el sistema");
    } else {
      //siono
      siono = document.querySelector('input[name="opc"]:checked').value;

      //asigno las horas k ba a chanbiar los chanbiadores
      if (turno == "Matutino") {
        horaEnt = "05:00";
        horaSal = "14:00";
      } else if (turno == "Vespertino") {
        horaEnt = "14:00";
        horaSal = "23:00";
      }
      //nota: D es por datos, U por usuario, P por paciente, HM de historial medico
      //obtengo el siguiente id de la tabla usuario para sumarle 1
      try {
        const resIdUsr = await fetch("http://localhost:5000/api/sigIdUsr");
        const dataUser = await resIdUsr.json();
        sigIdUser = dataUser.sigIdUser;
        idUser = sigIdUser;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }

      //varuable para ingresar los datos en json del usuario
      let DU = { idUser: sigIdUser,nom,apPat,apMat,fechaNac,tel,contra,nomUser,correo,idTipoUser };

      //aca ingreso los datos del usuario
      try {
        const res1 = await fetch("http://localhost:5000/api/regUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DU),
        });
        const respuesta = await res1.json();
      } catch (err) {
        alert("Error al registrar usuario");
        console.error(err);
      }

      //obtengo el siguiente id de la tabla empleado para sumarle 1
      try {
        const idResEmp = await fetch("http://localhost:5000/api/sigIdEmp");
        const dataEmp = await idResEmp.json();
        sigIdEmp = dataEmp.sigIdEmp;
        idEmp = sigIdEmp;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }
      let tSal = salario + "";
      //bariable para meter datos tipo json
      let DE = { idEmp: sigIdEmp,idUser,salario: tSal,estatus,rfc,idTipoEmp };

      //aca ingreso los datos del empleado
      try {
        const res2 = await fetch("http://localhost:5000/api/regEmp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DE),
        });
        const respuesta = await res2.json();
      } catch (err) {
        alert("Error al registrar empleado");
        console.error(err);
      }

      //obtengo el sigueinte id de la tabla horario para sumarle 1
      try {
        const resIdHora = await fetch("http://localhost:5000/api/sigIdHora");
        const dataHora = await resIdHora.json();
        sigIdHora = dataHora.sigIdHora;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }

      //bariable para meter datos tipo json del orario
      let DH = { idHora: sigIdHora, idEmp, dias, horaEnt, horaSal, turno };

      //aca ingreso los datos de la recep
      try {
        const res3 = await fetch("http://localhost:5000/api/regHora", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DH),
        });
        const respuesta = await res3.json();
      } catch (err) {
        alert("Error al registrar horario");
        console.error(err);
      }

      //yatusae
      let DD = { cedula, idEmp };

      //aca ingreso los datos del doc
      try {
        const res4 = await fetch("http://localhost:5000/api/regDoc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DD),
        });
        const respuesta = await res4.json();
      } catch (err) {
        alert("Error al registrar doctor");
        console.error(err);
      }

      //busco id dela tabla docEsp y le sumo1
      try {
        const idResCE = await fetch("http://localhost:5000/api/sigDocEspId");
        const dataCE = await idResCE.json();
        sigIdDE = dataCE.sigDocEspId;
      } catch (err) {
        console.error("Error al obtener la idCE:", err);
        return;
      }

      if (siono === "No") {
        idEsp = 4; //id basiko
        let DDE = { idDocEsp: sigIdDE, cedula, idEsp, statEsp };
        try {
          const res = await fetch("http://localhost:5000/api/regDocEsp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(DDE),
          });
          const respuesta = await res.json();
        } catch (err) {
          alert("Error al registrar especialidad basica");
          console.error(err);
        }
      } else if (siono === "Si") {
        for (let i = 0; i < idsEsp.length; i++) {
          let DDE = {
            idDocEsp: sigIdDE + i,
            cedula,
            idEsp: idsEsp[i],
            statEsp,
          };
          try {
            const res = await fetch("http://localhost:5000/api/regDocEsp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(DDE),
            });
            const respuesta = await res.json();
          } catch (err) {
            alert(`Error al registrar la especialidad ${idsEsp[i]}`);
            console.error(err);
          }
        }
      }

      //obtengo el siguiente id de la tabla asigCon y lesuma1
      try {
        const idResAC = await fetch("http://localhost:5000/api/sigACId");
        const dataAC = await idResAC.json();
        sigIdAC = dataAC.sigACId;
      } catch (err) {
        console.error("Error al obtener la idAC:", err);
        return;
      }

      //yatusae
      let DAC = { idAsigCon: sigIdAC,cedula,idCon,statCon,horaIn: horaEnt,horaFin: horaSal,dias };

      //aca ingreso los datos del AC
      try {
        const res5 = await fetch("http://localhost:5000/api/regAC", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DAC),
        });
        const respuesta = await res5.json();
      } catch (err) {
        alert("Error al registrar el asigCon");
        console.error(err);
      }

      alert("datos guardados exitosamente");
      window.location.href = "registrar.html";
    }
  }
});

//Aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
const hoy = new Date().toISOString().split("T")[0];
document.getElementById("fechaNac").setAttribute("max", hoy);

//orarrioz fijoz
tur.addEventListener("change", () => {
  const valor = tur.value;
  let texto = "";
  switch (valor) {
    case "Matutino":
      texto = "El turno mañana es de 05:00 a 14:00";
      break;
    case "Vespertino":
      texto = "El turno tarde es de 14:00 a 23:00";
      break;
    default:
      texto = "";
  }
  mensaje.textContent = texto;
});
//comprueba k seleccionen almenos 5 dias d chanba
noDias.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const seleccionados = document.querySelectorAll(
      'input[name="dias"]:checked'
    );
    if (seleccionados.length < 5) {
      errorDias2 = true;
    } else {
      errorDias2 = false;
    }
  });
});

//muestra numeros para elegir la especialidad
const radios = document.querySelectorAll('input[name="opc"]');
noEsp = document.getElementById("cuantas");
radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "Si") {
      noEsp.style.display = "block";
    } else {
      noEsp.style.display = "none";
      document.getElementById("espec").innerHTML = "";
    }
  });
});

//especialidades mostrar
const especialidades = [
  "Cardiologia",
  "Dermatologia",
  "Ginecologia",
  "Nefrologia",
  "Nutriologia",
  "Oftalmologia",
  "Oncologia",
  "Ortopedia",
  "Pediatra",
];

document.getElementById("noEsp").addEventListener("change", function () {
  const cantidad = parseInt(this.value);
  const contenedor = document.getElementById("espec");

  //limpiar las opciones anteriores
  contenedor.innerHTML = "";

  //Crear la cantidad de selects que el usuario eligio
  for (let i = 0; i < cantidad; i++) {
    const label = document.createElement("label");
    label.textContent = `Especialidad ${i + 1}:`;

    const select = document.createElement("select");
    select.name = `especialidad${i + 1}`;
    select.required = true;

    //agrega opsiones
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una especialidad";
    select.appendChild(defaultOption);
    especialidades.forEach((esp) => {
      const option = document.createElement("option");
      option.value = esp;
      option.textContent = esp;
      select.appendChild(option);
    });
    contenedor.appendChild(label);
    contenedor.appendChild(select);
    contenedor.appendChild(document.createElement("br"));
  }
});

//salario kambia
document.getElementById("noEsp").addEventListener("change", () => {
  const valor = document.getElementById("noEsp").value;
  let mensaje = document.getElementById("salario");
  let texto = "";
  if (valor == "") {
    texto = 20000;
  } else {
    texto = valor * 23000;
  }
  salario = texto;
  mensaje.textContent = texto;
});

//aqui hago que el texto se vea o no cuando presionan la opcion otro del campo enfermedade
const rad = document.querySelectorAll('input[name="opc"]');
rad.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "No") {
      document.getElementById("salario").textContent = 20000;
      salario = 20000;
    }
  });
});

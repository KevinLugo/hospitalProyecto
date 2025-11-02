//bariables globales para okupar mas alrato
let idUser;
let zedula;

//constantez globalez para funsiones
let tur = document.getElementById("turno");
let mensaje = document.getElementById("mensajeTurno");
let noDias = document.querySelectorAll('input[name="dias"]');
let errorDias2 = false;
let container = document.getElementById("espec");
let salario = 20000;
document.getElementById("salario").textContent = 20000;

//obtenemos y ponemos la info del doc para modificar
document.addEventListener("DOMContentLoaded", async () => {
  params = new URLSearchParams(window.location.search);
  idUser = params.get("id");
  idUser=parseInt(idUser);
  if (!idUser) {
    alert("No hay sesion iniciada");
    return;
  }
  idUser=parseInt(idUser);
    try {
      const res = await fetch("http://localhost:5000/api/elDoc2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser }),
      });
      const datos = (await res.json())[0];
      zedula=parseInt(datos.cedula);

      //pongo datos del doc
      document.getElementById("cedula").value=datos.cedula;
      document.getElementById("rfc").value=datos.rfc;
      document.getElementById("user").value=datos.nomUser;
      document.getElementById("psw").value=datos.contra;
      document.getElementById("nom").value=datos.nom;
      document.getElementById("apPat").value=datos.apPat;
      document.getElementById("apMat").value=datos.apMat;
      document.getElementById("fechaNac").value=new Date(datos.fechaNac).toISOString().split("T")[0];;
      document.getElementById("correo").value=datos.correo;
      document.getElementById("tel").value=datos.tel;
      if(datos.turno=="Matutino"){
        document.getElementById("turno").value="Matutino";
        mensaje.textContent = "El turno mañana es de 05:00 a 14:00";
      }else if(datos.turno=="Vespertino"){
        document.getElementById("turno").value="Vespertino";
        mensaje.textContent = "El turno tarde es de 14:00 a 23:00";
      }
      //diaz
      if (datos.dias && datos.dias.trim() !== "") {
        //quitar comas y espacios dela kadena
        const dias = datos.dias.split(",").map(v => v.trim());

        //opcsiones del chekbox
        const mapaDias = {
          Lunes: "c1",
          Martes: "c2",
          Miercoles: "c3",
          Jueves: "c4",
          Viernes: "c5",
          Sabado: "c6",
          Domingo: "c7",
        };

        //marcar los checkbos correspondientes
        dias.forEach(v => {
        const idCheckbox = mapaDias[v];
        if (idCheckbox) {
          document.getElementById(idCheckbox).checked = true;
        }
      });

      //especialidades
      const especialidadesTexto = datos.especialidades;
      const listaEspecialidades = especialidadesTexto.split(",").map(e => e.trim());

      const radioNo = document.getElementById("op22");
      const radioSi = document.getElementById("op11");
      const contenedor = document.getElementById("espec");
      const selectNoEsp = document.getElementById("noEsp");

      //limpiamos selects anteriores
      contenedor.innerHTML = "";

      //definimos la variable antes
      let cantidadEspecialidades = 0;

      if (listaEspecialidades.includes("Medicina General")) {
          radioNo.checked = true;
          radioSi.checked = false;

          //ocultamos la seccion de especialidades
          contenedor.style.display = "none";

          cantidadEspecialidades = 1; 
          selectNoEsp.value = cantidadEspecialidades;

      } else {
          radioNo.checked = false;
          radioSi.checked = true;

          contenedor.style.display = "block";

          cantidadEspecialidades = listaEspecialidades.length;
          selectNoEsp.value = cantidadEspecialidades;

          //generamoz selects dinamicos
          for (let i = 0; i < cantidadEspecialidades; i++) {
              const label = document.createElement("label");
              label.textContent = `Especialidad ${i + 1}:`;

              const select = document.createElement("select");
              select.name = `especialidad${i + 1}`;
              select.required = true;

              const defaultOption = document.createElement("option");
              defaultOption.value = "";
              defaultOption.textContent = "Seleccione una especialidad";
              select.appendChild(defaultOption);

              especialidades.forEach((esp) => {
                  const option = document.createElement("option");
                  option.value = esp;
                  option.textContent = esp;
                  if (listaEspecialidades[i] === esp) {
                      option.selected = true;
                  }
                  select.appendChild(option);
              });

              contenedor.appendChild(label);
              contenedor.appendChild(select);
              contenedor.appendChild(document.createElement("br"));

              //bloquea selects generados
              select.disabled = true;
          }
      }

      //ajuzto salarios
      let salarioTexto = "";
      if (cantidadEspecialidades === 0) {
        salarioTexto = 20000;
      } else {
        salarioTexto = cantidadEspecialidades * 23000;
      }
      document.getElementById("salario").textContent = salarioTexto;
    }

    const resp = await fetch("http://localhost:5000/api/consul2",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser }),
      });
    const data = await resp.json();

    const consultorios = data.consul2; //lo enbie del bak aszi
    const select = document.getElementById("consul");

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
    const consultorioActual = datos.noCon;
    const opcion = Array.from(select.options).find(opt => 
      opt.textContent.includes(`Consultorio ${consultorioActual}`)
    );
    if (opcion) opcion.selected = true;
    } catch (err) {
      console.error("Error al obtener los datos del doctor:", err);
      alert("No se pudieron cargar los datos");
    }
});

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

//blokiamos campos
document.getElementById('cedula').disabled = true;
document.getElementById('rfc').disabled = true;
document.getElementById('user').disabled = true;
document.getElementById('psw').disabled = true;
document.getElementById('nom').disabled = true;
document.getElementById('apPat').disabled = true;
document.getElementById('apMat').disabled = true;
document.getElementById('fechaNac').disabled = true;
document.getElementById('correo').disabled = true;
document.getElementById('tel').disabled = true;
document.getElementById('turno').disabled = true;
document.getElementById('c1').disabled = true;
document.getElementById('c2').disabled = true;
document.getElementById('c3').disabled = true;
document.getElementById('c4').disabled = true;
document.getElementById('c5').disabled = true;
document.getElementById('c6').disabled = true;
document.getElementById('c7').disabled = true;
document.getElementById('op11').disabled = true;
document.getElementById('op22').disabled = true;
document.getElementById('noEsp').disabled = true;
document.getElementById('espec').disabled = true;
document.getElementById('consul').disabled = true;
document.getElementById('boton2').disabled = true;

//los desblokiamos si le pika a modifikar
document.getElementById("boton3").addEventListener("click", function () {
  document.getElementById('cedula').disabled = false;
  document.getElementById('rfc').disabled = false;
  document.getElementById('user').disabled = false;
  document.getElementById('psw').disabled = false;
  document.getElementById('nom').disabled = false;
  document.getElementById('apPat').disabled = false;
  document.getElementById('apMat').disabled = false;
  document.getElementById('fechaNac').disabled = false;
  document.getElementById('correo').disabled = false;
  document.getElementById('tel').disabled = false;
  document.getElementById('turno').disabled = false;
  document.getElementById('c1').disabled = false;
  document.getElementById('c2').disabled = false;
  document.getElementById('c3').disabled = false;
  document.getElementById('c4').disabled = false;
  document.getElementById('c5').disabled = false;
  document.getElementById('c6').disabled = false;
  document.getElementById('c7').disabled = false;
  document.getElementById('op11').disabled = false;
  document.getElementById('op22').disabled = false;
  document.getElementById('noEsp').disabled = false;
  document.getElementById('espec').disabled = false;
  document.getElementById('consul').disabled = false;
  document.getElementById('boton2').disabled = false;
  const elementos = document.querySelectorAll("input, select, textarea");
  elementos.forEach(el => el.disabled = false);
});

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

  // Permitir Backspace, Tab, y flechas
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

  //ascci especifikos
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

  //otros ascii
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

  //permito puros numeros
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
  window.location.href = "usuarios.html";
});

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
  //salario;
  let estatus = "activo";
  let rfc = document.getElementById("rfc").value;
  let idTipoEmp = 1;

  //dias
  let horaEnt;
  let horaSal;
  let turno = document.getElementById("turno").value;

  //variables del doc
  let cedula = document.getElementById("cedula").value;
  cedula=parseInt(cedula);
  //idEmp;

  //variables docEsp
  let sigIdDE;
  //cedula;
  let statEsp = "Activo";

  //cedula;
  let idCon = parseInt(document.getElementById("consul").value);
  let statCon = "Activo";

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

      if (dataCed.encontrado && dataCed.datos.cedula!=zedula) {
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
      if (dataRfc.encontrado && dataRfc.datos.idUser!=idUser) {
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
      if (DNU.encontrado && DNU.datos.idUser!=idUser) {
        alert(DNU.mensaje);
        errorUser = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en buscar nomUser:", err);
      alert("Error al consultar el nomUser");
      return;
    }

    //comprubo k noexistan datos enel sistema
    if (errorCed == true) {
      alert("Ya existe un doctor con esa cedula en el sistema");
    } else if (errorRFC == true) {
      alert("Ya existe alguien con ese rfc en el sistema");
    } else if (errorUser == true) {
      alert("Ya existe alguien con ese usuario en el sistema");
    } else {
      //siono
      siono = document.querySelector('input[name="opc"]:checked').value;

      //Asigno las horas k ba a chanbiar los chanbiadores
      if (turno == "Matutino") {
        horaEnt = "05:00";
        horaSal = "14:00";
      } else if (turno == "Vespertino") {
        horaEnt = "14:00";
        horaSal = "23:00";
      }
      //nota: D es por datos, U por usuario, P por paciente, HM de historial medico
      //variable para ingresar los datos en json del usuario
      let DU={ idUser,nom,apPat,apMat,fechaNac,tel,contra,nomUser,correo,idTipoUser }
      //aca ingreso los datos del usuario
      try {
        const res = await fetch("http://localhost:5000/api/infoUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DU),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar usuario");
        console.error(err);
      }

      let tSal = salario + "";
      //bariable para meter datos tipo json
      let DE = { idUser,salario: tSal,estatus,rfc,idTipoEmp };

      //aca ingreso los datos del empleado
      try {
        const res = await fetch("http://localhost:5000/api/infoEmp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DE),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar empleado");
        console.error(err);
      }

      //bariable para meter datos tipo json del orario
      let DH = { idUser, dias, horaEnt, horaSal, turno };

      //aca ingreso los datos del orario
      try {
        const res = await fetch("http://localhost:5000/api/infoHor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DH),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar horario");
        console.error(err);
      }

      //actualiso cedula
      await fetch("http://localhost:5000/api/actCed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser, cedula }),
      });

      //busco id dela tabla docEsp y le sumo1
      try {
        const idResCE = await fetch("http://localhost:5000/api/sigDocEspId");
        const dataCE = await idResCE.json();
        sigIdDE = dataCE.sigDocEspId;
      } catch (err) {
        console.error("Error al obtener la idCE:", err);
        return;
      }

      //obtengo las chanbaz del don para comparar
      const res = await fetch(`http://localhost:5000/api/espDoc/${idUser}`);
      const data = await res.json();
      const actualesStr = data[0]?.especialidades || "";
      const actuales = actualesStr.split(", ").filter(Boolean);
      
      //esp nuevas
      const nuevas = cuales.filter(e => !actuales.includes(e));

      //esp k se ban a borrar
      const eliminadas = actuales.filter(e => !cuales.includes(e));

      if (siono === "No") {
        //kito especialidades prebias
        for (const nombre of actuales) {
          const espObj = tipoEsp.find(e => e.nombre === nombre);
          if (!espObj) continue;
          try {
            await fetch(`http://localhost:5000/api/delDocEsp/${cedula}/${espObj.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cedula, idEsp: espObj.id }),
            });
          } catch (err) {
            console.error(`Error al eliminar ${nombre}:`, err);
          }
        }

        //le pongo medicina general
        const idEsp = 4;
        const DDE = { idDocEsp: sigIdDE, cedula, idEsp, statEsp };

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
        //agrego sus especilidades
        for (let i = 0; i < nuevas.length; i++) {
          const espObj = tipoEsp.find(e => e.nombre === nuevas[i]);
          if (!espObj) continue;

          let DDE = {
            idDocEsp: sigIdDE + i,
            cedula,
            idEsp: espObj.id,
            statEsp,
          };

          try {
            const res = await fetch("http://localhost:5000/api/regDocEsp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(DDE),
            });
            const r = await res.json();
          } catch (err) {
            console.error(`Error al agregar ${nuevas[i]}:`, err);
          }
        }

        //elimina ezpecialidades
        for (const nombre of eliminadas) {
          const espObj = tipoEsp.find(e => e.nombre === nombre);
          if (!espObj) continue;

          try {
            await fetch(`http://localhost:5000/api/delDocEsp/${cedula}/${espObj.id}`, {
              method: "DELETE"
            });
          } catch (err) {
            console.error(`Error al eliminar ${nombre}:`, err);
          }
        }

        //si obtubo nueba especialidad diferente de medicina general se la pongo y le kito med general
        const tieneOtraEsp = cuales.some(e => e !== "Medicina General");
        if (tieneOtraEsp) {
          try {
            await fetch(`http://localhost:5000/api/delDocEsp/${cedula}/4`, {
              method: "DELETE",
            });
          } catch (err) {
            console.error("Error al eliminar Medicina General:", err);
          }
        }
      }

      //yatusae
      let DAC = { cedula,idCon,statCon,horaIn: horaEnt,horaFin: horaSal,dias };

      //aca ingreso los datos del AC
      try {
        const res = await fetch("http://localhost:5000/api/infoAC", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DAC),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar AC");
        console.error(err);
      }
      
      alert("datos guardados exitosamente");
      window.location.href = "usuarios.html";
    }
  }
});

//aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
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

const radioSi = document.getElementById("op11");
const radioNo = document.getElementById("op22");
const selectNoEsp = document.getElementById("noEsp");
const contenedor = document.getElementById("espec");

function generarSelects(cantidad) {
  contenedor.innerHTML = "";
  for (let i = 0; i < cantidad; i++) {
    const label = document.createElement("label");
    label.textContent = `Especialidad ${i + 1}:`;

    const select = document.createElement("select");
    select.name = `especialidad${i + 1}`;
    select.required = true;

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
}

//codigo del raddionbuton
radioSi.addEventListener("change", () => {
  if (radioSi.checked) {
    contenedor.style.display = "block";
    generarSelects(parseInt(selectNoEsp.value));
  }
});

radioNo.addEventListener("change", () => {
  if (radioNo.checked) {
    contenedor.style.display = "none"; //oculta selects si es medisina general
  }
});

//numero d especialidades
selectNoEsp.addEventListener("change", () => {
  if (radioSi.checked) {
    generarSelects(parseInt(selectNoEsp.value));
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

//aki si elije que no se le asigna 20,000 baros de base
const rad = document.querySelectorAll('input[name="opc"]');
rad.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "No") {
      document.getElementById("salario").textContent = 20000;
      salario = 20000;
    }
  });
});
//constante global por si elige otra en nomSeg, alergias, enfermedadesCronicas
//hacer mucho mas grande la parte de antecedentes familiarles porque es muchotexto
//seguir validando caracteres

//valido caracteres constante
const si = [
  // Mayúsculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  // Minúsculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  // Caracteres especiales
  130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233
];

//valido caracteres funcion
function valido(e) {
  const codigo = e.keyCode || e.which;

  // Permitir Backspace, Tab, y flechas
  if ([8, 9, 37, 38, 39, 40].includes(codigo)) return;

  if (!si.includes(codigo)) {
    e.preventDefault();
  }
}
//se lo aplico a todos los textos
document.getElementById("inputNombre").addEventListener("keypress", validarCaracterNombre);


//de buelta al login
document.getElementById("boton1").addEventListener("click", function () {
  window.location.href = "login.html";
});

document.getElementById("boton2").addEventListener("click", async () => {
  //bariables para comprobar errores
  let errorCurp = false;
  let sigIdUser;
  const extructCurp = /^[A-Z]{4}[0-9]{6}[A-Z]{6}[A-Z0-9]{2}$/i;

  //bariables para meter registros en tablas usuario y paciente 
  //nota: D es por datos, U por usuario, P por paciente
  const DU = {
    sigIdUser: null,
    nom: document.getElementById("nom").value,
    apPat: document.getElementById("apPat").value,
    apMat: document.getElementById("apMat").value,
    fechaNac: document.getElementById("fechaNac").value,
    tel: document.getElementById("tel").value,
    contra: document.getElementById("psw").value,
    nomUser: document.getElementById("user").value,
  };
  const DP = {

    sigIdPac: null,
    idUser: DU.sigIdUser,
    tipoSeg: document.getElementById("nom").value,
    estatura: document.getElementById("estatura").value,
    curp: document.getElementById("curp").value
  };

  //aca compruebo que el curp no exista dentro de paciente
  try {
    const resCurp = await fetch("http://localhost:5000/api/buscarCurp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curp }),
    });
    const dataCurp = await resCurp.json();
    if (dataCurp.encontrado) {
      alert(dataCurp.mensaje);
      errorCurp = true;
      return; //si ya existe nos fuimos
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    alert("Error al consultar el CURP.");
    return;
  }

  //comprobacion de errores
  if (DU.nom=="" || DU.apPat=="" || DU.apMat=="" || DU.fechaNac=="" || DU.fechaNac=="" || DU.tel=="" || DU.psw=="" || DU.user=="" 
    || DP.tipoSeg=="" || DP.estatura=="" || DP.curp=="") {
    alert("Dejo un campo sin contestar");
  } else if(!extructCurp.test(DP.curp) || DP.curp.length<18){
    alert("El curp que ingreso no tiene la estructura correcta de un curp");
  }else if(errorCurp==true){
    alert("Ya existe alguien con ese curp en el sistema");
  }else if(DU.tel.length<18){
    alert("El numero telefonico tiene que ser igual a 10 digitos");
  }else {

    //obtengo el siguiente id de la tabla usuario para sumarle 1
    try {
      const resId = await fetch("http://localhost:5000/api/sigIdUsr");
      const dataId = await resId.json();
      const sigIdUser = dataId.sigIdUser;
      console.log("El siguiente idUser es:", sigIdUser);
    } catch (err) {
      console.error("Error al obtener el ID:", err);
      return;
    }

    //aca ingreso los datos del usuario
    try {
      const res = await fetch("http://localhost:5000/api/regUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DU),
      });
      const respuesta = await res.json();
      alert(respuesta.mensaje);
    } catch (err) {
      alert("Error al registrar usuario");
      console.error(err);
    }

    //obtengo el siguiente id de la tabla paciente para sumarle 1
    try {
      const idRes = await fetch("http://localhost:5000/api/sigIdUsr");
      const idData = await idRes.json();
      const sigIdPac = idData.sigIdPac;
      console.log("El siguiente idPac es:", sigIdPac);
      // Puedes usarlo si lo necesitas
    } catch (err) {
      console.error("Error al obtener el ID:", err);
      return;
    }

    //aca ingreso los datos del paciente
    try {
      const res = await fetch("http://localhost:5000/api/regPaciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DP),
      });
      const respuesta = await res.json();
      alert(respuesta.mensaje);
    } catch (err) {
      alert("Error al registrar paciente");
      console.error(err);
    }
    alert("datos guardados (ahora si guardamos)");
  }
});

//Aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
const hoy = new Date().toISOString().split("T")[0];
document.getElementById("fechaNac").setAttribute("max", hoy);

//aqui hago que el texto se vea o no cuando presionan la opcion otro del campo seguro
document.getElementById("nomSeg").addEventListener("change", function () {
  const dato = this.value;
  const campoTexto = document.getElementById("otroTexto");
  if (dato == "otro") {
    campoTexto.style.display = "block";
  } else {
    campoTexto.style.display = "none";
  }
});

//aqui hago que el texto se vea o no cuando presionan la opcion otro del campo alergias
const radios = document.querySelectorAll('input[name="opcion"]');
const campoAlergias = document.getElementById("otroTexto2");
radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "si") {
      campoAlergias.style.display = "block";
    } else {
      campoAlergias.style.display = "none";
    }
  });
});

//aqui hago que el texto se vea o no cuando presionan la opcion otro del campo enfermedades
const rad = document.querySelectorAll('input[name="opc"]');
const campoEnf = document.getElementById("otroTexto3");
rad.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "si") {
      campoEnf.style.display = "block";
    } else {
      campoEnf.style.display = "none";
    }
  });
});

//Aqui junto en un texto las vacunas y las pongo en una sola cadena separada por comas
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const enf = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    )
      .map((checkbox) => checkbox.value)
      .join(", ");
    console.log(`Seleccionados: ${enf}`);
  });
});

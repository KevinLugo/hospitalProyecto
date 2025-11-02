//obtenemoz el tipo d ussuario para ber k permisos le otorgamos
const tipoUsrAc = sessionStorage.getItem("tipoUs");

//constante pal curp
const curpSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  // Mayusculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  // Minusculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,241
];

//funcion paral curp
function valCurp(e) {
  const codigo = e.keyCode || e.which;

  //borrar, tab y flechas
  if ([8, 9, 37, 38, 39, 40].includes(codigo)) return;

  if (!curpSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del usuario y antecedentes fam
function validA(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  //ascii
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

//valido caracteres  del nombre, nombre del seguro, y alergias
function validC(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //otros otros caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  //otro otro ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas de la estatura
function validD(e) {
  const letra = e.key;

  //numero y punto nomas
  const asies = /^[0-9.]$/;

  //otro otro otro ascii
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//valido caracteres namas telefono
function validE(e) {
  const letra = e.key;

  //puro numero
  const asies = /^[0-9]$/;
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//se lo aplico validasiones a todos los testos
document.getElementById("curp").addEventListener("keypress", valCurp);
document.getElementById("user").addEventListener("keypress", validA);
document.getElementById("antes").addEventListener("keypress", validA);
document.getElementById("psw").addEventListener("keypress", validB);
document.getElementById("correo").addEventListener("keypress", validB);
document.getElementById("nom").addEventListener("keypress", validC);
document.getElementById("apPat").addEventListener("keypress", validC);
document.getElementById("apMat").addEventListener("keypress", validC);
document.getElementById("otroTexto").addEventListener("keypress", validC);
document.getElementById("otroTexto2").addEventListener("keypress", validC);
document.getElementById("otroTexto3").addEventListener("keypress", validC);
document.getElementById("estatura").addEventListener("keypress", validD);
document.getElementById("tel").addEventListener("keypress", validE);

//de buelta al login
document.getElementById("boton1").addEventListener("click", function () {
  if(tipoUsrAc=="Empleado" || tipoUsrAc=="Admin"){
    window.location.href = "registrar.html";
  }else if(tipoUsrAc=="null"){
    window.location.href = "login.html";
  }
});

//magia
document.getElementById("boton2").addEventListener("click", async () => {
  //bariables para comprobar errores
  let errorCurp = false;
  let errorAle = false;
  let errorCron = false;
  const extructCurp = /^[A-ZÑ]{4}[0-9]{6}[A-Z]{6}[A-Z0-9]{2}$/i;
  let estaturaSi;
  const regex = /^\d+\.\d{2}$/;
  let errorEst=false;
  let errorUser=false;

  //bariables para meter registros en tablas usuario, paciente y histMed
  let nomSeg = document.getElementById("nomSeg").value;
  let alergiaz = document.querySelector('input[name="opcion"]:checked');
  let enfCron = document.querySelector('input[name="opc"]:checked');
  let ale = "";
  let enf = "";
  let vac;

  vac = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map((checkbox) => checkbox.value)
    .join(", ");

  if (!vac) {
    vac = "No tiene";
  }

  //variables usuario
  let sigIdUser;
  let nom=document.getElementById("nom").value;
  let apPat=document.getElementById("apPat").value;
  let apMat=document.getElementById("apMat").value;
  let fechaNac= document.getElementById("fechaNac").value;
  let tel= document.getElementById("tel").value;
  let contra= document.getElementById("psw").value;
  let nomUser= document.getElementById("user").value;
  let correo= document.getElementById("correo").value;
  let idTipoUser= 12;

  //variables del paciente
  let sigIdPac;
  let idUser;
  let tipoSeg=document.getElementById("nomSeg").value;
  let estatura=document.getElementById("estatura").value;
  let curp=document.getElementById("curp").value;

  //variables del histMed
  let sigIdHist;
  let idPac;
  let tipoSangre= document.getElementById("tipoSangre").value;
  let alergias= ale;
  let vacunas= vac;
  let enferCron= enf;
  let anteFam = document.getElementById("antes").value;

  //comprobacion de errores
  if (nomSeg == "otro") {
    nomSeg = document.getElementById("otroTex").value;
    tipoSeg= nomSeg;
  }

  if (!alergiaz) {
    errorAle = true;
  }else{
    ale=alergiaz.value;
    if(ale=="si"){
      ale=document.getElementById("otroTex2").value;
      if(ale==""){
        errorAle=true;
      }
    }
  }

  if (!enfCron) {
    errorCron = true;
  }else{
    enf=enfCron.value
    if(enf=="si"){
      enf=document.getElementById("otroTex3").value;
      if(enf==""){
        errorCron=true;
      }
    }
  }

  //le pongo m al final de la estatura para k se guarde asi enla base y comprueba k tenga el formato
  estaturaSi=estatura.trim();
  if (regex.test(estaturaSi)) {
    estatura= estaturaSi + "m";
  }else{
    errorEst=true;
  }
  if(nom == "" || apPat == "" || apMat == "" || fechaNac == "" || tel == "" || contra == "" || user == "" || correo == "" || tipoSeg == "" 
    || estatura == "" || curp == "" || tipoSangre == "" || anteFam  == "" || errorCron == true ||errorAle == true) {
    alert("Dejo un campo sin contestar");
  } else if(errorEst==true){
    alert("La estatura debe tener el formato correcto, ejemplo: 1.75");
  } else if (tel.length <10) {
    alert("El numero telefonico tiene que ser igual a 10 digitos");
  } else if (!extructCurp.test(curp) || curp.length < 18) {
    alert("El curp que ingreso no tiene la estructura correcta de un curp");
  } else {
    //aca le pongo a las bariables k boia meter los valores k ya obtuve
    enferCron = enf; 
    alergias=ale;
    //busco k no aya algien conel mismo kurp
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
      alert("Error al consultar el CURP");
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

    //comprubo k noexistan datos enel sistema
    if (errorCurp == true) {
      alert("Ya existe alguien con ese curp en el sistema");
    } else if(errorUser==true){
      alert("Ya existe alguien con ese usuario en el sistema");
    } else{
      //nota: D es por datos, U por usuario, P por paciente, HM de historial medico 
      //obtengo el siguiente id de la tabla usuario para sumarle 1
      try {
        const resId = await fetch("http://localhost:5000/api/sigIdUsr");
        const dataUser = await resId.json();
        sigIdUser = dataUser.sigIdUser;
        idUser = sigIdUser;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }
      //varuable para ingresar los datos en json del usuario
      let DU={ idUser: sigIdUser,nom,apPat,apMat, fechaNac,tel,contra,nomUser,correo,idTipoUser }
      //aca ingreso los datos del usuario
      try {
        const res = await fetch("http://localhost:5000/api/regUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DU),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al registrar usuario");
        console.error(err);
      }

      //obtengo el siguiente id de la tabla paciente para sumarle 1
      try {
        const idRes = await fetch("http://localhost:5000/api/sigIdPac");
        const dataPac = await idRes.json();
        sigIdPac = dataPac.sigIdPac;
        idPac = sigIdPac;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }

      //creo el json para meterlo en paciente
      let DP = { idPac: sigIdPac,idUser,tipoSeg,estatura,curp };

      //aca ingreso los datos del paciente
      try {
        const res = await fetch("http://localhost:5000/api/regPaciente", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DP),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al registrar paciente");
        console.error(err);
      }

      //obtengo el siguiente id de la tabla histMed para sumarle 1
      try {
        const resId = await fetch("http://localhost:5000/api/sigIdHistMed");
        const dataHist= await resId.json();
        sigIdHist = dataHist.sigIdHistMed;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }
      //yatusae
      let DHM = { idHistMed: sigIdHist,idPac,tipoSangre,alergias,vacunas,enferCron,anteFam };

      //aca ingreso los datos del historial med
      try {
        const res = await fetch("http://localhost:5000/api/regHistMed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DHM),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al registrar histo Med");
        console.error(err);
      }
      alert("Datos guardados exitosamente");
      if(tipoUsrAc=="Empleado" || tipoUsrAc=="Admin"){
        window.location.href = "registrar.html";
      }else if(tipoUsrAc=="null"){
        window.location.href = "login.html";
      }
    }
  }   
});

//aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
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
    document.getElementById("otroTex").value="";
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
      document.getElementById("otroTex2").value="";
    }
  });
});

//aqui hago que el texto se vea o no cuando presionan la opcion otro del campo enfermedade
const rad = document.querySelectorAll('input[name="opc"]');
const campoEnf = document.getElementById("otroTexto3");
rad.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "si") {
      campoEnf.style.display = "block";
    } else {
      campoEnf.style.display = "none";
      document.getElementById("otroTex3").value="";
    }
  });
});

//Aqui junto en un texto las vacunas y las pongo en una sola cadena separada por comas
// document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
//   checkbox.addEventListener("change", () => {
//     vac = Array.from(
//       document.querySelectorAll('input[type="checkbox"]:checked')
//     )
//       .map((checkbox) => checkbox.value)
//       .join(", ");
//     console.log(`Seleccionados: ${vac}`);
//   });
// });

//bariables globales para okupar mas alrato
let params;
let idUser;

//obtenemos y ponemos la info del pasiente para modificar
document.addEventListener("DOMContentLoaded", async () => {
  params = new URLSearchParams(window.location.search);
  idUser = params.get("id");
  idUser=parseInt(idUser);
    if (!idUser) {
      alert("No hay sesion iniciada");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/elPac2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser }),
      });
      const datos = (await res.json())[0];

      //pongo datos del pac
      document.getElementById("curp").value=datos.curp;
      document.getElementById("user").value=datos.nomUser;
      document.getElementById("psw").value=datos.contra;
      document.getElementById("nom").value=datos.nom;
      document.getElementById("apPat").value=datos.apPat;
      document.getElementById("apMat").value=datos.apMat;
      document.getElementById("fechaNac").value=new Date(datos.fechaNac).toISOString().split("T")[0];;
      document.getElementById("correo").value=datos.correo;
      document.getElementById("tel").value=datos.tel;
      document.getElementById("estatura").value=datos.estatura.replace("m", "");
      if(datos.tipoSeg=="ISSEMYM"){
        document.getElementById("nomSeg").value="ISSEMYM";
      }else if(datos.tipoSeg=="ISSSTE"){
        document.getElementById("nomSeg").value="ISSSTE";
      }else if(datos.tipoSeg=="Ninguno"){
        document.getElementById("nomSeg").value="Ninguno";
      }else{
        document.getElementById("nomSeg").value="otro";
        document.getElementById("otroTex").value=datos.tipoSeg;
        document.getElementById("otroTexto").style.display = "block";
      }
      if(datos.alergias=="No"){
        document.getElementById("op2").checked=true;
      }else{
        document.getElementById("op1").checked=true;
        document.getElementById("otroTex2").value=datos.alergias;
        document.getElementById("otroTexto2").style.display = "block";
      }
      document.getElementById("tipoSangre").value=datos.tipoSangre;
      document.getElementById("antes").value=datos.anteFam;

      if(datos.enferCron=="No"){
        document.getElementById("op22").checked=true;
      }else{
        document.getElementById("op11").checked=true;
        document.getElementById("otroTex3").value=datos.enferCron;
        document.getElementById("otroTexto3").style.display = "block";
      }
      //bacunas
      if (datos.vacunas && datos.vacunas.trim() !== "") {
        //quitar comas y espacios dela kadena
        const vacunas = datos.vacunas.split(",").map(v => v.trim().toLowerCase());

        //opcsiones del chekbox
        const mapaVacunas = {
          bgc: "c1",
          hepatitisb: "c2",
          sabin: "c3",
          rotavirus: "c4",
          tripleviral: "c5",
          neumococo: "c6",
          pentavaliente: "c7",
          influenza: "c8",
          vph: "c9",
          hepatitisa: "c10",
          covid19: "c11"
        };

        //marcar los checkbos correspondientes
        vacunas.forEach(v => {
        const idCheckbox = mapaVacunas[v];
        if (idCheckbox) {
          document.getElementById(idCheckbox).checked = true;
        }
      });
    }
    } catch (err) {
      console.error("Error al obtener los datos del paciente:", err);
      alert("No se pudieron cargar los datos");
    }
});

//blokiamos campos
document.getElementById('curp').disabled = true;
document.getElementById('user').disabled = true;
document.getElementById('psw').disabled = true;
document.getElementById('nom').disabled = true;
document.getElementById('apPat').disabled = true;
document.getElementById('apMat').disabled = true;
document.getElementById('fechaNac').disabled = true;
document.getElementById('correo').disabled = true;
document.getElementById('tel').disabled = true;
document.getElementById('estatura').disabled = true;
document.getElementById('nomSeg').disabled = true;
document.getElementById('otroTex').disabled = true;
document.getElementById('tipoSangre').disabled = true;
document.getElementById('op1').disabled = true;
document.getElementById('op2').disabled = true;
document.getElementById('otroTex2').disabled = true;
document.getElementById('antes').disabled = true;
document.getElementById('c1').disabled = true;
document.getElementById('c2').disabled = true;
document.getElementById('c3').disabled = true;
document.getElementById('c4').disabled = true;
document.getElementById('c5').disabled = true;
document.getElementById('c6').disabled = true;
document.getElementById('c7').disabled = true;
document.getElementById('c8').disabled = true;
document.getElementById('c9').disabled = true;
document.getElementById('c10').disabled = true;
document.getElementById('c11').disabled = true;
document.getElementById('op11').disabled = true;
document.getElementById('op22').disabled = true;
document.getElementById('otroTex3').disabled = true;
document.getElementById('boton2').disabled = true;

//los desblokiamos si le pika a modifikar
document.getElementById("boton3").addEventListener("click", function () {
  document.getElementById('curp').disabled = false;
  document.getElementById('user').disabled = false;
  document.getElementById('psw').disabled = false;
  document.getElementById('nom').disabled = false;
  document.getElementById('apPat').disabled = false;
  document.getElementById('apMat').disabled = false;
  document.getElementById('fechaNac').disabled = false;
  document.getElementById('correo').disabled = false;
  document.getElementById('tel').disabled = false;
  document.getElementById('estatura').disabled = false;
  document.getElementById('nomSeg').disabled = false;
  document.getElementById('otroTex').disabled = false;
  document.getElementById('tipoSangre').disabled = false;
  document.getElementById('op1').disabled = false;
  document.getElementById('c2').disabled = false;
  document.getElementById('op2').disabled = false;
  document.getElementById('otroTex2').disabled = false;
  document.getElementById('antes').disabled = false;
  document.getElementById('c1').disabled = false;
  document.getElementById('c3').disabled = false;
  document.getElementById('c4').disabled = false;
  document.getElementById('c5').disabled = false;
  document.getElementById('c6').disabled = false;
  document.getElementById('c7').disabled = false;
  document.getElementById('c8').disabled = false;
  document.getElementById('c9').disabled = false;
  document.getElementById('c10').disabled = false;
  document.getElementById('c11').disabled = false;
  document.getElementById('op11').disabled = false;
  document.getElementById('op22').disabled = false;
  document.getElementById('otroTex3').disabled = false;
  document.getElementById('boton2').disabled = false;
});

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

  //otros ascii
  const codSi = [43, 45, 46, 95];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del nombre, nombre del seguro, y alergias
function validC(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //mas caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  //mas ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas de la estatura
function validD(e) {
  const letra = e.key;

  //permito puros numeros y puntoz
  const asies = /^[0-9.]$/;
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
  window.location.href = "usuarios.html";
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
  let tipoSeg=document.getElementById("nomSeg").value;
  let estatura=document.getElementById("estatura").value;
  let curp=document.getElementById("curp").value;

  //variables del histMed
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
      if (dataCurp.encontrado && dataCurp.datos.idUser!=idUser) {
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
    if (errorCurp == true) {
      alert("Ya existe alguien con ese curp en el sistema");
    } else if(errorUser==true){
      alert("Ya existe alguien con ese usuario en el sistema");
    } else{
      //nota: D es por datos, U por usuario, P por paciente, HM de historial medico 
      //varuable para ingresar los datos en json del usuario
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

      //creo el json para meterlo en paciente
      let DP = { idUser,tipoSeg,estatura,curp };
      
      //aca ingreso los datos del paciente
      try {
        const res = await fetch("http://localhost:5000/api/infoPac", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DP),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar paciente");
        console.error(err);
      }
      //yatusae
      let DHM = { idUser,tipoSangre,alergias,vacunas,enferCron,anteFam };

      //aca ingreso los datos del historial med
      try {
        const res = await fetch("http://localhost:5000/api/infoHM", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DHM),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar histo Med");
        console.error(err);
      }
      alert("Datos modificados exitosamente");
      window.location.href = "usuarios.html";
    }
  }   
});

//aki pongo que la fecha maxima de nacimiento sea hoy y no el 2085
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

//aki hago que el texto se vea o no cuando presionan la opcion otro del campo alergias
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

//aki hago que el texto se vea o no cuando presionan la opcion otro del campo enfermedade
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
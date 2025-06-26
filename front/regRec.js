//constantez globalez para funsiones
let tur=document.getElementById("turno");
let mensaje = document.getElementById('mensajeTurno');
let noDias=document.querySelectorAll('input[name="dias"]');
let errorDias2=false;

//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  // Mayúsculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  // Minúsculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,241
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

  // Permitir letras, acentos, ñ, números del 1 al 9, arroba, etc.
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  // También permitimos códigos ASCII específicos:
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del correo y contra
function validB(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  // Permitir letras, ñ, números del 1 al 9, arroba, etc.
  const asies = /^[a-zA-ZñÑ@0-9]$/;

  // También permitimos codigos ASCII específicos:
  const codSi = [43, 45, 46, 95];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del nombre
function validC(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  // Permitir letras, acentos, ñ, etc.
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  // También permitimos códigos ASCII específicos:
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas telefono
function validD(e) {
  const letra = e.key;

  // permito puros numeros
  const asies = /^[0-9]$/;

  // También permitimos códigos ASCII específicos:
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

//pal lobi
document.getElementById("boton1").addEventListener("click", function () {
    window.location.href = "login.html";
});

document.getElementById("boton2").addEventListener("click", async () => {
  //bariables para comprobar errores
  let errorRFC = false;
  const extructRfc = /^[A-ZÑ]{4}[0-9]{6}[A-Z0-9]{2,3}$/i;
  let errorUser=false;
  let errorDias=false;
  let dias = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map((checkbox) => checkbox.value).join(",");
  if(!dias){
    errorDias=true;
  }

  //bariables para meter registros en tablas usuario, empleado y recep
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
  let idTipoUser= 22;

  //variables del empleado
  let sigIdEmp;
  let idUser;
  let salario="8500";
  let estatus="activo";
  let rfc=document.getElementById("rfc").value;
  let idTipoEmp=2;

  //variables horario
  let sigIdHora;
  let idEmp;
  //dias
  let horaEnt;
  let horaSal;
  let turno=document.getElementById("turno").value;

  //variables de la recep
  let sigIdRecep;
  //idEmp;

  //komprobamos errores
  if(nom == "" || apPat == "" || apMat == "" || fechaNac == "" || tel == "" || contra == "" || user == "" || correo == "" || rfc==""
    || errorDias==true || turno=="") {
    alert("Dejo un campo sin contestar");
  } else if (!extructRfc.test(rfc) || rfc.length < 12) {
    alert("El RFC que ingreso no cuenta con la estructura corercta de un RFC");
  } else  if(errorDias2==true){
    alert("Tiene que elegir almenos 5 dias para trabajar");
  } else  {
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
      alert("Error al consultar el RFC.");
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
      alert("Error al consultar el nomUser.");
      return;
    }

    //comprubo k noexistan datos enel sistema
    if (errorRFC == true) {
      alert("Ya existe alguien con ese rfc en el sistema");
    } else if(errorUser==true){
      alert("Ya existe alguien con ese usuario en el sistema");
    } else{
      //Asigno las horas k ba a chanbiar los chanbiadores
      if(turno=="Matutino"){
        horaEnt="05:00";
        horaSal="14:00";
      }else if(turno=="Vespertino"){
        horaEnt="14:00";
        horaSal="23:00";
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
      let DU={ idUser: sigIdUser,nom,apPat,apMat,fechaNac,tel,contra,nomUser,correo,idTipoUser }

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
      
      //bariable para meter datos tipo json
      let DE={ idEmp: sigIdEmp,idUser,salario,estatus,rfc,idTipoEmp}
    
      //aca ingreso los datos del empleado
      try {
        const res2 = await fetch("http://localhost:5000/api/regEmp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DE),
        });
        const respuesta = await res2.json();
      } catch (err) {
        alert("Error al registrar usuario");
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
      
      //bariable para meter datos tipo json
      let DH={ idHora:sigIdHora,idEmp,dias,horaEnt,horaSal,turno}
      
      //aca ingreso los datos de la ora
      try {
        const res3 = await fetch("http://localhost:5000/api/regHora", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DH),
        });
       const text = await res3.text(); // obtenemos el texto bruto
      if (!res3.ok) {
        throw new Error(`Error HTTP ${res3.status}: ${text}`);
      }
      const respuesta = JSON.parse(text); // lo parseamos manualmente
      console.log(respuesta);
      } catch (err) {
        alert("Error al registrar horario");
        console.error(err);
      }

      //obtengo el siguiente id de la tabla recep para sumarle 1
      try {
        const idResRec = await fetch("http://localhost:5000/api/sigIdRecep");
        const dataRec = await idResRec.json();
        sigIdRecep = dataRec.sigIdRecep;
      } catch (err) {
        console.error("Error al obtener el ID:", err);
        return;
      }
      
      //yatusae
      let DR={ idRecep: sigIdRecep,idEmp}
    
      //aca ingreso los datos de la recep
      try {
        const res4 = await fetch("http://localhost:5000/api/regRecep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DR),
        });
        const respuesta = await res4.json();
      } catch (err) {
        alert("Error al registrar usuario");
        console.error(err);
      }
      alert("datos guardados exitosamente");
      window.location.href = "login.html";
    }
  }
});

//Aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
const hoy = new Date().toISOString().split("T")[0];
document.getElementById("fechaNac").setAttribute("max", hoy);


//orarrioz fijoz
tur.addEventListener('change', () => {
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
  noDias.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const seleccionados = document.querySelectorAll('input[name="dias"]:checked');
      if(seleccionados.length<5){
        errorDias2=true;
      }else{
        errorDias2=false;
      }
    });
  });
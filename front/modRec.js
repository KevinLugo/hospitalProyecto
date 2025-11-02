//bariables globales para okupar mas alrato
let idUser;

//constantez globalez para funsiones
let tur=document.getElementById("turno");
let mensaje = document.getElementById('mensajeTurno');
let noDias=document.querySelectorAll('input[name="dias"]');
let errorDias2=false;

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
      const res = await fetch("http://localhost:5000/api/laRec2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser }),
      });
      const datos = (await res.json())[0];
      zedula=parseInt(datos.cedula);
      //pongo datos de la recep
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
    }
   } catch (err) {
      console.error("Error al obtener los datos de la recepcionista:", err);
      alert("No se pudieron cargar los datos");
    }
});

//blokiamos campos
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
document.getElementById('boton2').disabled = true;

//los desblokiamos si le pika a modifikar
document.getElementById("boton3").addEventListener("click", function () {
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
  document.getElementById('boton2').disabled = false;
});

//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  //mayusculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  //minusculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,241
];

//funcion paral rfc
function valRfc(e) {
  const codigo = e.keyCode || e.which;

  //borrar,tab y flechas
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

//pal lobi
document.getElementById("boton1").addEventListener("click", function () {
    window.location.href = "usuarios.html";
});

//magia
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
  let salario="8500";
  let estatus="activo";
  let rfc=document.getElementById("rfc").value;
  let idTipoEmp=2;

  //dias
  let horaEnt;
  let horaSal;
  let turno=document.getElementById("turno").value;

  //komprobamos errores
  if (nom == "" || apPat == "" || apMat == "" || fechaNac == "" || tel == "" || contra == "" || user == "" || correo == "" || rfc == "" 
    || errorDias == true || turno == "") {
    alert("Dejo un campo sin contestar");
  } else if (!extructRfc.test(rfc) || rfc.length < 12) {
    alert("El RFC que ingreso no cuenta con la estructura corercta de un RFC");
  } else if (errorDias2 == true) {
    alert("Tiene que elegir almenos 5 dias para trabajar");
  } else {
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
    if (errorRFC == true) {
      alert("Ya existe alguien con ese rfc en el sistema");
    } else if (errorUser == true) {
      alert("Ya existe alguien con ese usuario en el sistema");
    } else {
      //asigno las horas k ba a chanbiar los chanbiadores
      if (turno == "Matutino") {
        horaEnt = "05:00";
        horaSal = "14:00";
      } else if (turno == "Vespertino") {
        horaEnt = "14:00";
        horaSal = "23:00";
      }
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
      alert("datos actualizados exitosamente");
      window.location.href = "usuarios.html";
    }
  }
});

//aqui pongo que la fecha maxima de nacimiento sea hoy y no el 2085
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
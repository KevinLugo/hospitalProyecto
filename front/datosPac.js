//bariables globales
let idUser;

(async function () {
//aca obttuve la id desde el login
idUser = sessionStorage.getItem("idUsuario");
if (!idUser) {
  alert("No hay sesion activa. Por favor inicia sesion.");
  throw new Error("idUsuario no esta definido");
}
idUser=parseInt(idUser);
//aca le pongo sus datos al paciente
try {
      const res = await fetch("http://localhost:5000/api/elPac2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser }),
      });

  const data = await res.json();
  const datos=data[0];

  const nombreCompleto = `${datos.nom} ${datos.apPat} ${datos.apMat}`;
  document.getElementById("nombre").textContent = nombreCompleto;
  document.getElementById("curp").textContent = datos.curp;
  document.getElementById("usuario").value=datos.nomUser;
  document.getElementById("contra").value=datos.contra;    
  document.getElementById("tel").value=datos.tel;    
  document.getElementById("correo").value=datos.correo;
  document.getElementById("tipoSeg").textContent = datos.tipoSeg;
  document.getElementById("estatura").textContent = datos.estatura;
  document.getElementById("fechaNac").textContent = new Date(datos.fechaNac).toLocaleDateString();
  document.getElementById("tipoSan").textContent = datos.tipoSangre;
  document.getElementById("ale").textContent = datos.alergias;
  document.getElementById("vac").textContent = datos.vacunas;
  document.getElementById("enferCron").textContent = datos.enferCron;
  document.getElementById("anteFam").textContent = datos.anteFam;
} catch (err) {
  console.error("Error en la solicitud:", err);
  alert("Error al consultar los datos del pac");
}
})();

//valido caracteres  del usuario
function validA(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //permite algunos karacteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  //y tambien algunos ascii especifikos
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del correo y contra
function validB(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //pérmite caracteres diferentes
  const asies = /^[a-zA-ZñÑ@0-9]$/;

  //y ascii diferentes
  const codSi = [43, 45, 46, 95];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas tel
function validC(e) {
  const letra = e.key;

  //es pal telefono
  const asies = /^[0-9]$/;

  //nel
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//le aplico validasiones a todos los testos
document.getElementById("usuario").addEventListener("keypress", validA);
document.getElementById("contra").addEventListener("keypress", validB);
document.getElementById("correo").addEventListener("keypress", validB);
document.getElementById("tel").addEventListener("keypress", validC);


//blokiamos kampos
document.getElementById('usuario').disabled = true;
document.getElementById('contra').disabled = true;
document.getElementById('correo').disabled = true;
document.getElementById('tel').disabled = true;
document.getElementById('boton2').disabled = true;

//los desblokiamos si le pika a modifikar
document.getElementById("boton1").addEventListener("click", function () {
  document.getElementById('usuario').disabled = false;
  document.getElementById('contra').disabled = false;
  document.getElementById('tel').disabled = false;
  document.getElementById('correo').disabled = false;
  document.getElementById('boton2').disabled = false;

});

document.getElementById("boton2").addEventListener("click", async () => {
  let errorUser=false;
  let user= document.getElementById("usuario").value;
  let contra= document.getElementById("contra").value;
  let tel= document.getElementById("tel").value;
  let correo= document.getElementById("correo").value;
  if(user == "" || correo == "" ||tel == "" || contra == ""){
    alert("Dejo un campo sin contestar");
  }else if (tel.length <10) {
    alert("El numero telefonico tiene que ser igual a 10 digitos");
  }else{
  //busco k no aya nadie con ese nombre de usuario
    try {
      const resUser = await fetch("http://localhost:5000/api/buscarUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomUser:user }),
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
    if(errorUser==true){
      alert("Ya existe alguien con ese usuario en el sistema");
    } else{

      let DU={ idUser,nomUser:user,contra,correo,tel }

      //aca ingreso los datos del usuario
      try {
        const res = await fetch("http://localhost:5000/api/changeDU", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DU),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al actualizar informacion");
        console.error(err);
      }
      alert("Los datos se actualizaron correctamente");
      location.reload();
    }
  }
});
document.getElementById("boton1").addEventListener("click", function () {
    window.location.href = "login.html";
});

document.getElementById("boton2").addEventListener("click", function () {
  const curp = document.getElementById("curp").value;
  
  //aca compruebo que el curp no exista dentro de paciente

  //obtengo el siguiente id para sumarle 1
  fetch("http://localhost:5000/api/sigIdUsr")
    .then(res => res.json())
    .then(data => {
      const siguienteId = data.siguienteId;
      console.log("El siguiente idUser es:", siguienteId);

      // Puedes guardarlo en una variable global, mostrarlo en pantalla o rellenar un campo:
      // document.getElementById("idUserInput").value = siguienteId;
    })
    .catch(err => console.error("Error:", err));

  //aca ingreso los datos del usuario

  //aca ingreso los datos del paciente

  alert(`tu curp es ${curp}`);
  alert("datos guardados (no guardamos nada)");
});

const hoy = new Date().toISOString().split('T')[0];
document.getElementById('fechaNac').setAttribute('max', hoy);

document.getElementById("nomSeg").addEventListener("change", function () {
    const dato = this.value;
    const campoTexto = document.getElementById("otroTexto");
    if (dato=="otro") {
        campoTexto.style.display = "block";
    } else {
        campoTexto.style.display = "none";
    }
});
const  radios = document.querySelectorAll('input[name="opcion"]');
  const campoAlergias = document.getElementById('otroTexto2');

  radios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'si') {
        campoAlergias.style.display = 'block';
      } else {
        campoAlergias.style.display = 'none';
      }
    });
  });

  const  rad = document.querySelectorAll('input[name="opc"]');
  const campoEnf = document.getElementById('otroTexto3');

  rad.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'si') {
        campoEnf.style.display = 'block';
      } else {
        campoEnf.style.display = 'none';
      }
    });
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const enf = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                                .map(checkbox => checkbox.value)
                                .join(', ');
      console.log(`Seleccionados: ${enf}`);
    });
  });
  
document.getElementById("boton1").addEventListener("click", function () {
    const us = document.getElementById("user").value;
    const contra = document.getElementById("psw").value;
    if(us!=null && contra!=null){
        alert("¡Bienvenido!");
        window.location.href = "paciente.html"; // Redirige a otra página
    }else{
        alert("kepaso maistro?");
    }

});
document.getElementById("boton2").addEventListener("click", function () {
    window.location.href = "regPac.html"; // Redirige a otra página
});
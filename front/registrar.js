let tipoUsrAc = sessionStorage.getItem("tipoUs");

document.addEventListener("DOMContentLoaded", () => {
    let color;
    if(tipoUsrAc === "Admin") {
        color = "#9132bb";
    } else if(tipoUsrAc === "Empleado") {
        color = "#3cb371";
    }

    //kambia el color del nav
    const nav = document.querySelector("nav");
    nav.style.backgroundColor = color;

    //cambia el color de otras cosas
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.style.border = `2px solid ${color}`;

        card.addEventListener("mouseenter", () => {
            card.style.backgroundColor = color;
            card.style.color = "white";
        });
        card.addEventListener("mouseleave", () => {
            card.style.backgroundColor = "white";
            card.style.color = "black";
        });
    });

    //kambia el color del boton
    const btnRegresar = document.getElementById("btn1");
    btnRegresar.style.borderColor = color;
});


document.getElementById("btn1").addEventListener("click", (e) => {
    e.preventDefault();//es para k el a no haga su funcion normal
    if (tipoUsrAc=="Admin") {
      window.location.href = "vistaAdm.html";
    } else if(tipoUsrAc=="Empleado"){
      window.location.href = "vistaRec.html";
    }
  });
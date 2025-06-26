const params = new URLSearchParams(window.location.search);
const idUser = params.get("id");

console.log("ID del paciente para las citas:", idUser);
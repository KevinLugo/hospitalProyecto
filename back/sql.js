import {cn,mssql} from "./index.js";

const getUsr = async() =>{
    try {
        const pool=await cn();
        const result=await pool.request().query("select idUser, nom, apPat, apMat, edad, tel, contra, nomUser from usuario");
        console.log(result);
        console.log("usuarios encontrados");
    } catch (error) {
        console.error(error);
    }
}

const addUsr = async () => {
    try {
        const pool = await cn();
        const result = await pool.request()
            .input("idUser", mssql.Int, 1)
            .input("nom", mssql.VarChar, "pablito")
            .input("apPat", mssql.VarChar, "mendez")
            .input("apMat", mssql.VarChar, "mendoza")
            .input("edad", mssql.Int, 2)
            .input("tel", mssql.Int, 55)
            .input("contra", mssql.VarChar, "123")
            .input("nomUser", mssql.VarChar, "pablitoGeimer")
            .query(`INSERT INTO usuario(idUser, nom, apPat, apMat, edad, tel, contra, nomUser)
                VALUES (@idUser, @nom, @apPat, @apMat, @edad, @tel, @contra, @nomUser)`);

        console.log("Usuario insertado:", result);
    } catch (error) {
        console.error("Error al insertar usuario:", error);
    }
};
getUsr();//con este se hace un select para buscar a todos los usuarios
//addUsr(); con este se agregaria el usuario

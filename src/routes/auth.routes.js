//ENRUTADOR PARA MANEJAR AUTENTICACION DE USUARIOS
const express = require("express");
const { register, login, getAllUsers, deleteUsers } = require("../controllers/auth.controller");

const router = express.Router();

//LLEGO CON /AUTH - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.delete("/user/:id", deleteUsers) //RUTA PARAMETRIZAEDA PARA BORRAR USUARIOS

module.exports = router;
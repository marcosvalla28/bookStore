//ENRUTADOR PARA MANEJAR AUTENTICACION DE USUARIOS
const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

//LLEGO CON /AUTH - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints

router.post("/register", register);
router.post("/login", login);

module.exports = router;
//ENRUTADOR PARA MANEJAR AUTENTICACION DE USUARIOS
const express = require("express");
const { register, login, getAllUsers, deleteUsers, userRol } = require("../controllers/auth.controller");
const { validateRegister } = require("../middlewares/auth.validator");

const router = express.Router();

//LLEGO CON /AUTH - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints
router.post("/register", validateRegister, register);
router.get("/users", getAllUsers);
router.post("/login", login);
router.delete("/user/:id", deleteUsers) //RUTA PARAMETRIZAEDA PARA BORRAR USUARIOS
router.patch("/role/:id", userRol) //ruta parametrizda para actualizar el rol del usuario


module.exports = router;
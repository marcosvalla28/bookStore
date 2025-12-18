//ENRUTADOR PARA MANEJAR AUTENTICACION DE USUARIOS
const express = require("express");
const { register, login, getAllUsers, deleteUsers, userRol } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validateUserId, validateUpdateRole, validateSuperAdmin } = require("../middlewares/validator");

const router = express.Router();

//LLEGO CON /AUTH - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints
router.post("/register", validateRegister, register);
router.get("/users/:id", validateSuperAdmin, getAllUsers);
router.post("/login", validateLogin, login);
router.delete("/user/:id", validateUserId , deleteUsers) //RUTA PARAMETRIZAEDA PARA BORRAR USUARIOS
router.patch("/role/:id", validateUserId, validateUpdateRole, userRol) //ruta parametrizda para actualizar el rol del usuario


module.exports = router;
//ENRUTADOR PARA MANEJAR AUTENTICACION DE USUARIOS
const express = require("express");
const { register, login, getAllUsers, deleteUsers, userRol, verifyEmail, logout } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validateUserId, validateUpdateRole, validateSuperAdmin, validateVerifyEmail } = require("../middlewares/validator");
const { uploadProfile } = require("../config/multer");

const router = express.Router();

//LLEGO CON /AUTH - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints

//ENDPOINTS PUBLICOS
router.post("/register", uploadProfile , validateRegister, register);
router.post("/verify-email", validateVerifyEmail , verifyEmail)
router.post("/login", validateLogin, login);


//ENDPOINTS PRIVADOS
router.post("/logout", logout)
router.get("/users/:id", validateSuperAdmin, getAllUsers);
router.delete("/user/:id", validateUserId , deleteUsers) //RUTA PARAMETRIZAEDA PARA BORRAR USUARIOS
router.patch("/role/:id", validateUserId, validateUpdateRole, userRol) //ruta parametrizda para actualizar el rol del usuario


module.exports = router;
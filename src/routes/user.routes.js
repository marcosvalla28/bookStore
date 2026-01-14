//ENRUTADOR PARA MANEJAR LOS ENDPOINTS DE USUARIOS
const express = require("express");
const { verifyAuth, verifySuperAdmin } = require("../middlewares/auth");
const { getAllUsers, userRol, deleteUsers, getUserByID } = require("../controllers/user.controller");
const { validateMongoID, validateUpdateRole, validateUserId } = require("../middlewares/validator");

const router = express.Router();

//LLEGO CON /users - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints

//TODAS LAS RUTAS REQUIEREN AUTENTICACION Y PERMISOS DE ADMIN
router.use(verifyAuth , verifySuperAdmin); //YO LE INDICO AL ENRUTADOR QUE POR DEFECTO USE MIS MIDDLEWARES DE VALIDACIONES DE ROLES

//RUTAS PRIVADAS PARA ADMINISTRACION DE USUARIOS
router.get('/', getAllUsers);
//GET USER BY ID 
router.get('/:id', validateUserId, getUserByID)
router.patch('/:id/role', validateMongoID, validateUpdateRole, userRol);
router.delete('/:id', validateMongoID, deleteUsers)


module.exports = router;
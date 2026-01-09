//ENRUTADOR PARA MANEJAR LOS ENDPOINTS DE USUARIOS
const express = require("express");

const router = express.Router();

//LLEGO CON /USERS - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR
//endpoints

//TODAS LAS RUTAS REQUIEREN AUTENTICACION Y PERMISOS DE ADMIN
router.use(verifyAuth , verifySuperAdmin); //YO LE INDICO AL ENRUTADOR QUE POR DEFECTO USE MIS MIDDLEWARES DE VALIDACIONES DE ROLES

//RUTAS PRIVADAS PARA ADMINISTRACION DE USUARIOS
router.get('/', getAllUsers);
router.patch('/:id/role', validateMongoID, validateUpdateRole, updateUserRole);
router.delete('/:id', validateMongoID, deleteUsers)


module.exports = router;
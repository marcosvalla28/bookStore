const {body, param, validationResult} = require('express-validator');
const User = require('../models/User');
const ROLE_SUPERADMIN = 'superadmin'

//middleware para manejar los errores de validacion
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: 'Errores de validacion',
            errors: errors.mapped()
        })
    }

    next();
}


//VALIDACIONES PARA EL REGISTRO DE UN USUARIO
const validateRegister = [
    body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser un texto')
    .trim() //para sacar los espacios
    .isLength({min:2}).withMessage('El nombre debe terner al menos 2 caracteres'),

    body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no tiene un formato valido')
    .normalizeEmail()
    .custom(async (email) =>{
        const user = await User.findOne({email})
        if (user) {
            throw new Error('El usuario ya existe')
        }
    }),

    body('password')
    .notEmpty().withMessage('La contrasena es requerida')
    .isLength({min:6}).withMessage('La contrasena debe terner por lo menos 6 caracteres'),

    handleValidationErrors
]


//VALIDACION PARA LOGIN
const validateLogin = [
    body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email ingresado debe ser valido')
    .normalizeEmail()
    .custom(async(email) => {
        const user = await User.findOne({email})
        if (!user) {
            throw new Error('Credencial incorrecta')
        }
    }),

    body('password')
    .notEmpty().withMessage('La contrasena es requerida')
    .isLength({min: 6}).withMessage('La contrasena debe tener al menos 6 caracteres')
    .custom(async (password) => {
        const user = await User.findOne({password});
        if (!user) {
            throw new Error('Credencial incorrecta');
        }
    }),


    
    handleValidationErrors
]

//VALIDACION PARA DELETE
const validateUserId = [
        param('id')
        .isMongoId().withMessage('El ID proporcionado no es valido')
        .custom(async (id) => {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('El usuario no existe o no fue encontrado')
            }
        }),


    handleValidationErrors
    ]

//VALIDACION PARA CAMBIO DE ROL
const validateUpdateRole = [
    param('id')
    .isMongoId().withMessage('El ID proporcionado no es valido'),

    body('role')
    .notEmpty().withMessage('Debe proporcionar el rol del usuario')
    .isIn(['user', 'admin', 'superadmin']).withMessage('El rol debe ser: user, admin o superadmin'),

    handleValidationErrors

]

//VALIDAMOS SI EL USUARIO QUE PIDE ALLUSERS SEA SUPER ADMIN
const validateSuperAdmin = [
    param('id')
    .isMongoId().withMessage('El ID proporcionado no es valido')
    .custom(async (id) => {
        const user = await User.findById(id);
        if (user.role !== ROLE_SUPERADMIN) {
            throw new Error('El usuario no tiene permiso para esta accion')
        }
    }),
    
    handleValidationErrors
]
module.exports = {
    validateRegister,
    validateLogin,
    validateUserId,
    validateUpdateRole,
    validateSuperAdmin
}
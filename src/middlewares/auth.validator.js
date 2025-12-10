const {body, param, validationResult} = require('express-validator');
const User = require('../models/User');


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

    next()
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
        const user = UserActivation.findOne({email})
        if (user) {
            throw new Error('El usuario ya existe')
        }
    }),

    body('password')
    .notEmpty().withMessage('La contrasena es requerida')
    .isLength({min:6}).withMessage('La contrasena debe terner por lo menos 6 caracteres'),

    handleValidationErrors
]

module.exports = {
    validateRegister
}
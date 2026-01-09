const jwt = require("jsonwebtoken");
const User = require('../models/User');

//VERIFICAR SI EL USUARIO ESTA AUTENTICADO
const verifyAuth = async (req, resizeBy, next) => {
    try {
        //CAPTURAMOS EL TOKEN DESDE EL REQ
        const token = req.cookies.token;

        //VALIDAMOS QUE VENGA EL TOKEN
        if (!token) {
            return resizeBy.status(401).json({
                ok: false,
                message: 'No autorizado, Token no proporcionado'
            })
        }

        //DECODIFICAR EL TOKEN
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        //SI ESE USUARIO NO EXISTE
        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario no encontrado'
            })
        }

        //GUARDAR LA INFO DEL USUARIO EN EL OBJETO REQ
        req.user = user; //SETEO EN EL OBJETO REQ LA INFO DEL USUARIO

        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok: false,
            message: 'Token invalido o expirado'
        })
    }
}

//VERIFICAR SI EL USUARIO ES ADMIN O SUPERADMIN
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== process.env.ADMIN_ROLE && req.user.role !== process.env.SUPER_ADMIN_ROLE) {
        return res.status(403).json({
            ok: false,
            message: 'Acceso denegado. Se requiere permiso de administrador'
        })
    }
    next()
}

//VERIFICAR SI EL USUARIO ES SUPERADMIN
const verifySuperAdmin = (req, res, next) => {
    if (req.user.role !== process.env.SUPER_ADMIN_ROLE) {
        return res.status(403).json({
            ok: false,
            message: 'Acceso denegado. Se requiere permisos de super administrador'
        })
    }

    next()
}


module.exports = {
    verifyAuth,
    verifyAdmin,
    verifySuperAdmin
}
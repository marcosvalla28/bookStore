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

module.exports = {
    verifyAuth
}
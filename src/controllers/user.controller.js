const User = require("../models/User");
const { sendVerificationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');



const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password');

        //VALIDAMOS QUE EXISTAN USUARIOS PARA ENVIAR AL FRONT
        if (users.length === 0) {
            return res.status(404).jsosn({
                ok: false,
                msg: 'No se encontraron ususarios en la base de datos'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'Usuarios obtenidos correctamente',
            data: {
                length: users.length,
                users
            }
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const deleteUsers = async (req, res) => {
    try {
        const {id} = req.params;

        const idUser = await User.findByIdAndDelete(id).select('_password');

        /* if (!idUser) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontro ningun usuario con ese id :('
            })
        } */

        return res.status(200).json({
            ok: true,
            message: 'Usuario encontrado y eliminado exitosamente',
            user:{
                id: idUser._id,
                name: idUser.name,
                email: idUser.email,
                role: idUser.role
            }
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar usuario, hable con el administrador'
        })
    }
}

const userRol = async (req, res) => {
    try {
    const {id} = req.params;
    const {role} = req.body;

/*     if (!role) {
        return res.status(400).json({
            ok: false,
            message: 'Se requiere un nuevo rol para actualizar'
        })
    } */

/*     //VALIDAMOS QUE EL ROL SEA CORRECTO
    const allowRoles = ['user', 'admin', 'superadmin'];


    if(!allowRoles.includes(role)){
        return res.status(400).json({
            ok: false,
            message: `El rol debe ser uno de los siguientes: ${allowRoles.join(', ')}`
        })
    } */

    //BUSCAR Y ACTUALIZAR EL USUARIO 
    const updateUser = await User.findByIdAndUpdate(
        id,
        {role},
        {new: true, runValidators: true}
    ).select('-password');

    /* if (!updateUser) {
        return res.status(404).json({
            ok: false,
            message: `Usuario no encontrado`
        })
    } */

    return res.status(200).json({
        ok: true,
        message: 'Rol actualizado correctamente',
        user: {
            id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role
        }
    })



    /* const user = await User.findById(id).select('-password'); */

    /* if (!user) {
        return res.estatu(404).json({
            ok: false,
            message: 'Usuario no encontrado'
        })
    }

    user.role = role;
    await user.save();
    
    return res.status(200).json({
        ok: true,
        message: 'Rol del usuario actualizado',
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    }) */
    } catch (error) {
                console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error, hable con su administrador ❌'
        })
    }

}

module.exports = {
    getAllUsers,
    deleteUsers,
    userRol
};
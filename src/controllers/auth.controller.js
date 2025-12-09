//MINI CRUD DE USUARIO - AUTH
const User = require("../models/User");



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

const register = async (req, res) =>{

    try {
        
        const {name, email, password} = req.body;

        //VALIDAMOS QUE LLEGUE LA INFO BASICA
        if (!name || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos son obligatorios 😡'
            })
        }

        //VALIDO QUE EL EMAIL NO ESTE EN USO
        const exist = await User.findOne({email});

        if (exist) {
            return res.status(409).json({
                ok: false,
                message: 'El ususario ya existe'
            })
        }

        //CREAR EL USUSARIO CON MONGOOSE
        const newUser = await User.create({
            name,
            email,
            password
        });

        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado con Exito!!',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
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


const login = async (req, res) =>{
    try {
        
        const {email, password} = req.body;

        //VALIDAMOS QUE LLEGUE LA INFO BASICA
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos son obligatorios 😡'
            })
        }

        const user = await User.findOne({email, password})

        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Credenciales incorrectas 😡'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'Login Exitoso!!',
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
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

        const idUser = await User.findById(id);

        if (!idUser) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontro ningun usuario con ese id :('
            })
        }

        await User.findByIdAndDelete(id);

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

    if (!role) {
        return res.status(400).json({
            ok: false,
            message: 'Se requiere un nuevo rol para actualizar'
        })
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
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
    })
    } catch (error) {
                console.error(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error, hable con su administrador ❌'
        })
    }

}


module.exports = {
    register,
    login,
    getAllUsers,
    deleteUsers,
    userRol
};

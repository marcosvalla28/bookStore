//MINI CRUD DE USUARIO - AUTH
const User = require("../models/User");
const { sendVerificationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

//FUNCION AUXILIAR PARA PODER GENERAR EL TOKEN
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '1h'
    });
}





const register = async (req, res, next) =>{

    try {
        
        const {name, surname, email, password} = req.body;

       /*  //VALIDAMOS QUE LLEGUE LA INFO BASICA  //ESTO VIENE A SER LO MISMO QUE ISeMPTY
        if (!name || !email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos son obligatorios 😡'
            })
        } */

        /* //VALIDO QUE EL EMAIL NO ESTE EN USO
        const exist = await User.findOne({email});  //ESTO LO HACEMOS EN AUTH.VALIDATOR.JS

        if (exist) {
            return res.status(409).json({
                ok: false,
                message: 'El ususario ya existe'
            })
        } */

        //CREAR EL USUSARIO CON MONGOOSE
        const newUser = await User.create({
            name,
            surname,
            email,
            password,
            profilePic: req.file ? req.file.filename : null
        });


        //LLAMAR AL METODO DE USUARIO QUE CREA EL CODIGO DE VERIFICACION
        const code = newUser.generateVerificationCode();
        await newUser.save();

        //ENVIAR CODIGO VIA EMAIL CON LA FUNCION NODEMAILER
        try {
            await sendVerificationEmail(email, name, code )
        } catch (emailError) {
            //SI FALLA EL ENVIO DEL EMAIL ELIMINAR EL USUARIO Y FOTO
            await User.findByIdAndDelete(newUser._id);
            if (req.file) {
                (req.file.path)
            }
            return res.status(500).json({
                ok: false,
                message: "Error al verificar el email. Por favor, intentar nuevamente"
            })
        }
        
        


        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado con Exito!!',
            user:{
                id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
                role: newUser.role,
                photo: newUser.profilePic
            }
        })

    } catch (error) {
        next(error)
    }

}

const verifyEmail = async (req, res, next) => {
    try {
        const {email, code} = req.body;

        //SI EL EMAIL YA ESTA VERIFICADO
        const user = await User.findOne({email});

        if (user.verifiedEmail) {
            return res.status(400).json({
                success: false,
                message:'El email ya esta verificado'
            })
        }

        //VERIFICAMOS EL CODIGO Y SU EXPIRACION 
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message:'Codigo de verificacion incorrecto'
            })
        }

        if (new Date() > user.codeExpiration) {
            return res.status(400).json({
                success: false,
                message:'El codigo de verificacion expiro'
            })
        }

        //MARCAR EL EMAIL DEL USUARIO COMO VERIFICADO
        user.verifiedEmail = true;
        user.verificationCode = null;
        user.codeExpiration = null;
        await user.save(); //ME SIENTO EN LA HOGUERA PARA SALVAR EL PUNTO

        return res.status(200).json({
            success: true,
            message: 'Email verificado exitosamente. Ahora podes iniciar sesion'
        })

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) =>{
    try {
        
        const {email, password} = req.body;

        /* //VALIDAMOS QUE LLEGUE LA INFO BASICA
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: 'Todos los campos son obligatorios 😡'
            })
        } */

        const user = await User.findOne({email})

        /* if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Credenciales incorrectas 😡'
            })
        } */

        //VERIFICAR LA PASSWORD
        const validPassword = await user.comparePasswords(password);
        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales invalidas ❌'
            })
        }

        //VERIFICAR QUE EL EMAIL DEL USUARIO ESTE VERIFICADO
        if (!user.verifiedEmail) {
            return res.status(403).json({
                ok: false,
                message: 'Debes verificar tu email para iniciar sesion 💻'
            })
        }

        //TRABAJAR CON EL TOKEN Y LA COOKIE
        //GENERAR TOKEN
        const token = generateToken(user._id);

        //ENVIAR/RESPONDER UNA COOKIE CON EL TOKEN
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, //1HS
            secure: true,
        })




        return res.status(200).json({
            ok: true,
            message: 'Login Exitoso!!',
            token,
            data:{
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

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            ok: true,
            message: 'Logout exitoso!!'
        })
    } catch (error) {
        next(error)
    }
}

const getUserProfile = async (req,res, next) => {
    try {
        
     const user = await User.findById(req.user._id)
     .select('-password -verificationCode -codeExpiration')
     ;
     
     return res.status(200).json({
        ok: true,
        message: "Perfil del usuario obtenido correctamente",
        data: user
     })
    } catch (error) {
        next(error)
    }
}

const updateProfilePhoto = async (req,res, next) => {
    try {

        // validamos que el usuario suba una foto
        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:"no se proporcionó ninguna imagen"
            })
        }

        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration')
        ;

        // Eliminar la foto anterior si es que existe
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../../uploads/profiles',user.profilePic)
            deleteOneFile(previousPhoto)
        }

        // Actualizar con la nueva foto que envie el usuario
        user.profilePic = req.file.filename;
        await user.save()

        //enviamos la respuesta
        return res.status(201).json({
            ok:true,
            message:"foto de perfil actualizada 😊",
            data: user.profilePic
        })
        
    } catch (error) {
        next(error)
    }
}



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
    register,
    login,
    getAllUsers,
    deleteUsers,
    userRol,
    verifyEmail,
    logout,
    getUserProfile,
    updateProfilePhoto
};

//MINI CRUD DE USUARIO - AUTH

const fs = require("fs"); //ESTE MODULO NOS SIRVE PARA PODER TRABAJAR CON ARCHIVOS
const path = require("path"); //CON ESTE MODULO PUEDO HACER REFERENCIA A UBICACIONES O CONSTRUIR LA RUTA A LA UBICACION DEL RECURSO
const crypto = require("crypto");//MODULO NATIVO DE NODE PARA FUNCIONES CRIPTOGRAFICAS

const filePath = path.resolve(__dirname,"../data/users.json");

//LEER USUARIOS
const readUsers = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

//ESCRIBIR USUARIOS
const writeUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}



const getAllUsers = (req, res) => {
    try {
        const users = readUsers();

        if (users.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "No se encontraron usuarios en la base de datos"
            })
        }

        return res.status(200).json({
            ok: true,
            message: "Lista de usuarios obtenida correctamente",
            data: {
                length: users.length,
                users
            }
        });

    } catch (error) {
            console.log(error);
    return res.status(500).json(error.message);
    }
}

const register =(req, res) =>{

    try {

    const {email, password} = req.body;
    //VALIDAMOS QUE LLEGUE LA INFO BASICA
    if(!email || !password){ 
    return res.status(400).json({
        ok: false,
        message: 'Email y contrasena son requeridos'
    })
}

//VALIDAMOS QUE EL EMAIL NO ESTE EN USO
const users = readUsers();
const exist = users.find((u) => u.email === email);


if(exist){
    return res.status(409).json({
        ok:false,
        message:'El usuario ya existe :('
    })
}

//CREAMOS EL NUEVO USUARIO
const newUser = {
    id:crypto.randomUUID(),
    email,
    password
}

//SUMO UN NUEVO USUARIO AL ARRAY DE USUARIOS
users.push(newUser);

//ESCRIBIR EL JSON CON LA INFO ACTUALIZADA
writeUsers(users);


return res.status(201).json({
    ok:true,
    message: 'Usuario registrado con exito :)',
    user: {
        id:newUser.id,
        email:newUser.email
    }
});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }

}


const login = (req, res) =>{
    try {
        

    const {email, password} = req.body;

    if(!email || !password){ 
    return res.status(400).json({
        ok: false,
        message: 'Email y contrasena son requeridos'
    })
    }

    const users = readUsers();
    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            ok: false,
            message: "Credenciales invalidas :("
        });
    }

    return res.status(200).json({
        ok: true,
        message: "Login Exitoso",
        user: {
            id: user.id,
            email: user.email
        }
    });

    } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
    }
}

const deleteUsers = (req, res) => {
    try {
        
        const {id} = req.params; //CAPTURAMOS EL ID DEL PARAMETRO QUE VIAJA EN LA RUTA

        const users = readUsers();

        const exist = users.find( (u) => u.id === id);

        if (!exist) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        const filtered = users.filter((u) => u.id !== id);

        writeUsers(filtered);

        return res.status(200).json({
            ok: true,
            message: "Usuario eliminado correctamente",
            deleteUsers: {
                id: exist.id,
                email: exist.email
            }
        });


    } catch (error) {
            console.log(error);
    return res.status(500).json(error.message);
    }
}


module.exports = {
    register,
    login,
    getAllUsers,
    deleteUsers
};

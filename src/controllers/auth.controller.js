//MINI CRUD DE USUARIO - AUTH
const { ok } = require("assert");
const { randomUUID } = require("crypto");
const fs = require("fs"); //ESTE MODULO NOS SIRVE PARA PODER TRABAJAR CON ARCHIVOS
const path = require("path"); //CON ESTE MODULO PUEDO HACER REFERENCIA A UBICACIONES O CONSTRUIR LA RUTA A LA UBICACION DEL RECURSO

const filePath = path.resolve("../data/users.json");

//LEER USUARIOS
const readUsers = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

//ESCRIBIR USUARIOS
const writeUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}



const register =(req, res) =>{
    const {email, password} = req.body;
    if(!email && !password){ 
    return res.status(400).json({
        ok: false,
        message: 'Email y contrasena son requeridos'
    })
}

//VALIDAMOS QUE LLEGUE LA INFORMACION BASICA
const users = readUsers();
const exist = users.find((u) => u.email === email);

//VALIDAMOS QUE EL EMAIL NO ESTE EN USO
if(exist){
    return res.status(409).json({
        ok:false,
        message:'El usuario ya existe'
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
    message: 'Usuario registrado con exito',
    user: {
        id:newUser.id,
        email:newUser.email
    }
});
}


const login = (req, res) =>{

}

module.exports = {
    register,
    login
};

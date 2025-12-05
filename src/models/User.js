//ESTE VA A SER EL MODELO DE USUARIOS

//PASO1: REQUERIR MONGOOSE
const mongoose = require('mongoose');

//PASO2 : CREAR EL ESQUEMA DEL USUARIO 
const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    }

},{
    timestamps: true
})

//PASO3 : EXPORTAR EL MODELO DEL USUARIO (con mongoose.model que requiere dos parametros: 1-Alias && 2-Esquema)
module.exports = mongoose.model('User', userSchema);
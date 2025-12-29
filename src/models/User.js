//ESTE VA A SER EL MODELO DE USUARIOS

//PASO1: REQUERIR MONGOOSE
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//PASO2 : CREAR EL ESQUEMA DEL USUARIO 
const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
        surname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    verifiedEmail:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: String,
        default: null,
    },
    codeExpiration:{
        type: Date,
        default: null
    }

},{
    timestamps: true
});

//HASH DE LA PASSWORD ANTES DE GUARDAR EL USUARIO

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//METODO PARA COMPARAR LA PASSWORDS
userSchema.methods.comparePasswords = async function (userPassword) {

    return await bcrypt.compare(userPassword, this.password)
}

//METODO PARA GENERAR CODIGO DE VERIFICACION

userSchema.methods.generateVerificationCode = function() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCode = code;
    this.codeExpiration = new Date(Date.now() + 15 * 60 *1000); //15 minutos
    return code;
}


//PASO3 : EXPORTAR EL MODELO DEL USUARIO (con mongoose.model que requiere dos parametros: 1-Alias && 2-Esquema)

module.exports = mongoose.model('User', userSchema);
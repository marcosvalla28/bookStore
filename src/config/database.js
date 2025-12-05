//CONECCION A LA BASE DE DATOS

//PASO1: REQUERIR MONGOOSE
const mongoose = require('mongoose');

//PASO2: CREAR UNA FUNCION QUE HACE LA CONEXION
const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🌎 MongoDB conectado exitosamente!!!')

    } catch (error) {
        console.error ('Error al conectar con MongoDB', error.message);
        process.exit(1); //esto hace que node o express termine con todo los procesos
    }
}

//PASO3: EXPORTAR LA FUNCION
module.exports = connectDB;
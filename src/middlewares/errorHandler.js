

//MIDDLEWARE PARA MANEJAR LOS ERRORES

const { cleanUploadsFiles } = require("../utils/fileCleanup");

const errorHandler = (err, req, res, next) => {

    console.error('❌ Error: ', err)

    //LIMPIAR ARCHIVOS SUBIDOS SI HAY ERROR 
    cleanUploadsFiles(req)

    //ERROR DE VALIDACION DE MONGOOSE
    if (err.name === 'validationError') {
        const errors = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({
            ok: false,
            message: 'Error de validacion',
            errors
        })
    }

    //ERROR PERSONALIZADO DE MULTER PERO PARA LO QUE ES EL TIPO DE ARCHIVO
    if (err.message && err.message.includes('solo se permiten imagenes')) {
        return res.status(400).json({
            ok: false,
            message: err.message
        })
    }

    //ERROR DE MULTER PERO EL TAMANO EXCEDIDO EN LOS ARCHIVOS
    if (err.name === 'MulterError') {
        
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
            ok: false,
            message: 'El archivo excede el tamano maximo de 2MG'
        })
        }

        //QUE PASA SI HAY UN ERROR EN EL CUAL SE SUBIERON MAS ARCHIVOS DE LOS PERMITIDOS?


    };

    //ERROR GENERICO 
    res.status(err.statusCode || 500).json({
        ok: false,
        message: err.message || 'Error interno del servidor'
    });

};

module.exports = errorHandler;
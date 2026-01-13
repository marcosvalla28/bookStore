const fs = require('fs');
const path = require('path');

//Eliminar un archivo
const deleteOneFile = (filePath) => {
    try {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            console.log(`🗑 Archivo eliminado: ${filePath}`);
        }

        
    } catch (error) {
        console.error(`❌ Error al eliminar archivo ${filePath} : ${error.message}`)
    }
}

//ELIMINAR ARCHIVOS SUBIDOS POR MULTER (REQ.FILE O REQ.FILES)
const cleanUploadsFiles = (req) => {
    if (req.file) {
        deleteOneFile(req.file.path)
    }

    if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => deleteOneFile(file.path))
    }
}

//OBTENER RUTA COMPLETA DEL ARCHIVO DESDE NOMBRE
const getCompleteRoute = (filname, type) => {
    return path.join(__dirname, `../../uploads/${type}`, filname)
}

module.exports = {
    deleteOneFile,
    cleanUploadsFiles,
    getCompleteRoute
}
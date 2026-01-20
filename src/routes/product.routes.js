const express = require('express');
const {up, uploadProductImages} = require('../config/multer')
const { createProduct, updateProduct, getAllProducts, deleteProduct, searchProduct, getProductById } = require('../controllers/product.controller');
const { validateProduct, validateMongoID, validateUpdateProduct } = require('../middlewares/validator');
const { verifyAuth, verifyAdmin } = require('../middlewares/auth');

const router = express.Router();

//LLEGO CON /PRODUCTS - ESTA ES LA RUTA RAIZ DE ESTE ENRUTADOR

//ENDPOINTS QUE ME LISTA TODOS LOS PRODUCTOS

//RUTAS PUBLICAS PARA TODOS LOS USUARIOS
router.get('/', getAllProducts)
router.get('/search', searchProduct)
router.get('/:id', getProductById)


//RUTAS PRIVADAS (SOLO ADMIN Y SUPERADMIN)
router.post('/', 
    verifyAuth,
    verifyAdmin,
    uploadProductImages, 
    validateProduct, 
    createProduct)

router.put('/:id',
    verifyAuth,
    verifyAdmin,
    validateMongoID,
    uploadProductImages,
    validateUpdateProduct,
    updateProduct

)
router.delete(
    '/:id',
    verifyAuth,
    verifyAdmin,
    validateMongoID,
    deleteProduct
)




module.exports = router;

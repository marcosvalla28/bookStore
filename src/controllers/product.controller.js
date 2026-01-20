const Product = require('../models/Product');
const product = require('../models/Product');
const {deleteOneFile, cleanUploadsFiles, getCompleteRoute, deleteFiles} = require('../utils/fileCleanup');


//OBTENER LOS PRODUCTOS
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({createAt: -1}); //TRAEMOS LOS PRODUCTOS ORDENADOS POR LOS MAS NUEVOS A LOS MAS VIEJOS

        if (!product || products.length === 0) {
            return res.status(404).json({
                ok:false,
                message:'No se encontraron libros en stock'
            })
        }

        return res.status(200).json({
            ok:true,
            message:'Lista de libros obtenidas correctamente',
            length: products.length,
            data: products
        })

    } catch (error) {
        next(error)
    }
}

//BUSCAR UN PRODUCTO
const searchProduct = async (req, res, next) => {
    try {
        //1. CAPTURAR LOS PARAMETROS DE BUSQUEDAS DE LA QUERY
        const {genre, author, title} = req.query;

        //2. INICIALIZAR VARIABLES PARA FILTRO
        let filters = {}; //PORQUE MONGOOSE ESPERA UN OBJETO EN LOS FILTROS

        //3. ANADIR FILTROS AL OBJETO PERO DE MANERA CONDICIONAL
        if (genre) {
            filters.genre = {$regex: genre, $options: 'i'}
        }


        if (author) {
            filters.author = {$regex: author, $options: 'i'}
        }

        
        if (title) {
            filters.title = {$regex: title, $options: 'i'}
        }

        //4. APLICO LOS FILTROS DIRECTAMENTE
        const products = (await Product.find(filters)).toSorted({createdAt:-1});

        //5. SI NO ENCONTRO PRODUCTOS LE DOY UNA RESPUESTA
        if (products || products.length === 0) {
            return res.status(404).json({
                ok:false,
                message:'No se encontraron coincidencias para la busqueda'
            })
        }

        //6. RESPUESTA AL CLIENTE CON LOS RESULTADOS
        return res.json({
            ok:true,
            message: 'Productos encontrados 📚',
            length: products.length,
            data: products
        })


    } catch (error) {
        next(error)
    }
}






//OBTENER UN PRODUCTO POR SU ID

const getProductById = async (req, res, next) => {
    try {
        //1. CAPTURO EL ID DEL PRODUCTO
        const {id} = req.params

        //2. BUSCAR EL PRODUCTO EN MONGO
        const product = await Product.findById(id);

        //3. VALIDAR QUE EL PRODUCTO EXISTA
        if (!product) {
            return res.status(404).json({
                ok:false,
                message: 'Producto no encontrado'
            })
        }

        //4. RESPUESTA AL CLIENTE
        return res.status(200).json({
            ok:true,
            data:product
        })

    } catch (error) {
        next(error)
    }
}










//CREAR PRODUCTO (SOLO ADMIN O SUPERADMIN)
const createProduct = async (req, resizeBy, next) => {
    try {
        
        //CAPTURO LA INFORMACION
        const { title, author, price, description, genre, publisher, stock } = req.body

        //VERIFICAR QUE SE HAYAN SUBIDO IMAGENES
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Debes subir al menos 1 imagen del libro'
            })
        }

        //VERIFICAR NUEVAMENTE QUE NO SE EXEDA EL LIMITE DE 3 IMAGENES 
        if (req.files.length >3) {
            return res.status(400).json({
                ok: false,
                message: 'Maximo 3 imagenes permitidas'
            })
        }

        //MAPEAR EL ARRAY DE IMAGENES PARA DARLE UN FORMATO QUE ME SEA MAS COMODO DE GUARDAR EN MONGO
        const images = req.files.map(file => file.filename);

        const product = new product({
            title,
            author,
            price,
            description,
            genre,
            publisher,
            stock,
            images
        })

        //GUARDAR EN MONGO
        await product.save();

        //RESPUESTA AL CLIENTE CON MENSAJE DE EXITO
        return res.status(201).json({
            ok: true,
            message:'Producto creado correctamente',
            data:product

        })


    } catch (error) {
        cleanUploadsFiles(req)
        next(error)
    }
}

//ACTUALIZAR PRODUCTO (SOLO ADMIN O SUPERADMIN)
const updateProduct = async (req, res, next) => {
    try {
        
        //1. CAPTURAMOS LA INFO NECESARIA
        const {id} = req.params; //ID DEL LIBRO
        const { title, author, price, description, genre, publisher, stock } = req.body //INFO A ACTUALIZAR

        //2. BUSCAR EL PRODUCTO POR SU ID
        const product = await Product.findById(id);

        //3. VALIDAR QUE EXISTA EL PRODUCTO
        if (!product) {
            cleanUploadsFiles(req)
            return res.status(404).json({
                ok:false,
                message: 'Libro no encontrado ❌'
            })
        }

        //4. ACTUALIZAR LOS CAMPOS DEL PRODUCTO CONDICIONALMENTE
        if (title) product.title = title;
        if (author) product.author = author;
        if (price !== undefined) product.price = price;
        if (description) product.description = description;
        if (genre) product.genre = genre;
        if (publisher) product.publisher = publisher;
        if (stock !== undefined) product.stock = stock;

        //5. SI SE SUBIERON IMAGENES TENGO QUE REMPLAZAR LAS ANTIGUAS
        if (req.files && req.files.length > 0) {
            
            //VERIFICAR NUEVAMENTE QUE NO SE EXEDA EL LIMITE DE 3 IMAGENES 
            if (req.files.length >3) {
                return res.status(400).json({
                    ok: false,
                    message: 'Maximo 3 imagenes permitidas'
                })
            }

            //BUSCAMOS LAS RUTAS DE LAS IMAGENES VIEJAS Y LAS GUARDAMOS EN UNA VARIABLES
            const oldImages = product.images.map(img => 
                getCompleteRoute(img, 'products')
            );

            //ELIMINAMOS LAS IMAGENES VIEJAS USANDO LAS RUTAS QUE GUARDAMOS ANTES
            deleteFiles(oldImages)

            //ASIGNAR LAS IMAGENES NUEVAS
            product.images = req.files.map(file => file.filename);

            //6. ACTUALIZAMOS EL PRODUCTO EN MONGO CON EL SAVE
            await product.save();
            
            //7. RESPUESTA AL CLIENTE
            return res.status(200).json({
                ok:true,
                message:'Libro actualizado correctamente',
                data: product
            })
        }


    } catch (error) {
        cleanUploadsFiles(req)
        next(error)
    }
}

//ELIMINAR PRODUCTO
const deleteProduct = async (req, res, next) => {
    try {
        //1. Buscar el id del producto
        const {id} = req.params

        //2. BUSCAR EL PRODUCTO EN MONGO
        const product = await Product.findById(id);

        //3. VALIDO QUE EXISTA
        if (!product) {
            return res.status(404).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }

        //4. UBICAR LAS RUTAS DE TODAS LAS IMAGENES DEL PRODUCTO
            const imagesRoutes = product.images.map(img => 
                getCompleteRoute(img, 'products')
            );

        //5. ELIMINAMOS LAS IMAGENES USANDO LAS RUTAS QUE GUARDAMOS ANTES
            deleteFiles(imagesRoutes);

        //6. ELIMINAMOS EL PRODUCTO
        await Product.findByIdAndDelete(id);

        //7. RESPUESTA AL CLIENTE
        return res.status(200).json({
            ok:true,
            message: 'Producto eliminado'
        })


    } catch (error) {
        next(error)
    }
}


module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProduct,
    getProductById
}
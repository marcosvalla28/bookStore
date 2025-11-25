const express = require('express');

const router = express.Router();

//ENDPOINTS QUE ME LISTA TODOS LOS PRODUCTOS
router.get("/", (req, res) =>{
    res.send("Listado de todos los libros de nuestro catralogo")
})

//ENDPOINTS QUE ME LISTA UN SOLO PRODUCTO
router.get("/libro", (req, res) => {
    res.send("Danza de Dragones - Cancion de Hielo y Fuego")
})

router.post("/newBook", (req, res) => {
    const {title, price} = req.body;
    res.send(`El nuevo libro se llama: "${title}" a un precio de $${price} `);
})

module.exports = router;

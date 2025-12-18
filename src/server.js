const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require('path')

//LOS ARCHIVOS DE LOS ENRUTADORES
//IMPORTAR LOS ENRUTADORES
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const cartRoutes = require("./routes/cart.routes");
const authRoutes = require("./routes/auth.routes");
const connectDB = require("./config/database");



const app = express();

//CONEXION A LA BASE DE DATO
connectDB();



//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))//PARA QUE EL SERVIDOR PUEDA ENTENDER LOS DATOS QUE VIENEN DE UN FORMULARIO


//Servir archivos estáticos (imágenes u otros archivos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// UTILIZO A LOS ENRUTADORES
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/favs", favoritesRoutes);
app.use("/api/v1/cart", cartRoutes);

//PUERTOS
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}}`)
})


const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
//IMPORTAR LAS RUTAS
const productRoutes = require("./routes/productRoutes");
const useRoutes = require("./routes/useRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");



const app = express();
//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))//PARA QUE EL SERVIDOR PUEDA ENTENDER LOS DATOS QUE VIENEN DE UN FORMULARIO


//ROUTES
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", useRoutes);
app.use("/api/v1/favorites", favoritesRoutes);
app.use("/api/v1/cart", cartRoutes);

//PUERTOS
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}}`)
})


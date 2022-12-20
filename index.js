const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");
// Conectando a base de datos a través del archivo "Conexión.js"
conexion();

// Crear servidor de Node
const app = express();
const puerto = 3090;

// Configuar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json());
// Convertir datos con content.type app/json
app.use(express.urlencoded({ extended: true })); // Para que pueda recibir datos de un formulario urlencoded

// RUTAS BUENAS
const rutas_articulo = require("./rutas/articulo");

// Cargo las Rutas
app.use("/api", rutas_articulo);

// Rutas Prueba
app.get("/probando", (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).send(`
    <div>
    <h1>Probando ruta con NodeJs</h1>
    <p>Creando api Rest con Node</p>
    </div>
    `);
});

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
  console.log("Servidor corriendo en el puerto" + puerto);
});

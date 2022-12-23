const mongoose = require("mongoose");
require("dotenv").config();

const conexion = async () => {
  try {
    await mongoose.connect(
      // `mongodb+srv://diegohenao819:${process.env.PASSWORD}@cluster0.lgv6vcv.mongodb.net/?retryWrites=true&w=majority`
      "mongodb://mongo:ZPd9gpjpTH6XM072n4rd@containers-us-west-147.railway.app:7393"
    );

    console.log("Conectado a mi base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos" + error);
  }
};

module.exports = {
  conexion,
};

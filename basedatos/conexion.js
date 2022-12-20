const mongoose = require("mongoose");

const conexion = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://diegohenao819:escaleraS1@cluster0.lgv6vcv.mongodb.net/?retryWrites=true&w=majority"
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

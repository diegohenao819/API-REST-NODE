const fs = require("fs");
const validator = require("validator");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una acción de prueba en mi contralador de articulos",
  });
};

const crear = (req, res) => {
  // Recoger parametros por post a guardar
  let parametros = req.body;

  //  Validar datos
  try {
    let validar_titulo = !validator.isEmpty(parametros.titulo);
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_contenido || !validar_titulo) {
      throw new Error("Faltan datos por enviar");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "faltan datos para validar",
    });
  }

  // Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en el modelo ( manual o automatico)

  // guardar el   culo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "El articulo no se ha guardado",
      });
    }
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo guardado correctamente",
    });
  });

  // devolver resultado

  // return res.status(200).json({
  //   mensaje: "Acción de guardar",
  //   parametros,
  // });
};

// TRAER ARTICULOS
const listar = (req, res) => {
  let consulta = Articulo.find({})
    .limit(10)
    .sort([["_id", "descending"]])
    .exec((error, articulos) => {
      if (error || !articulos) {
        return res.status(404).json({
          status: "error",
          mensaje: "No hay articulos para mostrar",
        });
      }
      return res.status(200).send({
        status: "success",
        articulos,
      });
    });
};

// Traer un articulo
const uno = (req, res) => {
  // Recoger el id de la url
  let id = req.params.id;
  // buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    // sino existe, devolver error
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No existe el articulo",
      });
    }
    // devolverlo en json
    return res.status(200).json({
      status: "success",
      articulo,
    });
  });
};

// Borrar articulo
const borrar = (req, res) => {
  let id = req.params.id;
  Articulo.findByIdAndDelete(id, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(404).json({
        status: "error",
        mensaje: "No existe el articulo",
      });
    }
    return res.status(200).json({
      status: "success",
      articulo: articuloBorrado,
    });
  });
};

// Validar articulo funcion
const validarArticulo = (res, parametros) => {
  // validar datos
  try {
    let validar_titulo = !validator.isEmpty(parametros.titulo);
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_contenido || !validar_titulo) {
      throw new Error("Faltan datos por enviar");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "faltan datos para validar",
    });
  }
};

// Actualizar articulo
const editar = (req, res) => {
  // recoger id articulo a editar
  let articuloId = req.params.id;

  // recoger datos del body
  let parametros = req.body;

  // Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "faltan datos para validar",
    });
  }

  // buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: articuloId },
    req.body,
    { new: true },
    (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "No existe el articulo",
        });
      }
      // devolver respuesta
      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
      });
    }
  );
};

const subir = (req, res) => {
  // configurar multer

  // recoger el fichero de la imagen que llega
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "No se ha subido ningun archivo",
    });
  }
  // nombre del archivo
  let archivo = req.file.originalname;

  // extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  // comprobar la extension, solo imagenes, si no es valida borrar el archivo

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // borrar el archivo subido
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "La extension de la imagen no es valida",
      });
    });
  } else {
    // si todo es valido, sacando el id del articulo y guardando la imagen con el nombre del id

    // recoger id articulo a editar ************************
    let articuloId = req.params.id;

    // buscar y actualizar articulo
    Articulo.findOneAndUpdate(
      { _id: articuloId },
      { imagen: req.file.filename },
      { new: true },
      (error, articuloActualizado) => {
        if (error || !articuloActualizado) {
          return res.status(404).json({
            status: "error",
            mensaje: "No existe el articulo",
          });
        }
        //  *****************************************************
        // devolver respuesta
        return res.status(200).json({
          status: "success",
          articulo: articuloActualizado,
          fichero: req.file,
        });
      }
    );
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
      });
    }
  });
};

// BUSCADOR**************************
const buscador = (req, res) => {
  // Sacar el string a buscar
  let busqueda = req.params.busqueda;
  // find or
  Articulo.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  })
    // ordenar
    .sort([["date", "descending"]])
    // ejecutar la consulta
    .exec((error, articulosEncontrados) => {
      if (error || !articulosEncontrados || articulosEncontrados.length <= 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "Error en la peticion",
        });
      }
      // devolver resultado
      return res.status(200).json({
        status: "success",
        articulos: articulosEncontrados,
      });
    });
};
// FIN BUSCADOR**************************

module.exports = {
  prueba,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};

const { MongoClient } = require("mongodb");

class MongoDBClient {
  constructor(uri, dbName) {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = dbName;
    this.db = undefined;
    this.uri = uri;
  }

  /**
   * No recomiendo tocar esta funcion
   */
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`Conexión exitosa a MongoDB`);
      console.log(`Conectado a la base de datos: ${this.dbName}`);
      console.log(`URL de conexión: ${this.uri}`);
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
    }
  }

  /**
   * No recomiendo tocar esta funcion
   */
  async close() {
    try {
      await this.client.close();
      console.log("Desconectado de MongoDB");
    } catch (error) {
      console.error("Error al desconectar de MongoDB:", error);
    }
  }

  /**
   * Consulta de ejemplo
   *
   */

  async consultaEjemplo() {
    const productosCollection = this.db.collection("Productos");
    const productos = await productosCollection.find({}).toArray();

    return productos;
  }

  //Abajo estan las funciones que pueden ser modificadas por usted. Si quiere agregar funciones extras como delete y update, no hay problema.

  /**
   * Inserta un documento en una colección específica en MongoDB.
   *
   * @param {string} coleccion - El nombre de la colección en la cual se insertará el documento.
   * @param {Object} documento - El documento que se va a insertar en la colección.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando la inserción es exitosa.
   * @throws {Error} - Lanza un error si la inserción falla.
   *
   * Nota: Esta es una funcion basica para insertar, lo importante es el esquema de los modelos definidos y como los llames.
   * Pero si quieres la puedes modificar.
   */

  async insertar(coleccion, model) {
    try {
      const collection = this.db.collection(coleccion);
      const result = await collection.insertOne(model.toObject());
      console.log(
        `Documento insertado con éxito en la colección ${coleccion}:`,
        result.insertedId
      );
    } catch (error) {
      console.error(
        `Error al insertar el documento en la colección ${coleccion}:`,
        error
      );
    }
  }

  /**
   * Inserta varios objetos al mismo tiempo
   *
   * Nota: Esta funcion es opcional. Te puede ser de utilidad.
   */

  async insertarVarios(coleccion, models) {
    try {
      const collection = this.db.collection(coleccion);
      const result = await collection.insertMany(models);
      console.log(
        `Documentos insertados con éxito en la colección ${coleccion}:`,
        result.insertedIds
      );
      return result.insertedIds;
    } catch (error) {
      console.error(
        `Error al insertar los models en la colección ${coleccion}:`,
        error
      );
    }
  }

  /**
   * Dado n géneros, buscar los juegos que contengan todos esos géneros.
   *
   */

  async consulta1(generos) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .find({
        generos: { $all: generos },
      })
      .project({
        nombre: 1,
        generos: 1,
      })
      .toArray();
    return videojuegos;
  }

  /**
   * Buscar juegos lanzados dentro de un rango de fechas (xx/xx/xxxx -yy/yy/yyyy). de n companias.
   *
   */

  async consulta2(empresas, fechaInicio, fechaFin) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const empresasCollection = this.db.collection("Empresas");
    const empresaIds = await empresasCollection
      .find({
        nombre: { $in: empresas },
      })
      .map((emp) => emp._id)
      .toArray();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    const videojuegos = await videojuegosCollection
      .find({
        empresa: { $in: empresaIds },
        fechaLanzamiento: {
          $gte: fechaInicioDate,
          $lte: fechaFinDate,
        },
      })
      .project({
        nombre: 1,
        fechaLanzamiento: 1,
        empresa: 1,
      })
      .toArray();
    return videojuegos;
  }

  /**
   * Buscar juegos que estén disponibles en más de n plataformas y mostrat tambien cuáles plataformas son.
   *
   */

  async consulta3(cantidadDePlataformas) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .aggregate([
        {
          $match: {
            $expr: { $gt: [{ $size: "$plataformas" }, cantidadDePlataformas] },
          },
        },
        {
          $lookup: {
            from: "Plataformas",
            localField: "plataformas",
            foreignField: "_id",
            as: "plataformas_info",
          },
        },
        {
          $project: {
            nombre: 1,
            plataformas_info: {
              nombre: 1,
            },
          },
        },
        {
          $project: {
            nombre: 1,
            plataformas: "$plataformas_info.nombre",
          },
        },
      ])
      .toArray();
    return videojuegos;
  }

  /**
   * Contar juegos por n empresas desarrolladoras con valoración mayor a x.
   *
   */

  async consulta4(empresas, valoracion) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .aggregate([
        {
          $lookup: {
            from: "Empresas",
            localField: "empresa",
            foreignField: "_id",
            as: "empresa_info",
          },
        },
        {
          $unwind: "$empresa_info",
        },
        {
          $match: {
            "empresa_info.nombre": { $in: empresas },
            valoracion: { $gt: valoracion },
          },
        },
        {
          $group: {
            _id: "$empresa_info.nombre",
            juegos: { $sum: 1 },
          },
        },
      ])
      .project({
        _id: 0,
        empresa: "$_id",
        juegos: 1,
      })
      .toArray();
    console.log(videojuegos);
    return videojuegos;
  }

  /**
   * Buscar juegos con una calificación mayor al promedio y que tengan mas de n generos
   *
   */

  async consulta5(cantidadDeGeneros) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const result = await videojuegosCollection
      .aggregate(
        //videoJuegos con mas de n generos
        {
          $match: {
            $expr: { $gt: [{ $size: "$generos" }, cantidadDeGeneros] },
          },
        },
        //promedio
        {
          $group: {
            _id: null,
            promedio: { $avg: "$valoracion" },
            videojuegos: { $push: "$$ROOT" },
          },
        },
        //mayor al promedio
        {
          $project: {
            promedio: 1,
            videojuegos: {
              $filter: {
                input: "$videojuegos",
                as: "videojuego",
                cond: {
                  $gt: ["$$videojuego.valoracion", "$promedio"],
                },
              },
            },
          },
        }
      )
      .project({
        _id: 1,
        nombre: 1,
        valoracion: 1,
        generos: 1,
      })
      .toArray();
    return result;
  }

  /**
   * Juegos con etiquetas específicas y ordenados por fecha de lanzamiento.
   *
   */

  async consulta6(etiquetas) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .find({
        etiquetas: { $all: etiquetas },
      })
      .sort({ fechaLanzamiento: -1 })
      .project({
        id: 1,
        nombre: 1,
        fechaLanzamiento: 1,
        etiquetas: 1,
      })
      .toArray();
    return videojuegos;
  }

  /**
   * Calificación promedio de juegos por género específico.
   *
   */

  async consulta7(generos) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const result = await videojuegosCollection
      .aggregate([
        { $match: { generos: { $in: generos } } },
        { $unwind: "$generos" },
        { $match: { generos: { $in: generos } } },
        {
          $group: {
            _id: "$generos",
            promedio: { $avg: "$valoracion" },
          },
        },
      ])
      .project({
        _id: 0,
        genero: "$_id",
        promedio: 1,
      })
      .toArray();
    return result;
  }

  /**
   * Buscar juegos por una palabra clave en el nombre.
   *
   */

  async consulta8(palabra) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .find({
        nombre: { $regex: palabra, $options: "i" },
      })
      .project({
        _id: 1,
        nombre: 1,
      })
      .toArray();
    return videojuegos;
  }

  /**
   * Top 5 juegos mejor calificados por género específico y excluyendo ciertos empresas desarrolladoras
   *
   */

  async consulta9(generos, empresas) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection
      .aggregate(
        {
          $match: {
            generos: { $in: generos },
          },
        },
        {
          $unwind: "$generos",
        },
        {
          $match: {
            generos: { $in: generos },
          },
        },
        {
          $lookup: {
            from: "Empresas",
            localField: "empresa",
            foreignField: "_id",
            as: "empresa_info",
          },
        },
        {
          $unwind: "$empresa_info",
        },
        {
          $match: {
            "empresa_info.nombre": { $nin: empresas },
          },
        },
        {
          $sort: {
            valoracion: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            nombre: 1,
            valoracion: 1,
            empresa: "$empresa_info.nombre",
            generos: 1,
          },
        }
      )
      .project({
        id: 1,
        nombre: 1,
        empresa: "$empresa_info.nombre",
        valoracion: 1,
        generos: 1,
      })
      .toArray();
    return videojuegos;
  }

  /**
   *  Juegos por géneros y plataformas con proyección de campos.
   *
   */

  async consulta10(generos, plataformas) {
    const videojuegosCollection = this.db.collection("Videojuegos");
    const videojuegos = await videojuegosCollection.aggregate().toArray();
    return videojuegos;
  }
}

module.exports = MongoDBClient;

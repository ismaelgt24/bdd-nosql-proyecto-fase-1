require("dotenv").config();
const axios = require("axios");

const Producto = require("./schemas").Producto;

const PAGE_SIZE = process.env.PAGE_SIZE;

// const API_KEY = process.env.GB_APIKEY;
// const BASE_URL = process.env.GB_API_ENDPOINT;

const API_KEY = process.env.RAWG_APIKEY;
const BASE_URL = process.env.RAWG_API_ENDPOINT;

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MongoDBClient = require("./servicios/MongoDBClient");
const GameAPI = require("./servicios/GameAPI");

(async () => {
  const mongoClient = new MongoDBClient(MONGO_URI, MONGO_DB_NAME);
  const gameAPI = new GameAPI(API_KEY, BASE_URL, PAGE_SIZE);

  await mongoClient.connect();

  //AYUDA: Ejemplo de como insertar un documento haciendo uso del esquema Producto

  const response = {
    name: "Leather Jacket",
    price: 120.0,
    tags: ["clothing", "outerwear", "leather"],
    available: true,
  };

  const nuevoProducto = new Producto({
    nombre: response.name,
    precio: response.price,
    tags: response.tags,
    disponible: response.available,
  });

  // await mongoClient.insertar("Productos", nuevoProducto);

  // Realice las operaciones para insertar los datos aqui y mostrar consultas
  // >>>>>>>>>>>>

  async function loadData() {
    let videojuegos = await gameAPI.obtenerListaDeVideoJuegos();
    let empresasSet = new Set();
    let plataformasSet = new Set();
    console.log("Total Videojuegos:", videojuegos.length);
    let allGamesData = [];
    for (let videojuego of videojuegos) {
      let game = await gameAPI.obtenerVideoJuego(videojuego.id);

      const empresa =
        game.developers.length > 0
          ? game.developers[0].name
          : "Unknown Developer";
      empresasSet.add(empresa);

      game.platforms.forEach((p) => {
        plataformasSet.add(p.platform.name);
      });

      allGamesData.push({
        nombre: game.name,
        fechaLanzamiento: new Date(videojuego.released),
        generos: game.genres.map((g) => g.name),
        valoracion: game.rating,
        etiquetas: game.tags.map((t) => t.name),
        //entities
        plataformas: game.platforms.map((p) => p.platform.name),
        empresa: empresa,
      });
    }

    const empresasArray = Array.from(empresasSet).map((nombre) => ({ nombre }));
    const plataformasArray = Array.from(plataformasSet).map((nombre) => ({
      nombre,
    }));
    await mongoClient.insertarVarios("Empresas", empresasArray);
    await mongoClient.insertarVarios("Plataformas", plataformasArray);
    console.log("Empresas:", empresasArray.length);
    console.log("Plataformas:", plataformasArray.length);

    const empresaMap = new Map(empresasArray.map((e) => [e.nombre, e._id]));
    const plataformaMap = new Map(
      plataformasArray.map((p) => [p.nombre, p._id])
    );

    for (let i = 0; i < allGamesData.length; ++i) {
      let game = allGamesData[i];
      allGamesData[i].empresa = empresaMap.get(game.empresa);

      allGamesData[i].plataformas = game.plataformas.map((p) =>
        plataformaMap.get(p)
      );
    }

    await mongoClient.insertarVarios("Videojuegos", allGamesData);

    console.log("Datos guardados exitosamente");
  }
  await loadData();
  // >>>>>>>>>>>>

  await mongoClient.close();
})();

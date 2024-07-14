require("dotenv").config();
const axios = require("axios");

const Producto = require("./schemas").Producto;

const API_KEY = process.env.GB_APIKEY;
const BASE_URL = process.env.GB_API_ENDPOINT;
const PAGE_SIZE = process.env.PAGE_SIZE;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MongoDBClient = require("./servicios/MongoDBClient");
const GameAPI = require("./servicios/GameAPI");
const { Empresa, Plataforma } = require("./schemas");

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
    const generosDisponibles = [
      "Action",
      "Adventure",
      "Shooter",
      "RPG",
      "Strategy",
      "Puzzle",
      "Sports",
      "Racing",
      "Simulation",
      "Fighting",
      "Platformer",
      "Survival",
      "Horror",
      "Music",
      "Party",
    ];

    let empresas = await gameAPI.obtenerListaDeEmpresas();
    await mongoClient.insertarVarios("Empresas", empresas);

    let plaformas = await gameAPI.obtenerListaDePlataformas();
    await mongoClient.insertarVarios("Plataformas", plaformas);

    let videojuegos = await gameAPI.obtenerListaDeJuegos(
      empresas,
      plaformas,
      generosDisponibles
    );

    await mongoClient.insertarVarios("Videojuegos", videojuegos);
  }
  // await loadData();

  //queries

  const generos = ["Simulation", "Music"];
  const result = await mongoClient.consulta1(generos);
  console.log(result);

  await mongoClient.close();
})();

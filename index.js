require('dotenv').config();
const axios = require('axios');

const Producto = require('./schemas').Producto

const API_KEY = process.env.GB_APIKEY;
const BASE_URL = process.env.GB_API_ENDPOINT;
const PAGE_SIZE = process.env.PAGE_SIZE;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MongoDBClient = require('./servicios/MongoDBClient');
const GameAPI = require('./servicios/GameAPI');

(async () => {

    const mongoClient = new MongoDBClient(MONGO_URI, MONGO_DB_NAME);
    const gameAPI = new GameAPI(API_KEY, BASE_URL, PAGE_SIZE);

    await mongoClient.connect();

    //AYUDA: Ejemplo de como insertar un documento haciendo uso del esquema Producto

    const response = {
        name: "Leather Jacket",
        price: 120.00,
        tags: ["clothing", "outerwear", "leather"],
        available: true
    };

    const nuevoProducto = new Producto({
        nombre: response.name,
        precio: response.price,
        tags: response.tags,
        disponible: response.available
    });

    await mongoClient.insertar('Productos', nuevoProducto);



    // Realice las operaciones para insertar los datos aqui y mostrar consultas
    // >>>>>>>>>>>>



    // >>>>>>>>>>>>

    await mongoClient.close();
    
})();




// obtenerListaDeJuegos();

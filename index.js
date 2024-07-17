require('dotenv').config();
const axios = require('axios');

const Producto = require('./schemas').Producto
const Videojuego = require('./schemas').Videojuego
const Plataforma = require('./schemas').Plataforma
const Empresa = require('./schemas').Empresa

const API_KEY = process.env.RAWG_APIKEY;
const BASE_URL = process.env.RAWG_API_ENDPOINT;
const PAGE_SIZE = process.env.PAGE_SIZE;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const TOTAL_PAGES = 1;//Cantidad de paginas a leer en la API

const getVideojuegos = async () => {

    let fetchedGames = [];
    let page = 1;
    let theresNext = true;
    // let gamesCount = 0;

    try {
        while (page<=TOTAL_PAGES && theresNext){

            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${BASE_URL}games`, {
            params: {//Estos son los parametros para la solicitud HTTP a la API
                key: API_KEY,
                page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                page: page//Pagina de la API que se esta consumiendo
            }
            });
            
            const fetchedPage = res.data.results;
            // gamesCount = res.data.count;

            //Agregamos la pagina captada al array de juegos:
            fetchedGames = fetchedGames.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

            // console.log(`En la pagina ${page} hemos captados ${fetchedPage.length} videojuegos`);

            //Vamos a la siguiente pagina
            page++;
            theresNext = res.data.next;
        }

        // console.log(`Hemos captado un total de ${fetchedGames.length} juegos`);
        
        // console.log(fetchedGames[0]); 

        //Finalmente retornamos el array de videojuegos captados:
        return fetchedGames;
    } catch (error) {
        console.error('\n\nHubo un error solicitando los videojuegos: ', error);
    }
};


const getVideojuegosByEmpresa = async (DevId) => {

    let fetchedGames = [];
    // let page = 1;
    // let theresNext = true;
    // let gamesCount = 0;

    try {
        // while (page<=TOTAL_PAGES && theresNext){

            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${BASE_URL}games`, {
            params: {//Estos son los parametros para la solicitud HTTP a la API
                key: API_KEY,
                page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                // page: page,//Pagina de la API que se esta consumiendo
                developers : DevId
            }
            });
            
            const fetchedPage = res.data.results;
            // gamesCount = res.data.count;

            //Agregamos la pagina captada al array de juegos:
            fetchedGames = fetchedGames.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

            // Agregar el campo DeveloperId a cada juego
            fetchedGames = fetchedGames.map(game => {
                game.DeveloperId = DevId;
                return game;
            });

            // console.log(`En la pagina ${page} hemos captados ${fetchedPage.length} videojuegos`);

            //Vamos a la siguiente pagina
            // page++;
            // theresNext = res.data.next;
        // }

        // console.log(`Hemos captado un total de ${fetchedGames.length} juegos`);
        
        // console.log(fetchedGames[0]); 
        //Finalmente retornamos el array de videojuegos captados:
        return fetchedGames;
    } catch (error) {
        console.error('\n\nHubo un error solicitando los videojuegos: ', error.message);
    }
};


const getPlataformas = async () => {

    let fetchedPlatforms = [];
    let page = 1;
    let theresNext = true;
    // let gamesCount = 0;

    try {
        while (page<=TOTAL_PAGES && theresNext){

            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${BASE_URL}platforms`, {
            params: {//Estos son los parametros para la solicitud HTTP a la API
                key: API_KEY,
                page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                page: page//Pagina de la API que se esta consumiendo
            }
            });

            
            const fetchedPage = res.data.results;
            // PlatformsCount = res.data.count;

            //Agregamos la pagina captada al array de juegos:
            fetchedPlatforms = fetchedPlatforms.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

            // console.log(`En la pagina ${page} hemos captados ${fetchedPage.length} videojuegos`);

            //Vamos a la siguiente pagina
            page++;
            theresNext = res.data.next;
        }

        // console.log(`Hemos captado un total de ${fetchedPlatforms.length} plataformas`);
        // console.log(fetchedPlatforms[0]);

        //Retornamos el array de plataformas captadas:
        return fetchedPlatforms;
        
    } catch (error) {
        console.error('\n\nHubo un error solicitando las plataformas: ', error);
    }
};


const getEmpresas = async () => {
    let fetchedInterprise = [];
    let page = 1;
    // let gamesCount = 0;
    let theresNext = true;
    try {
        //Repartimos las paginas leidad entre los 3 endpoints y mientras tengamos almenos una paginas mas por leer.
        while (page<=TOTAL_PAGES && theresNext){
            theresNext = false;
            // //Hacemos la solicitud a la API y almacenamos la respuesta:
            // let resStores = await axios.get(`${BASE_URL}stores`, {
            //     params: {//Estos son los parametros para la solicitud HTTP a la API
            //         key: API_KEY,
            //         page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
            //         page: page//Pagina de la API que se esta consumiendo
            //     }
            // });

            //Las empresas vienen dadas por publicadores y desarrolladoras de los videojuegos:
            // let resPublishers = await axios.get(`${BASE_URL}publishers`, {
            //     params: {//Estos son los parametros para la solicitud HTTP a la API
            //         key: API_KEY,
            //         page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
            //         page: page//Pagina de la API que se esta consumiendo
            //     }
            // }); 
                
            let resDevelopers = await axios.get(`${BASE_URL}developers`, {
                params: {//Estos son los parametros para la solicitud HTTP a la API
                    key: API_KEY,
                    page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                    page: page//Pagina de la API que se esta consumiendo
                }
            });

            
            // const fetchedPage = res.data.results;
            // InterpriseCount = res.data.count;

            //Agregamos la pagina captada al array de juegos:
            // if(resStores.status>=200 && resStores.status<=299){
            //     fetchedInterprise = fetchedInterprise.concat(resStores.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)
            //     console.log(`En la pagina ${page} hemos captado ${resStores.data.results.length} Tiendas`);
            //     if (resStores.data.next) theresNext = true;
            // }
            

            //Validamos que ambas respuestas sean validas:
            // if(resPublishers.status>=200 && resPublishers.status<=299){
            //     fetchedInterprise = fetchedInterprise.concat(resPublishers.data.results);    
            //     // console.log(`En la pagina ${page} hemos captado ${resPublishers.data.results.length} Publicadores`);
            //     if (resPublishers.data.next) theresNext = true;
            // }
            
            if(resDevelopers.status>=200 && resDevelopers.status<=299){
                fetchedInterprise = fetchedInterprise.concat(resDevelopers.data.results);    
                // console.log(`En la pagina ${page} hemos captado ${resDevelopers.data.results.length} Desarrolladores`);
                if (resDevelopers.data.next) theresNext = true;
            }
            

            //Vamos a la siguiente pagina
            page++;
            // theresNext = resStores.data.next || resPublishers.data.next || restDevelopers.data.next
        }

        // console.log(`Hemos captado un total de ${fetchedInterprise.length} Empresas`);
        // console.log(fetchedInterprise[0]);
        // console.log(fetchedInterprise[40]);
        // console.log(fetchedInterprise[80]);
        
        //Finalmente retornamos el array de empresas solicitadas:
        return fetchedInterprise;

    } catch (error) {
        console.error('\n\nHubo un error solicitando las Empresas: ', error);
    }

};

const MongoDBClient = require('./servicios/MongoDBClient');
const GameAPI = require('./servicios/GameAPI');

(async () => {

    const mongoClient = new MongoDBClient(MONGO_URI, MONGO_DB_NAME);
    const gameAPI = new GameAPI(API_KEY, BASE_URL, PAGE_SIZE);

    await mongoClient.connect();

    //AYUDA: Ejemplo de como insertar un documento haciendo uso del esquema Producto

    // const response = {
    //     name: "Leather Jacket",
    //     price: 120.00,
    //     tags: ["clothing", "outerwear", "leather"],
    //     available: true
    // };

    // const nuevoProducto = new Producto({
    //     nombre: response.name,
    //     precio: response.price,
    //     tags: response.tags,
    //     disponible: response.available
    // });

    // await mongoClient.insertar('Productos', nuevoProducto);



    // Realice las operaciones para insertar los datos aqui y mostrar consultas
    // >>>>>>>>>>>>

    //Lectura de los datos:
    //Estos son los Arreglos con lo que se llenara la BD posteriormente:
    let videojuegos = [];
    let plataformas = [];
    let empresas = [];

    const getData = async () => {

        //Para poder resolver las 3 promesas de forma concurrente:
        const solictudes = await Promise.all([getVideojuegos(),getPlataformas(),getEmpresas()]);

        //Separamos los listados captados
        videojuegos = solictudes[0];
        // plataformas = solictudes[1];
        empresas = solictudes[2];

    }

    // await getData(); //Para esperar que termine la lectura de datos.
    
    //Christian, lo Recomendable  es colocar de este punto en adelante las inserciones para facilitar la secuencialidad con JS
    // console.log(`hemos captado ${videojuegos.length} Videojuegos`);
    // console.log(`hemos captado ${plataformas.length} Plataformas`);
    // console.log(`hemos captado ${empresas.length} Empresas`);

    mytest = await getVideojuegosByEmpresa(405);

    console.log(`hemos captado ${mytest.length} Videojuegos`);
    console.log(`hemos captado ${JSON.stringify(mytest[0], null, 2)} Videojuegos`);

    // >>>>>>>>>>>>

    



// //Inserto las videojuegos
// for (const juego of videojuegos) {
//     const nuevoVideojuego = new Videojuego({
//       id: juego.id,
//       name: juego.name,
//       slug: juego.slug,
//       released: juego.released,
//       rating: juego.rating,
//       rating_top: juego.rating_top,
//       ratings_count: juego.ratings_count,
//       reviews_text_count: juego.reviews_text_count,
//       added: juego.added,
//       metacritic: juego.metacritic,
//       playtime: juego.playtime,
//       suggestions_count: juego.suggestions_count,
//       updated: juego.update,
//       reviews_count: juego.reviews_count,
//     });
//     for (const rat of juego.ratings){//
//         nuevoVideojuego.ratings.push(rat.title, rat.count, rat.percent);
//     } 
//     for (const plat of juego.platforms){//
//         nuevoVideojuego.platforms.push(plat.id, plat.name, plat.slug);
//     } 
//     for (const plat of juego.parent_platforms){//
//         nuevoVideojuego.parent_platforms.push(plat.id, plat.name, plat.slug);
//     } 
//     for (const gen of juego.genres){//
//         nuevoVideojuego.genres.push(gen.id, gen.name, gen.slug);
//     } 
//     for (const tag of juego.tags){//
//         nuevoVideojuego.tags.push(tag.name, tag.slug);
//     } 
//     await mongoClient.insertar('Videojuego', nuevoVideojuego);
// }


// //Inserto las plataformas
//     for (const plat of plataformas) {
//         const nuevaPlataforma = new Plataforma({
//           id: plat.id,
//           name: plat.name,
//           slug: plat.slug,
//           games_count: plat.games_count
//         });
//         await mongoClient.insertar('Plataforma', nuevaPlataforma);
//     }
// //inserto las empresas
//     for (const empresa of empresas) {
//         const nuevaEmpresa = new Empresa({
//           id: empresa.id,
//           name: empresa.name,
//           slug: empresa.slug,
//           games_count: empresa.games_count,
//           games: empresa.games.id // linea basura que coloque para mentirle al codigo diciendo que insertaba algo
//         });
//         for (const gam of empresa.games){//se insertan los ids de los juegos de cada empresa para poder hacer busquedas posteriores de juegos por empresa desarrolladora
//             nuevaEmpresa.games.push(gam.id);
//         }  
//         await mongoClient.insertar('Empresa', nuevaEmpresa);
//     }



    await mongoClient.close();
})();




// obtenerListaDeJuegos();

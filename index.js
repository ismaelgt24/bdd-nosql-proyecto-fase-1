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
    // console.log(`buscando videojuegos de ${DevId}`);
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

            if (!fetchedPage || fetchedPage.length === 0) {
                console.warn(`No se encontraron videojuegos para el desarrollador con ID: ${DevId}`);
                return fetchedGames;
            }
            
            fetchedGames = fetchedGames.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

            // Agregar el campo DeveloperId a cada juego
            fetchedGames = fetchedGames.map(game => {
                game.DeveloperId = DevId;
                game.platforms = game.platforms.map( p => {return p.platform.id});//Si se quiere guardar la plataforma
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
        console.error('Hubo un error solicitando los videojuegos: ', error.message);
    }
};


const getPlataformas = async () => {
    
    //Leemos las platafromas disponibles desde la API:
    console.log("Leyendo Plataformas disponibles.\n")
    let fetchedPlatforms = [];
    let page = 1;
    let theresNext = true;

    try {
        // while (page<=TOTAL_PAGES && theresNext){

            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${BASE_URL}platforms`, {
            params: {//Estos son los parametros para la solicitud HTTP a la API
                key: API_KEY,
                page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                page: page//Pagina de la API que se esta consumiendo
            }
            });

            const fetchedPage = res.data.results;

            //Agregamos la pagina captada al array de juegos:
            fetchedPlatforms = fetchedPlatforms.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

            // console.log(`En la pagina ${page} hemos captados ${fetchedPage.length} videojuegos`);

            //Vamos a la siguiente pagina
        //     page++;
        //     theresNext = res.data.next;
        // }

        // console.log(`Hemos captado un total de ${fetchedPlatforms.length} plataformas`);
        // console.log(fetchedPlatforms[0]);

        console.log(`Se han leido ${fetchedPlatforms.length} Plataformas.`)
        //Retornamos el array de plataformas captadas:
        return fetchedPlatforms;
        
    } catch (error) {
        console.error('\n\nHubo un error solicitando las plataformas: ', error);
    }
};


const getEmpresas = async () => {
    //Asumimos que las empresas son quienes desarrollan los videojuegos
    //Por lo que llenaremos la coleccion empresas con desarrolladores
    console.log("Leyendo Empresas  disponibles.\n")

    let fetchedInterprise = [];
    let page = 1;
    let theresNext = true;

    try {
        // while (page<=TOTAL_PAGES && theresNext){
        //     theresNext = false;
                
            let resDevelopers = await axios.get(`${BASE_URL}developers`, {
                params: {//Estos son los parametros para la solicitud HTTP a la API
                    key: API_KEY,
                    page_size: PAGE_SIZE,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                    page: page//Pagina de la API que se esta consumiendo
                }
            });
            
            if(resDevelopers.status>=200 && resDevelopers.status<=299){
                fetchedInterprise = fetchedInterprise.concat(resDevelopers.data.results);    
                // console.log(`En la pagina ${page} hemos captado ${resDevelopers.data.results.length} Desarrolladores`);
                if (resDevelopers.data.next) theresNext = true;
            }

            //Vamos a la siguiente pagina
        //     page++;
        // }

        console.log(`Se han leido ${fetchedInterprise.length} Empresas.`)
        //Retornamos las empresas leidas:
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
        console.log("\n");
        
        //Para poder resolver las 3 promesas de forma concurrente:
        // const solictudes = await Promise.all([getVideojuegos(),getPlataformas(),getEmpresas()]);
        const solictudes = await Promise.all([getPlataformas(),getEmpresas()]);
        
        //Separamos los listados captados
        plataformas = solictudes[0];
        empresas = solictudes[1];

        //Leemos videojuegos por cada desarrollador para asi poder relacionar estas colecciones con el uso del patron Embeber
        // videojuego.DeveloperID -> Empresa.id
        console.log("Leyendo Videojuegos disponibles por Desarrolladores:\n")
        for (let i = 0; i < empresas.length; i++) {
            //Estas solicitudes deben ser realizadas secuencialmente para evitar bloquear el script con llamadas a la API.
            let empresa = empresas[i];
            try {
                //Lectura de los juegos desde la API de Rawg:
                console.log(`\tLeyendo videojuegos desarrollados por ${empresa.name}.`)
                let juegosLeidos = await getVideojuegosByEmpresa(empresa.id);

                //Impresion de prueba:
                console.log(`\tPrimer videojuego leido: ${juegosLeidos[0].platforms}`)

                //Aviso de juegos leidos:
                console.log(juegosLeidos.length ? `\tSe leyeron ${juegosLeidos.length} desarrollados por ${empresa.name}\n` : `No se encontraron juegos desarrollados por ${empresa.name}\n`);


                //Sumamos los juegos leidos a nuestro arreglo de videojuegos totales:
                videojuegos = videojuegos.concat(juegosLeidos);
            } catch (error) {
                console.error(`\tError obteniendo videojuegos para la empresa ${empresa.name}\n`);
            }
        }

        console.log(`\nHemos captado ${videojuegos.length} Videojuegos entre todos los desarrolladores!`);
        // console.log(`VideoJuego:\n${JSON.stringify(videojuegos[0], null, 2)} Videojuegos`);
    }
 
    await getData(); //Para esperar que termine la lectura de datos.
    
    //Christian, lo Recomendable  es colocar de este punto en adelante las inserciones para facilitar la secuencialidad con JS
    console.log(`hemos captado ${videojuegos.length} Videojuegos`);
    console.log(`hemos captado ${plataformas.length} Plataformas`);
    console.log(`hemos captado ${empresas.length} Empresas`);

    // >>>>>>>>>>>>

    



//Inserto las videojuegos
for (const juego of videojuegos) {
    const nuevoVideojuego = new Videojuego({
      id: juego.id,
      name: juego.name,
      slug: juego.slug,
      released: juego.released,
      rating: juego.rating,
      rating_top: juego.rating_top,
      ratings_count: juego.ratings_count,
      reviews_text_count: juego.reviews_text_count,
      added: juego.added,
      metacritic: juego.metacritic,
      playtime: juego.playtime,
      suggestions_count: juego.suggestions_count,
      updated: juego.update,
      reviews_count: juego.reviews_count,
      platforms: juego.platforms,
      DeveloperId: juego.DevId,
    });
    for (const rat of juego.ratings){//
        const aux = {
            tittle: rat.title,
            count: rat.count,
            percent: rat.percent,
        };
        nuevoVideojuego.tags.push(aux);
    } 
    for (const plat of juego.parent_platforms){//
        const aux = {
            id: plat.id,
            name: plat.name,
            slug: plat.slug,
        };
        nuevoVideojuego.tags.push(aux);
    } 
    for (const gen of juego.genres){//
        const aux = {
            id: gen.id,
            name: gen.name,
            slug: gen.slug,
        };
        nuevoVideojuego.tags.push(aux);
    } 
    for (const tag of juego.tags){//
        const aux = {
            name: tag.name,
            slug: tag.slug,
        };
        nuevoVideojuego.tags.push(aux);
    }
    await mongoClient.insertar('Videojuego', nuevoVideojuego);
}
//Inserto las plataformas
    for (const plat of plataformas) {
        const nuevaPlataforma = new Plataforma({
          id: plat.id,
          name: plat.name,
          slug: plat.slug,
          games_count: plat.games_count
        });
        await mongoClient.insertar('Plataforma', nuevaPlataforma);
    }
//inserto las empresas
    for (const empresa of empresas) {
        const nuevaEmpresa = new Empresa({
          id: empresa.id,
          name: empresa.name,
          slug: empresa.slug,
          games_count: empresa.games_count,
          games: empresa.games.id // linea basura que coloque para mentirle al codigo diciendo que insertaba algo
        });
        for (const gam of empresa.games){//se insertan los ids de los juegos de cada empresa para poder hacer busquedas posteriores de juegos por empresa desarrolladora
            nuevaEmpresa.games.push(gam.id);
        }  
        await mongoClient.insertar('Empresa', nuevaEmpresa);
    }

    await mongoClient.close();
})();




// obtenerListaDeJuegos();

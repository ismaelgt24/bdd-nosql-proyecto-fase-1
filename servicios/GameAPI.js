const axios = require('axios');

class GameAPI {

    constructor(apiKey, baseUrl, pageSize) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.pageSize = pageSize;
    }

    async obtenerListaDeJuegos() {
        let allGames = [];
        let currentPage = 1;

        const response = await axios.get(`https://www.giantbomb.com/api/platforms/?this.apiKey=67439c253b917bd65f84366c1c5f1c75292b7066&filter=install_base:gt:1000`, {
            params: {
                format: 'json' // Request JSON response format
              }
        });
        console.log(response.data.results)
        
    }

    async getVideojuegosByEmpresa(DevId) {
        // console.log(`buscando videojuegos de ${DevId}`);
        let fetchedGames = [];
    
        try {
    
            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${this.baseUrl}games`, {
            params: {//Estos son los parametros para la solicitud HTTP a la API
                key: this.apiKey,
                page_size: this.pageSize,//¿Por que retorna de 40 en 40 y no de 150 en 150?
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
                game.DeveloperID = DevId;
                game.platforms = game.platforms.map( p => {return p.platform.id});//Si se quiere guardar la plataforma
                return game;
            });
            
            // console.log(fetchedGames[0]); 
            //Finalmente retornamos el array de videojuegos captados:
            return fetchedGames;
        } catch (error) {
            console.error('Hubo un error solicitando los videojuegos: ', error.message);
        }
    };

    async getPlataformas(){
    
        //Leemos las platafromas disponibles desde la API:
        console.log("Leyendo Plataformas disponibles.\n")
        let fetchedPlatforms = [];
    
        try {

            // console.log(`Solicitud a realizar: ${this.baseUrl}platforms`)
            //Hacemos la solicitud a la API y almacenamos la respuesta:
            const res = await axios.get(`${this.baseUrl}platforms`, {
                params: {//Estos son los parametros para la solicitud HTTP a la API
                    key: this.apiKey,
                }
            });

            const fetchedPage = res.data.results;

            //Agregamos la pagina captada al array de juegos:
            fetchedPlatforms = fetchedPlatforms.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)
    
            console.log(`Se han recibido ${fetchedPlatforms.length} Plataformas.`)
            //Retornamos el array de plataformas captadas:
            return fetchedPlatforms;
            
        } catch (error) {
            console.error('\n\nHubo un error solicitando las plataformas: ', error);
        }
    };

    async getEmpresas() {
        //Asumimos que las empresas son quienes desarrollan los videojuegos
        //Por lo que llenaremos la coleccion empresas con desarrolladores
        console.log("Leyendo Empresas  disponibles.\n")
    
        let fetchedInterprise = [];
    
        try {
                //Hacemos la solicitud y la guardamos en un arreglo:
                let resDevelopers = await axios.get(`${this.baseUrl}developers`, {
                    params: {//Estos son los parametros para la solicitud HTTP a la API
                        key: this.apiKey,
                        page_size: this.pageSize,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                    }
                });
                
                //Evaluamos el estado de la respuesta de la solicitud:
                if(resDevelopers.status>=200 && resDevelopers.status<=299){
                    fetchedInterprise = fetchedInterprise.concat(resDevelopers.data.results);    
                    // console.log(`En la pagina ${page} hemos captado ${resDevelopers.data.results.length} Desarrolladores`);
                }
    
            console.log(`Se han recibido ${fetchedInterprise.length} Empresas.`)
            
            //Retornamos las empresas leidas:
            return fetchedInterprise;
    
        } catch (error) {
            console.error('\n\nHubo un error solicitando las Empresas: ', error);
        }
    
    };


    async getVideojuegosByEmpresa(DevId) {
        // console.log(`buscando videojuegos de ${DevId}`);
        let fetchedGames = [];

        try {

                //Hacemos la solicitud a la API y almacenamos la respuesta:
                const res = await axios.get(`${this.baseUrl}games`, {
                params: {//Estos son los parametros para la solicitud HTTP a la API
                    key: this.apiKey,
                    page_size: this.pageSize,//¿Por que retorna de 40 en 40 y no de 150 en 150?
                    developers : DevId
                }
                });
                
                const fetchedPage = res.data.results;

                if (!fetchedPage || fetchedPage.length === 0) {
                    console.warn(`No se encontraron videojuegos para el desarrollador con ID: ${DevId}`);
                    return fetchedGames;
                }
                
                fetchedGames = fetchedGames.concat(res.data.results);//El atributo results es el arreglo de videojuegos en la respuesta http (Segun la documentacion de RAWG.IO)

                // Agregar el campo DeveloperId a cada juego
                fetchedGames = fetchedGames.map(game => {
                    game.DeveloperID = DevId;
                    game.platforms = game.platforms.map( p => {return p.platform.id});//Si se quiere guardar la plataforma
                    return game;
                });

            //Finalmente retornamos el array de videojuegos captados:
            return fetchedGames;
        } catch (error) {
            console.error('Hubo un error solicitando los videojuegos: ', error.message);
        }
    };


}

module.exports = GameAPI;

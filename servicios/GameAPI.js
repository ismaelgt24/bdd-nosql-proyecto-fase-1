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

        const response = await axios.get(`https://www.giantbomb.com/api/platforms/?api_key=67439c253b917bd65f84366c1c5f1c75292b7066&filter=install_base:gt:1000`, {
            params: {
                format: 'json' // Request JSON response format
              }
        });
        console.log(response.data.results)
        
    }
}

module.exports = GameAPI;

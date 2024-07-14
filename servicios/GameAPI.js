const axios = require("axios");

class GameAPI {
  constructor(apiKey, baseUrl, pageSize) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.pageSize = pageSize;
  }

  async obtenerVideoJuego(id) {
    try {
      const response = await axios.get(`${this.baseUrl}games/${id}`, {
        params: {
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error al obtener empresa", err);
      return null;
    }
  }

  async obtenerListaDeVideoJuegos() {
    let allGames = [];
    let maxPage = 10;

    try {
      for (let i = 1; i <= maxPage; ++i) {
        const response = await axios.get(`${this.baseUrl}games`, {
          params: {
            key: this.apiKey,
            page: i,
            page_size: this.pageSize,
          },
        });

        allGames = allGames.concat(response.data.results);
      }

      return allGames;
    } catch (error) {
      console.error("Error al obtener videojuegos", error);
      return [];
    }
  }
}

module.exports = GameAPI;

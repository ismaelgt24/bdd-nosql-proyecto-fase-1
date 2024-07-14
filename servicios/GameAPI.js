const axios = require("axios");

class GameAPI {
  constructor(apiKey, baseUrl, pageSize) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.pageSize = pageSize;
  }

  async obtenerListaDeEmpresas() {
    try {
      const response = await axios.get(`${this.baseUrl}companies/`, {
        params: {
          api_key: this.apiKey,
          format: "json",
          limit: this.pageSize,
        },
      });
      return response.data.results.map((company) => ({ nombre: company.name }));
      //   console.log(response.data.results);
    } catch (error) {
      console.error("Error al obtener empresas", error);
      return [];
    }
  }

  async obtenerListaDePlataformas() {
    try {
      const response = await axios.get(`${this.baseUrl}platforms/`, {
        params: {
          api_key: this.apiKey,
          format: "json",
          limit: this.pageSize,
        },
      });
      return response.data.results.map((platform) => ({
        nombre: platform.name,
      }));
    } catch (error) {
      console.error("Error al obtener empresas", error);
      return [];
    }
  }

  obtenerGenerosAleatorios(generos, cantidad) {
    const generosSeleccionados = [];
    const indicesUsados = new Set();

    while (generosSeleccionados.length < cantidad) {
      const indiceAleatorio = Math.floor(Math.random() * generos.length);
      if (!indicesUsados.has(indiceAleatorio)) {
        generosSeleccionados.push(generos[indiceAleatorio]);
        indicesUsados.add(indiceAleatorio);
      }
    }

    return generosSeleccionados;
  }

  async obtenerListaDeJuegos(empresas, plataformas, generosDisponibles) {
    try {
      const response = await axios.get(`${this.baseUrl}games/`, {
        params: {
          api_key: this.apiKey,
          format: "json",
          limit: this.pageSize,
        },
      });

      return response.data.results.map((game) => ({
        nombre: game.name,
        fechaLanzamiento: game.date_added
          ? new Date(game.date_added)
          : new Date(),
        generos: this.obtenerGenerosAleatorios(
          generosDisponibles,
          Math.floor(Math.random() * 3) + 1
        ),
        plataformas: game.platforms
          .filter((platform) =>
            plataformas.some((p) => p.nombre === platform.name)
          )
          .map(
            (platform) =>
              plataformas.find((p) => p.nombre === platform.name)._id
          ),
        empresa: empresas[Math.floor(Math.random() * empresas.length)]._id,
        valoracion: parseFloat((Math.random() * 10).toFixed(1)),
        etiquetas: game.image_tags
          ? game.image_tags.map((tag) => tag.name)
          : [],
      }));
    } catch (error) {
      console.error("Error al obtener empresas", error);
      return [];
    }
  }
}

module.exports = GameAPI;

const mongoose = require('mongoose');

// ############################# EJEMPLO #############################
// ########################## NO MODIFICAR ###########################

/**
 * Ejemplo de creacion de esquema para MongoDB utilizando Mongoose.
 * 
 * @typedef {Object} Producto
 * @property {String} nombre - El nombre del producto. Este campo es obligatorio.
 * @property {Number} precio - El precio del producto. Debe ser un número mayor o igual a 0.
 * @property {String[]} tags - Una lista de etiquetas asociadas con el producto.
 * @property {Boolean} cantidad - Indica si el producto está disponible en cantidad. Valor por defecto: true.
 */
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, min: 0 },
    tags: [String],
    disponible: { type: Boolean, default: true },
});

/**
 * Modelo de Mongoose para la colección de productos.
 * 
 * @type {Model<Producto>}
 */
const Producto = mongoose.model('Producto', productoSchema);





// ############################# ESQUEMAS QUE SE VAN A EVALUAR #############################
// #################################### MODIFICAR ##########################################


const videojuegoSchema = new mongoose.Schema({
  //Estas 2 siguientes referencian a las otras 2 colecciones
  DeveloperID : {type: Number, required: true },
  platforms: {type:[Number]},
  
  // Demas atributos:
  id: { type: Number, required: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  released: { type: Date },
  rating: { type: Number },
  rating_top: { type: Number },
  ratings: [{
    title: { type: String },
    count: { type: Number },
    percent: { type: Number }
  }],
  ratings_count: { type: Number },
  reviews_text_count: { type: Number },
  added: { type: Number },
  metacritic: { type: Number },
  playtime: { type: Number },
  suggestions_count: { type: Number },
  updated: { type: Date },
  reviews_count: { type: Number },
  parent_platforms: [{
    id: { type: Number },
    name: { type: String, minlength: 1, maxlength: 100 },
    slug: { type: String }
  }],
  genres: [{
    name: { type: String },
    slug: { type: String },
  }],
  tags: [{
    name: { type: String },
    slug: { type: String, match: /^[a-zA-Z0-9_]+$/ },
  }],
});

/**
 * Modelo de Mongoose para la colección de videojuegos.
 * 
 * @type {Model<Videojuego>}
 */
const Videojuego = mongoose.model('Videojuego', videojuegoSchema);

const plataformaScheme = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  games_count: { type: Number },
});

/**
 * Modelo de Mongoose para la colección de plataformas.
 * 
 * @type {Model<Plataforma>}
 */
const Plataforma = mongoose.model('Plataforma', plataformaScheme);

const empresaScheme = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  games_count: { type: Number, required: true },
  games: [{ type: Number }],
});

/**
 * Modelo de Mongoose para la colección de empresas.
 * 
 * @type {Model<Empresa>}
 */
const Empresa = mongoose.model('Empresa', empresaScheme);

// Exportar todos los modelos
module.exports = {
  Producto,
  Videojuego,
  Plataforma,
  Empresa
};

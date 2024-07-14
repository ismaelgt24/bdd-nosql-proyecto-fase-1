const mongoose = require("mongoose");

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
const Producto = mongoose.model("Producto", productoSchema);

// ############################# ESQUEMAS QUE SE VAN A EVALUAR #############################
// #################################### MODIFICAR ##########################################

const videojuegoSchema = new mongoose.Schema({
  // Define las estructura de los documentos videojuegos aqui
  nombre: { type: String, required: true },
  fechaLanzamiento: { type: Date, required: true },
  generos: [{ type: String, required: true }],
  plataformas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plataformas",
      required: true,
    },
  ],
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empresas",
    required: true,
  },
  valoracion: { type: Number, min: 0, max: 10, required: true },
  etiquetas: [String],
});

/**
 * Modelo de Mongoose para la colección de videojuegos.
 *
 * @type {Model<Videojuego>}
 */
const Videojuego = mongoose.model("Videojuego", videojuegoSchema);

const plataformaScheme = new mongoose.Schema({
  // Define las estructura de los documentos plataforma aqui
  nombre: { type: String, required: true },
});

/**
 * Modelo de Mongoose para la colección de plataformas.
 *
 * @type {Model<Plataforma>}
 */
const Plataforma = mongoose.model("Plataforma", plataformaScheme);

const empresaScheme = new mongoose.Schema({
  // Define las estructura de los documentos empresa aqui
  nombre: { type: String, required: true },
});

/**
 * Modelo de Mongoose para la colección de empresas.
 *
 * @type {Model<Empresa>}
 */
const Empresa = mongoose.model("Empresa", empresaScheme);

// Exportar todos los modelos
module.exports = {
  Producto,
  Videojuego,
  Plataforma,
  Empresa,
};

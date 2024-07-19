
const { MongoClient } = require('mongodb');

class MongoDBClient {
 
    constructor(uri, dbName) {
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = dbName;
        this.db = undefined;
        this.uri = uri;
    }

    /**
     * No recomiendo tocar esta funcion
     */
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log(`Conexión exitosa a MongoDB`);
            console.log(`Conectado a la base de datos: ${this.dbName}`);
            console.log(`URL de conexión: ${this.uri}`);
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
        }
    }

    /**
     * No recomiendo tocar esta funcion
     */
    async close() {
        try {
            await this.client.close();
            console.log('Desconectado de MongoDB');
        } catch (error) {
            console.error('Error al desconectar de MongoDB:', error);
        }
    }


    /**
     * Consulta de ejemplo
     * 
     */

    async consultaEjemplo(){

        const productosCollection = this.db.collection('Productos');
        const productos = await productosCollection.find({}).toArray();

        return productos;
     
    }



    //Abajo estan las funciones que pueden ser modificadas por usted. Si quiere agregar funciones extras como delete y update, no hay problema.


    /**
     * Inserta un documento en una colección específica en MongoDB. 
     *
     * @param {string} coleccion - El nombre de la colección en la cual se insertará el documento.
     * @param {Object} documento - El documento que se va a insertar en la colección.
     * @returns {Promise<void>} - Una promesa que se resuelve cuando la inserción es exitosa.
     * @throws {Error} - Lanza un error si la inserción falla.
     * 
     * Nota: Esta es una funcion basica para insertar, lo importante es el esquema de los modelos definidos y como los llames.
     * Pero si quieres la puedes modificar.
     */

    async insertar(coleccion, model) {
        try {
                const collection = this.db.collection(coleccion);
            const result = await collection.insertOne(model.toObject());
            console.log(`Documento insertado con éxito en la colección ${coleccion}:`, result.insertedId);
        } catch (error) {
            console.error(`Error al insertar el documento en la colección ${coleccion}:`, error);
        }
    }

    /**
     * Inserta varios objetos al mismo tiempo
     * 
     * Nota: Esta funcion es opcional. Te puede ser de utilidad.
     */

    async insertartVarios(coleccion, model){
        /**
        >>>>>>>>>>>>>>>>>>>>>>>>
        CODIGO AQUI
        >>>>>>>>>>>>>>>>>>>>>>>>
        */
    }

    /**
     * Dado n géneros, buscar los juegos que contengan todos esos géneros.
     * 
     */

    async consulta1(generos){

        try{
            //Validamos que el arreglo pasado no esta vacio
            if (!generos || !generos.length) {
                throw new Error("Debes proporcionar una lista de géneros no vacía");
                return [];
            }

            //Obtenemos la coleccion:
            const collection = this.db.collection("Videojuego");
            
            // Con este Query garantizamos que para el arreglo de obteneros 'genres'
            // para cada objeto su atributo name debe estar en el arreglo de nombres pasado por parametros:
            const query = { genres: { $elemMatch: { name: { $in: generos } } } };

            // Ejecuta la consulta y devuelve los juegos encontrados
            const r = await collection.find(query).toArray();

            // console.log(r.length)
            return r;
        }catch(error){
            console.log(error.message)
        }
    }

    /**
     * Buscar juegos lanzados dentro de un rango de fechas (xx/xx/xxxx -yy/yy/yyyy). de n companias. 
     * 
     */

    async consulta2(empresas, fechaInicio, fechaFin){

        try{
            const collection = this.db.collection("Videojuego");

              const r = await collection.aggregate([
                {   //Todos los juegos cuya fecha de lanzamiento este entre las fechas dadas
                    $match: {
                        released: {
                            $gte: fechaInicio,
                            $lt: fechaFin
                        }//,
                        //DeveloperID: { $in: empresas }
                    }
                },
                {   //Buscamos asociar cada juego son su empresa desarrolladores
                    $lookup: {
                        from: "Empresa",
                        localField: "DeveloperID",
                        foreignField: "id",
                        as: "Empresa"
                    }
                },
                {//Tomamos en cuenta solo las empresas cuyo nombre esten en el array pasado por parametros
                    $match: {
                        "Empresa.name": { $in: empresas }
                    }
                },
                {//Tomamos solamente los atributos relevantes
                    $project: {
                        gameID : "$id",
                        gameSlug : "$slug",
                        gameName: "$name",
                        gameReleaseDate : "$released",
                        EmpresaName: "$Empresa.name",
                        EmpresaID: "Empresa.id"
                    }
                }
            ]).toArray();

            // console.log(r.length)
            return r;
        
        }catch(error){
            console.log(error.message)
        }

    };

    /**
     * Buscar juegos que estén disponibles en más de n plataformas y mostrat tambien cuáles plataformas son.
     * 
     */

    async consulta3(cantidadDePlataformas){

            const collection = this.db.collection("Videojuego");

            const r = await collection.aggregate([
                {

                    //Solo los videojuegos que esten para mas de 'cantidadDePlataformas' plataformas
                    $match: {
                        //$id: 405,
                        $expr: {
                            $gt: [{ $size: "$platforms" },cantidadDePlataformas]
                        }
                    }
                },
                {   //hacemos el match para cada plataforma disponible
                    $lookup: {
                        from: "Plataforma",
                        localField: "platforms",
                        foreignField: "id",
                        as: "platformsData"
                    }
                },
                {   //Proyectamos los atributos importantes
                    $project: {
                        id:1,
                        DeveloperID:1,
                        name:1,
                        slug:1,
                        platformsData:1
                    }
                }
            ]).toArray();

            
            return r;
    }

    /**
     * Contar juegos por n empresas desarrolladoras con valoración mayor a x.
     * 
     */

    async consulta4(empresas, valoracion){

        const collection = this.db.collection("Empresa");

        const r = await collection.aggregate([
            {//Tomamos en cuenta solo las empresas cuyo nombre esten en el array pasado por parametros
                $match: {
                    name: { $in: empresas }
                }
            },
            {//Juntamos Empresas y VideoJuegos
                $lookup: {
                    from: "Videojuego",
                    localField: "id",
                    foreignField: "DeveloperID",
                    as: "Videojuegos"
                }
            },
            {//Desempaquetamos por videojuegos para poder contar los juegos
                $unwind: "$Videojuegos"
            },
            {//Filtramos los juegos despues de desempaquetar
                $match: {
                    $expr: {
                        $gt: ["$Videojuegos.rating",valoracion]//error rating not defined
                    }
                }
            },
            {//Esta proyeccion es para poder visualizar mejor al probar
                $project: {
                  empresa: "$name", 
                  VideoGame: "$Videojuegos.name"
                }
            },
            {//Contamos los videojuegos pertenecientes a las empresas con un rating mayor al indicado
                $count: "CantidadTotalDeJuegos"
            }

        ]).toArray();

        return r;
    }

    /**
     * Buscar juegos con una calificación mayor al promedio y que tengan mas de n generos
     * 
     */

    async consulta5(cantidadDeGeneros){

        const collection = this.db.collection("Videojuego");        

        const r = await collection.aggregate([
            {//Esto es para calcular el promedio del rating de todos los documentos de la coleccion videojuegos y mantener ese campo en una "variable"
                $setWindowFields: {
                    output: {
                        avgRating: { $avg: "$rating" }
                    }
                }
            },
            {   //Evaluamos que se cumplan las 2 condiciones
                $match: {
                    $expr: {
                        $and: [
                            { $lt: [cantidadDeGeneros, { $size: "$genres" }] },//Mas de X generos
                            { $gt: ["$rating", "$avgRating"] }//Rating meyor al promedio
                        ]
                    }
                }
            },
            {
                $project: {
                    id: 1,
                    name: 1,
                    rating:1,
                    avgRating:1,
                    genresCount: { $size: "$genres" }
                }
            }
        ]).toArray();

        return r

    }

    /**
     * Juegos con etiquetas específicas y ordenados por fecha de lanzamiento. 
     * 
     */

    async consulta6(etiquetas){
        try {
            // Validamos que el arreglo pasado no esté vacío
            if (!etiquetas || !etiquetas.length) {
              throw new Error("Debes proporcionar una lista de etiquetas no vacía");
              return [];
            }
        
            // Obtenemos la colección
            const collection = this.db.collection("Videojuego");
        
            // Construimos el pipeline de agregación
            const pipeline = [
              {
                // Filtra juegos cuyos nombres esten en el array etiquetas
                $match: {
                  tags: { $elemMatch: { name: { $in: etiquetas } } },
                },
              },
              {
                // Ordenamos por fecha de lanzamiento
                $sort: { released: 1 }, // 1 para orden ascendente, -1 para descendente
              },
              {//hacemos project para los atributos relevantes
                $project: {
                    id: 1,
                    name: 1,
                    slug: 1,
                    released: 1,
                    tags:1,
                    // tagsName: {
                    //   $map: {
                    //     input: "$tags", // Arreglo de entrada a la función map
                    //     as: "$t", // Alias para cada elemento del arreglo
                    //     in: "$$t.name"}
                    //   }
                    // }
                  }
                  
              }
            ];
        
            // Ejecuta la consulta y devuelve los juegos encontrados
            const r = await collection.aggregate(pipeline).toArray();
        
            return r;
          } catch (error) {
            console.log(error.message);
          }

    }

    /**
     * Calificación promedio de juegos por género específico.
     * 
     */

    async consulta7(generos){
        /**
        >>>>>>>>>>>>>>>>>>>>>>>>
        CODIGO AQUI
        >>>>>>>>>>>>>>>>>>>>>>>>
        */
        return []

    }

    /**
     * Buscar juegos por una palabra clave en el nombre. 
     * 
     */

    async consulta8(palabra){
        /**
        >>>>>>>>>>>>>>>>>>>>>>>>
        CODIGO AQUI
        >>>>>>>>>>>>>>>>>>>>>>>>
        */
        return []

    }

    /**
     * Top 5 juegos mejor calificados por género específico y excluyendo ciertos empresas desarrolladoras
     * 
     */

    async consulta9(generos, empresas){
        /**
        >>>>>>>>>>>>>>>>>>>>>>>>
        CODIGO AQUI
        >>>>>>>>>>>>>>>>>>>>>>>>
        */
        return []

    }

    /**
     *  Juegos por géneros y plataformas con proyección de campos. 
     * 
     */

    async consulta10(generos, plataformas){
        /**
        >>>>>>>>>>>>>>>>>>>>>>>>
        CODIGO AQUI
        >>>>>>>>>>>>>>>>>>>>>>>>
        */
        return []

    }

}

module.exports = MongoDBClient;


require('dotenv').config();
const MongoDBClient = require('./servicios/MongoDBClient');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');


const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

async function migrateData() {
    const mongoClient = new MongoDBClient(MONGO_URI, MONGO_DB_NAME);
    await mongoClient.connect();

    const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
    const session = await driver.session({ database: 'neo4j' });
    console.log("Neo4j Conectado!");

    try {

        // Migrar Empresas primero
        const empresas = await mongoClient.getEmpresas();
        console.log(`Hemos leido ${empresas.length} empresas.`);
         for (const empresa of empresas) {
           await session.run(
             `CREATE (e:Empresa {
               id: $id, name: $name, slug: $slug, games_count: $games_count
             })`,
             {
               id: empresa.id, name: empresa.name, slug: empresa.slug,
               games_count: empresa.games_count
             }
           );
         }
        console.log('Empresas Migradas!.');

       // Migrar Plataformas
       
        const plataformas = await mongoClient.getPlataformas();
        console.log(`Hemos leido ${plataformas.length} plataformas.`)

         for (const plataforma of plataformas) {
           await session.run(
             `CREATE (p:Plataforma {
               id: $id, name: $name, slug: $slug, games_count: $games_count
             })`,
             {
               id: plataforma.id, name: plataforma.name, slug: plataforma.slug,
               games_count: plataforma.games_count
             }
           );
         }
        console.log('Plataformas Migradas!.');

        //Migrar generos
        const genres = await mongoClient.getGeneros();
        console.log(`Hemos leido ${genres.length} Generos.`);

        for (const genre of genres) {
            await session.run(
                `CREATE (g:Genero { name: $name })`,
                { name: genre.name }
            );
        }
        console.log('Generos migrados!.');

        //Migrar Etiquetas
        const tags = await mongoClient.getTags();
        console.log(`Hemos leido ${tags.length} tags.`)

        for(const tag of tags){//Se itera sobre los valores y no los objetos al solo ser {clave:valor}
            // console.log(tag)
            await session.run(
             `CREATE (t:tags { name: $name })`,
             { name: tag.name }
           );
        }
        console.log('Tags migrados!.');

        //Migrar los videojuegos
       const videojuegos = await mongoClient.getVideojuegos();
       console.log(`Hemos leido ${videojuegos.length} Videojuegos.`)

       let v = videojuegos.slice(0,10)//AQUI RESTRINJO LA CANTIDAD DE VIDEOJUEGOS

        for (const juego of v) {
            // console.log(juego)
           // Crear nodo de Videojuego
           await session.run(
             `CREATE (v:Videojuego {
               id: $id, 
               slug: $slug, 
               name: $name, 
               rating: $rating, 
               rating_top: $rating_top, 
               ratings_count: $ratings_count, 
               reviews_text_count: $reviews_text_count,
               added: $added, 
               metacritic: $metacritic, 
               playtime: $playtime, 
               suggestions_count: $suggestions_count,
               reviews_count: $reviews_count
             })`,
             {
               id: juego.id, 
               slug: juego.slug, 
               name: juego.name, 
               rating: juego.rating, 
               rating_top: juego.rating_top, 
               ratings_count: juego.ratings_count,
               reviews_text_count: juego.reviews_text_count, 
               added: juego.added, 
               metacritic: juego.metacritic,
               playtime: juego.playtime, 
               suggestions_count: juego.suggestions_count,
               reviews_count: juego.reviews_count
             }
           );


           //Ahora migramos las relaciones de los videojuegos con los otros nodos:

            // Migrar relación con la Empresa
            await session.run(
                `MATCH (v:Videojuego {id: $vid}), (e:Empresa {id: $eid})
                CREATE (v)-[:DESARROLLADO_POR]->(e)`,
                { vid: juego.id, eid: juego.DeveloperID }
            );
            // console.log('Las relaciones Videojuego-Desarrollador fueron migradas!.');

            // Migrar relaciones con Plataformas
            for (const plataformaId of juego.platforms) {
             await session.run(
               `MATCH (v:Videojuego {id: $vid}), (p:Plataforma {id: $pid})
                CREATE (v)-[:DISPONIBLE_EN]->(p)`,
               { vid: juego.id, pid: plataformaId }
             );
           }
           // console.log('Las relaciones Videojuego-Plataforma fueron migradas!.');

           //Migrar la relacion con los nuevos nodos genero
            for (const genre of juego.genres){
                await session.run(
                   `MATCH (v:Videojuego {id: $vid}), (g:Genero {name: $name})
                    CREATE (v)-[:PERTENECE_A]->(g)`,
                   { vid: juego.id, name: genre.name }
                );
            }
            // console.log('Las relaciones Videojuego-Genero fueron migradas!.');


            //Migrar la relacion con los nuevos nodos tags
            for (const tag of juego.tags){
                await session.run(
                   `MATCH (v:Videojuego {id: $vid}), (t:tags {name: $name})
                    CREATE (v)-[:ETIQUETADO_COMO]->(t)`,
                   { vid: juego.id, name: tag.name }
                );
            }
            // console.log('Las relaciones Videojuego-tag fueron migradas!.');


     }

     console.log('Videojuegos Migrados!.')

    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        console.log('La base de datos fue migrada exitosamente!.');
        await session.close();
        await driver.close();
        console.log('Neo4j desconectado.');

        await mongoClient.close();
        console.log('MongoDB desconectado.')
    }
}

migrateData();

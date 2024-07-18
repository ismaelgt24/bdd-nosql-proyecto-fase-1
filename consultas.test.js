require('dotenv').config();
const MongoDBClient = require('./servicios/MongoDBClient');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let client;

beforeEach(async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  client = new MongoDBClient(MONGO_URI, MONGO_DB_NAME);
  await client.connect();
});

afterEach(async () => {
  await client.close();
});

describe('Consultas', () => {

    test('Consulta 1: Devuelve un array con juegos con generos asociados', async () => {
        const generos = ['Action', 'Adventure']; // Agregar generos a esta lista, por ejemplo ['Action', 'Adventure']
        const result = await client.consulta1(generos); 
        console.info('Consulta 1: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 2: Devuelve un array con juegos lanzados entre fechas, de n empresas', async () => {

        //Usaremos las empresas dadas de ejemplo:
        const empresas = ['Nintendo', 'Activision', 'EA']; // Agregar empresas a esta lista, por ejemplo ['Nintendo', 'Activision', 'EA']

        //Fechas para juegos del todo el 2023
        const fechaInicio = new Date(2023, 1, 1); // Agregar fecha por ejemplo 1/10/2012
        const fechaFin = new Date(2023, 12, 31);; // Agregar fecha por ejemplo 5/10/2022
        const result = await client.consulta2(empresas, fechaInicio, fechaFin); 
        console.info('Consulta 2: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 3: Devuelve un array con juegos lanzados entre fechas, de n empresas', async () => {
        const cantidadDePlataformas = undefined; // Agregar un numero, por favor que sea mas de 1
        const result = await client.consulta3(cantidadDePlataformas); 
        console.info('Consulta 3: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 4: Retorna un  juegos por n empresas desarrolladoras con valoración mayor a x', async () => {
        const empresas = []; // Agregar empresas a esta lista, por ejemplo ['Nintendo', 'Activision', 'EA']
        const valoracion = undefined; // Agregar un numero, por ejemplo 7.3
        const result = await client.consulta4(empresas, valoracion); 
        console.info('Consulta 4: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 5: Retorna juegos con una calificación mayor al promedio y que tengan mas de n generos', async () => {
        const cantidadDeGeneros = undefined; // Agregar un numero, por ejemplo 3
        const result = await client.consulta5(cantidadDeGeneros); 
        console.info('Consulta 5: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 6: Retorna juegos con etiquetas específicas y ordenados por fecha de lanzamientos', async () => {
        const etiquetas = []; // Agregar empresas a esta lista, por ejemplo ['Multiplayer', 'Singleplayer']
        const result = await client.consulta8(etiquetas); 
        console.info('Consulta 6: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 7: Retorna un array con los generos y su valoracion promedi.', async () => {
        const generos = []; // Agregar generos a esta lista, por ejemplo ['Action', 'Adventure', 'FPS']
        const result = await client.consulta7(etiquetas); 
        console.info('Consulta 7: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 8: Retorna un array de juegos con la palabra clave en su nombre', async () => {
        const palabra = undefined; // Agregar una palabra como por ejemplo 'WAR'
        const result = await client.consulta8(etiquetas); 
        console.info('Consulta 8: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 9: Retorna el top 5 juegos mejor calificados por género específico y excluyendo ciertos empresas desarrolladoras', async () => {
        const generos = []; // Agregar generos a esta lista, por ejemplo ['Action', 'Adventure', 'FPS']
        const empresas = []; // Agregar empresas a esta lista, por ejemplo ['Nintendo', 'Activision', 'EA']
        const result = await client.consulta9(generos, empresas); 
        console.info('Consulta 9: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });

    test('Consulta 10: Retorna juegos por géneros y plataformas con proyección de campos', async () => {
        const generos = []; // Agregar generos a esta lista, por ejemplo ['Action', 'Adventure', 'FPS']
        const plataformas = []; // Agregar empresas a esta lista, por ejemplo ['Nintendo', 'Activision', 'EA']
        const result = await client.consulta9(generos, plataformas); 
        console.info('Consulta 10: ', result)
        expect(result).toBeInstanceOf(Array); 
        expect(result).not.toEqual([]);
    });



});

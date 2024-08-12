const neo4j = require('neo4j-driver');

// Consulta 1
async function consulta1(genres) {
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (genres.length > 0) {
		try {

			const result = await session.run(
				`MATCH (j:Videojuego)-[:PERTENECE_A]->(g:Genero)
					WHERE g.name IN $genres
					RETURN j;`,
				{ genres:genres }
			);
		  return result.records.map(record => record.get('j'));

		} catch (error) {
		  console.error('Error en la  consulta 1:', error);

		}finally{
			await session.close();
			await driver.close();
		}
	}else {
    	return null;
	}
};


//Consulta 2
async function consulta2(Empresa,n) {
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (Empresa && n>0) {
	    try {

	    	const query = `MATCH (j:Videojuego)-[:DESARROLLADO_POR]->(e:Empresa {name: "${Empresa}"})
							RETURN j
							LIMIT ${n}`
	    	const result = await session.run(query,{});
			return result.records.map(record => record.get('j'));

	    } catch (error) {
	      console.error('Error en la  consulta 3:', error);

	    }finally{
	    	await session.close();
				await driver.close();
	    }
  } else {
    return null;
  }
};


//Consulta 3
async function consulta3(plataformas) {
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (plataformas.length > 0) {
	    try {
	    	// console.log("AQUI")
	    	const result = await session.run(
	    		`MATCH (j:Videojuego)-[:DISPONIBLE_EN]->(p:Plataforma)
					WHERE p.name IN $plataformas
					WITH j, COLLECT(p) AS plataformas
					WHERE SIZE(plataformas) >= $n
					RETURN j`,
					{plataformas:plataformas,n:plataformas.length});
			return result.records.map(record => record.get('j'));

	    } catch (error) {
	      console.error('Error en la  consulta 3:', error);

	    }finally{
	    	await session.close();
				await driver.close();
	    }
	} else {
		return null;
	}
};

//Consulta 4
async function consulta4(plataformas) {
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (plataformas> 0) {
	    try {
	    	// console.log("AQUI")
	    	const result = await session.run(
	    		`MATCH (j:Videojuego)-[:DISPONIBLE_EN]->(p:Plataforma)
					WITH j, COUNT(DISTINCT p) AS numPlataformas
					WHERE numPlataformas > $n
					RETURN COUNT(j) AS totalJuegos`,
					{n:plataformas});
			return result.records[0].get('totalJuegos').low;
			//Aqui la salida tiene el formato 'Integer { low: 10, high: 0 }', elegimos low para devolver un entero consistente.

	    } catch (error) {
	      console.error('Error en la  consulta 4:', error);

	    }finally{
	    	await session.close();
				await driver.close();
	    }
	} else {
	return null;
	}
};

//Consulta 5
async function consulta5(rating) {
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (rating >= 0) {
	    try {
	    	// console.log("AQUI")
	    	const result = await session.run(
	    		`MATCH (v:Videojuego)
					WHERE v.rating > $rating
					RETURN v`,
					{rating:rating});
			return result.records.map(record => record.get('v'));
	    } catch (error) {
	      console.error('Error en la  consulta 5:', error);

	    }finally{
	    	await session.close();
				await driver.close();
	    }
	} else {
		return null;
	}
};

//Consulta 6
async function consulta6(tags, generos){
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (generos.length>0 && tags.length>0) {
	    try {
	    	// console.log("AQUI")
	    	const result = await session.run(
	    		`MATCH (v:Videojuego)-[:ETIQUETADO_COMO]->(t:tags)
					WHERE t.name IN $tags
					MATCH (v)-[:PERTENECE_A]->(g:Genero)
					WHERE g.name IN $generos
					RETURN v`, 
				{tags:tags,nTags:tags.length,generos:generos,nGen:generos.length});
				return result.records.map(record => record.get('v'));
	    } catch (error) {
	      console.error('Error en la  consulta 6:', error);

	    }finally{
	    	await session.close();
				await driver.close();
	    }
	} else {
		return null;
	}
};

//Consulta 7
async function consulta7(generos){
	//Conectamos con nuestra BD en Neo4j
	const driver = await neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = await driver.session();
	if (generos.length>0) {
	    try {
	    	// console.log("AQUI")
	    	const result = await session.run(
	    		`MATCH (v:Videojuego)-[:PERTENECE_A]->(g:Genero)
					WHERE g.name IN $generos
					WITH v,g, AVG(v.rating) AS avgRating
						WHERE v.rating>=avgRating
					RETURN v`, 
				{generos:generos});
				return result.records.map(record => record.get('v'));
	    } catch (error) {
	    	console.error('Error en la  consulta 6:', error);

	    }finally{
		    await session.close();
				await driver.close();
	    }
	} else {
		return null;
	}
};







async function ejecutarConsultasFase2(){

	//Conectamos con nuestra BD en Neo4j
	const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
	const session = driver.session();


	//Consulta 1: Buscar los juegos que contengan n géneros:
    let generos = ['Action', 'Adventure'];
    r1 = await consulta1(generos);
    console.log("\nResultado de la Consulta 1: ");
    console.log(r1);

    //Consulta 2: Buscar n juegos que pertenezcan a una empresa.
    const Empresa = "Ubisoft"
    const n = 10;
    r2 = await consulta2(Empresa,n);
    console.log("\nResultado de la consulta 2: ");
    console.log(r2);

    //Consulta 3: Buscar juegos que estén disponibles en más de n plataformas.
    const plataformas = ["PlayStation 5", "Xbox One", "PC"]
    r3 = await consulta3(plataformas);
    console.log("\nResultado de la consulta 3: ");
    console.log(r3);

	// Consulta 4: Contar nodos de juegos que estén relacionados a más de n plataformas.
    const Nplataformas = 1;
    r4 = await consulta4(Nplataformas);
    console.log("\nResultado de la consulta 4: ");
    console.log(r4);

	// Consulta 5: Buscar juegos con una calificación mayor a n.
    const rating = 2;
    r5 = await consulta5(rating);
    console.log("\nResultado de la consulta 5: ");
    console.log(r5);

	// Consulta 6:Juegos que estén relacionados a n etiquetas, y m géneros.
    const tags = ["Singleplayer","Multiplayer"];
    generos = ['Action', 'Adventure']; 
    r6 = await consulta6(tags, generos);
    console.log("\nResultado de la consulta 6: ");
    console.log(r6);

	//Consulta 7
    generos = ['RPG', 'FPS']; 
    r7 = await consulta7(generos);
    console.log("\nResultado de la consulta 7: ");
    console.log(r7);

	// await session.close();
	// await driver.close();
}

ejecutarConsultasFase2();

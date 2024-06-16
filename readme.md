# Proyecto de Base de Datos NoSQL

Este proyecto requiere una versión de Node.js compatible con la 12.11.0. Se recomienda instalar esta versión utilizando nvm (Node Version Manager), que es compatible tanto con Windows como con Linux.

## Requisitos

- **Node.js versión 12.11.0**
- [Instalación de nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) para gestionar versiones de Node.js en tu sistema operativo.

## Obtención de Información de Videojuegos

Puedes obtener información de videojuegos de cualquier fuente, pero se recomienda utilizar las siguientes APIs conectadas a bases de datos extensas de videojuegos:

- **Rawg API:** [rawg.io](https://rawg.io/) para obtener una API key.

RAWG_APIKEY=<<tu API key de Rawg>>
RAWG_API_ENDPOINT=https://api.rawg.io/api/


- **Giant Bomb API:** [Giant Bomb API](https://www.giantbomb.com/api/documentation/) para obtener una API key.


GB_APIKEY=<<tu API key de Giant Bomb>>
GB_API_ENDPOINT=https://www.giantbomb.com/api/



Es crucial leer la documentación de cada API para utilizarlas eficientemente y respetar sus límites de uso.

## Uso del Proyecto

Al correr la aplicación con `node index.js`, se llenará la base de datos MongoDB y se ejecutará toda la lógica necesaria para llamar a la API, hacer inserciones, consultas y más.

### Estructura del Proyecto

- **`schemas.js`**: Define los esquemas de documentos MongoDB para los videojuegos.
- **`servicios/gameAPI.js`**: Implementa funciones para obtener información de la API seleccionada y transformarla en documentos MongoDB.
- **`servicios/MongoDBCliente.js`**: Implementa métodos para conectar y operar sobre MongoDB, incluyendo inserciones, consultas y actualizaciones.
- **`tests.js`**: Contiene tests unitarios para validar las operaciones sobre la base de datos MongoDB.

## Configuración del Entorno

1. Utiliza el archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

RAWG_APIKEY=
RAWG_API_ENDPOINT=https://api.rawg.io/api/
GB_API_ENDPOINT=https://www.giantbomb.com/api/
GB_APIKEY=
PAGE_SIZE=
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=


2. Obtén las API keys necesarias de Rawg y Giant Bomb registrándote en sus respectivas plataformas.

## Ejecución del Proyecto

Para correr el proyecto, primero instala las dependencias con:

`npm install`

Luego, ejecuta la aplicación con:

`node index.js`

Esto llenará la base de datos MongoDB y ejecutará toda la lógica configurada.

## Ejecución de Tests
Para ejecutar los tests, utiliza el siguiente comando:

`npx jest`

Asegúrate de configurar los tests con los parámetros adecuados para validar las consultas y operaciones sobre la base de datos MongoDB.


### Entrega de Proyecto

1. Clonar el repositorio `main`.
2. Crear una nueva rama con los apellidos de los integrantes del grupo. Hacer las modificaciones de codigo en esa rama.
3. Subir la rama creada al repositorio remoto.

**Importante:** No mezclar esta rama con `main` ni con ninguna otra rama antes de la revisión final del proyecto.

### Fecha de Entrega: 13/07/2024


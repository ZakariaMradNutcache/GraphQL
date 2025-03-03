# GraphQL README
 - Par Zakaria Mrad
## Packages
 - [@apollo/server](https://www.npmjs.com/package/@apollo/server): Serveur s'occupant des requêtes GraphQl
 - [graphql-compose-mongoose](https://www.npmjs.com/package/graphql-compose-mongoose): Lien entre mongoose et GraphQL, qui nous permet de créer les schémas GraphQL à partir des schémas Mongoose
  
## Requêtes
### Explorations

#### GetAll
  La requête *`router.get('/', handlePageURLParam, paginate.middleware(20, 50), getAll)`* devient 
```graphql
query Explorations {
    explorations {
        items {
            explorationDate
            uuid
            comment
            href
            planet {...}
            coord {...}
            scans {...}
        }
    }
}

```
#### Get One
La requête *`router.get('/:uuidExploration', getOne)`* devient 
```graphql
query Explorations($explorationId: String!) {
    explorations(filter: { uuid: $explorationId }) {
        explorationDate
        uuid
        comment
        href
        coord {...}
        scans {...}
        planet {...}
    }
}
```
avec ce *JSON* en variable 
```json
{
    "explorationId": "57bc177d-1514-4b0e-af7a-f2b689ca9d39"
}
```
&#8594; Il est important d'utiliser des variables en graphQL, car lorsqu'un client GraphQL envoit la requete, il vérifie premièrement que les variables sont valides, s'ils ne le sont pas, la requetes n'arrive jamais au server, donc moins de *load* inutile sur le server. &#8592;

#### Post (Il n'y a pas de requetes REST pour)
```graphql
mutation CreateExploration(
    $explorationDate: Date!
    $coord: ExplorationCoordInput
    $scans: [ExplorationScansInput]
    $comment: String
    $planetID: String!
) {
    createExploration(
        createOneExplorationInput: {
            explorationDate: $explorationDate
            coord: $coord
            scans: $scans
            comment: $comment
            planetID: $planetID
        }
    ) {
        explorationDate
        uuid
        comment
        href
        coord {...}
        scans {...}
        planet {...}
    }
}
```
avec ce *JSON* en variable 
```json
{
    "explorationDate": "2025-03-02",
    "coord": {
        "lon": 10.0,
        "lat": 20.0
    },
    "scans": [
        {
            "element": "Hydrogen",
            "percent": 70
        },
        {
            "element": "Helium",
            "percent": 28
        }
    ],
    "comment": "Exploration of a new planet",
    "planetID": "57bc177d-1514-4b0e-af7a-f2b689ca9d39"
}
```

### Planets
#### getAll
La requête *`router.get('/', handleTemperatureUnitURLParam, getAll)`* devient
```graphql
query Planets {
    planets {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
        position {...}
        explorations {...}
    }
}
```

#### getOne
La requête *`router.get('/:uuidPlanet', handleTemperatureUnitURLParam, getOne)`* devient
```graphql
query Planets($planetId: String!) {
    planets(filter: { uuid: $planetId }) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
        position {...}
        explorations {...}
    }
}

```
avec ce *JSON* en variable
```json
{
    "planetId": "57bc177d-1514-4b0e-af7a-f2b689ca9d39"
}
```
#### post
La requête *`router.post('/', planetValidators.complete(), validator, post)`* devient
```graphql
mutation CreatePlanet(
    $name: String!
    $discoveredBy: String
    $temperature: Float
    $satellites: [String]
    $position: PlanetPositionInput! #Ici le nom PlanetPositionInput vient du type de champs de position, généré par graphql-compose-mongoose
    #Il est possible de voir son nom dans postman
) {
    createPlanet(
        createOnePlanetInput: {
            name: $name
            discoveredBy: $discoveredBy
            temperature: $temperature
            satellites: $satellites
            position: $position
        }
    ) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
        position {...}
        explorations {...}
    }
}

```
avec ce *JSON* en variable
```json
{
    "name" : "Adonis",
    "discoveredBy" : "Métro",
    "temperature": 12.5,
    "satellites" : [
        "Adonis1", "Adonis2", "Adonis3"
    ],
    "position": {
        "x": 10,
        "y": 20,
        "z": 30
    }
}
```
#### update - partial et complete
Les requêtes *`router.patch('/:uuidPlanet', planetValidators.partial(), validator, update)`* et *`router.patch('/:uuidPlanet', planetValidators.complete(), validator, update)`* deviennent
```graphql
mutation UpdatePlanet(
    $planetID: String! # À part pour cette variables, aucune n'est requise
    $name: String
    $discoveredBy: String
    $discoveryDate: Date
    $temperature: Float
    $satellites: [String]
    $position: PlanetPositionInput
) {
    updatePlanet(
        planetID: $planetID 
        updateOnePlanetInput: {
            name: $name
            discoveredBy: $discoveredBy
            discoveryDate: $discoveryDate
            temperature: $temperature
            satellites: $satellites
            position: $position
        }
    ) {
        name
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
        position {...}
        explorations {...}
        uuid
    }
}
```
avec ce *JSON* en variable
```json
{
    "planetID": "85c09554-95f6-4cab-8233-de42a0aed3e7",
    "name" : "Adonis2",
    "discoveredBy" : "Métro",
    "temperature": 12.5,
    "satellites" : [
        "Adonis1", "Adonis2", "Adonis3", "Adonis4"
    ],
    "position": {
        "x": 10,
        "y": 20,
        "z": 30
    }
}
```
#### deleteOne
La requête *`router.delete('/:uuidPlanet', deleteOne)`* devient
```graphql
mutation DeletePlanet($planetID: String!) {
    deletePlanet(planetID: $planetID) # Cette requète retourne True ou False, elle n'as dont pas besoin d'une query complexe
}

```
avec ce *JSON* en variable
```json
{
    "planetID": "85c09554-95f6-4cab-8233-de42a0aed3e7"
}
```

### Explorers
#### getPlanetsDiscoveredBy
La requête *`router.get('/:explorerName', handleTemperatureUnitURLParam, getPlanetsDiscoveredBy)`* devient
```graphql
query Planets($explorerName: String!) {
    planets(filter: { discoveredBy: $explorerName }) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
        position {...}
        explorations {...}
    }
}

```
avec ce *JSON* en variable
```json
{
    "planetID": "85c09554-95f6-4cab-8233-de42a0aed3e7"
}
```

## Requetes plus poussés
### Pagination
#### Planets
```graphql
query PlanetsPaginated($limit: Int!, $page: Int!) {
    planetsPaginated(limit: $limit, page: $page) {
        pageInfo {
            currentPage
            hasPreviousPage
            hasNextPage
            nextPage
            previousPage
        }
        planets {
            name
            uuid
            discoveredBy
            discoveryDate
            temperature
            satellites
            href
            lightspeed
        }
    }
}

```
avec le JSON
```json
{
    "page":12,
    "limit":11
}
```
#### Explorations
```graphql
query ExplorationsPaginated($limit: Int!, $page: Int!) {
    explorationsPaginated(limit: $limit, page: $page) {
        explorations {
            explorationDate
            uuid
            comment
            href
        }
        pageInfo {
            currentPage
            hasPreviousPage
            hasNextPage
            nextPage
            previousPage
        }
    }
}
```
avec le JSON
```json
{
    "page":1,
    "limit":11
}
```
### Sort
Il est possible de sort les items via l'argument *sort* 
```graphql
query Planets {
    planets(sort: NAME_ASC) {
        name
    }
}
``` 
Ses arguments étant générés par `graphql-compose-mongoose`, il n'y a que `_ID_ASC`, `_ID_DESC`, `NAME_ASC`, `NAME_DESC`, `UUID_ASC` et `UUID_DESC`.

### Limit
Il est possible de limiter le nombre d'item retournée grâce au *limit*
```graphql
query Planets($limit: Int) {
    planets(limit: $limit) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
    }
}

```
avec le JSON
```json
{
    "limit": 5 //Seulement 5 planets seront données
}
```

### Filter
#### Selection d'un paramêtre
Telle qu'utiliser pour [getPlanetsDiscoveredBy](#getplanetsdiscoveredby), il est possible de filtrer les *queries* pour selectionner un ou plusieurs items
```graphql
query Planets(
    $temperature: Float
    $discoveredBy: String
    $discoveryDate: Date
) {
    planets(
        filter: {
            temperature: $temperature # Placé ainsi, le filtre agis en tant que AND
            discoveredBy: $discoveredBy
            discoveryDate: $discoveryDate
        }
    ) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
    }
}
```
avec le JSON
```json
{
    "discoveryDate": "2017-12-03T00:00:00.000Z", // Donc nous selectionnons tous les planets ayant une température de 280 K 
    "temperature": 280 // et étant découverte le 2017-12-03
}
```
#### Recherche
Il est possible de faire la recherche dans certain *fields* grâce è l'argumet *filter._operators*
```graphql
query Planets($nameRegex: RegExpAsString, $discoveredByRegex:RegExpAsString) { # nameRegex et discoveredByRegex sont de type RegExpAsString
    planets(
        filter: {
            _operators: {
                name: { regex: $nameRegex } # Nous cherchons les noms correspondant au nameRegex
                discoveredBy: { regex: $discoveredByRegex } # Même affaire pour le discoveredBy
            }
        }
    ) {
        name
        uuid
        discoveredBy
        discoveryDate
        temperature
        satellites
        href
        lightspeed
    }
}

```
avec le JSON
```json
{
    "nameRegex":"/Ado/", // MongoDB étant cool, nous pouvons utiliser du JS regex!
    "discoveredByRegex":"/tro/"
}
```

## SETUP du serveur GraphQl
Cette section explique comment implémenter GraphQL dans un api ExpressJS

### Installation des packages 
```zsh
 npm install @apollo/server graphql-compose-mongoose graphql
```
### Initialisation du serveur
Dans [app.js](./src/app.js), importer `ApolloServer` et `expressMiddleware` de `@apollo/server` et `@apollo/server/express4`. Puis, créer le serveur, le partir et l'ajouter au *path* voulue, dans notre cas `/`.
```js
const server = new ApolloServer({
    schema,
});

await server.start();
app.use('/', express.json(), expressMiddleware(server));
```
### Modification des schémas *Mongoose*
#### Descriptions
La première étapes est d'ajouter un descriptions aux *fields*, car la description sera visible via les clients. Par exemple [exploration.model.js](./src/models/exploration.model.js#L10):
```js
explorationDate: { type: Date, default: Date.now, required: true, description: 'Date of the exploration' }, // Ajout de la description
uuid: { type: String, unique: true, required: true, default: () => uuidv4(), description: 'UUID of the exploration' },
```
#### OTCs
La deuxième étape est de créer le OTCs (ObjectTypeComposer) à partir du model, qu'il faut donc créer plus tôt. Par exemple [exploration.model.js](./src/models/exploration.model.js#L40):
```js
const explorationsModel = mongoose.model('Exploration', explorationSchema);
const ExplorationTC = composeWithMongoose(explorationsModel, {});
```
#### Ajout et supprésions de fields
Les OTCs étant généré à partir du schéma *Mongoose*, il y a des *fields* à enlver. Pour cela, j'ai créé une fonction `removeFields` qui prent pour argument un OTC et une liste d'arguments à enlever. Il est aussi possible d'enlever un *field* en utilisant `.removeField`.
Par exemple [exploration.model.js](./src/models/exploration.model.js#L42):
```js
removeFields(ExplorationTC, ['_id', '__v', 'createAt', 'updatedAt', 'scans.hapiness']); // scans.hapiness à été ajouter pour montrer comment l'enlver
```
Par la suite, il faut ajouter certain *fields*, par exemple `href` et `lightspeed`. Ces fields ne sont pas des propriété de l'objet, ils sont donc définie par d'autre fields. Il ne faut pas oublier d'ajouter une description.
Par exemple [planet.model.js](./src/models/planet.model.js#L36):
```js
PlanetTC.addFields({
    href: {
        type: 'String',
        resolve: (source) => `${process.env.BASE_URL}/planets/${source.uuid}`,
        description: 'URL of the planet'
    },
    lightspeed: {
        type: 'String',
        resolve: (source) => `${source.position.x.toString(16)}@${source.position.y.toString(16)}#${source.position.z.toString(16)}`,
        description: 'Lightspeed coordinates of the planet'
    },
    discoveryDate: {
        type: 'Date',
        resolve: (source) => {
            if (!source.discoveryDate) {
                return null;
            }
            try {
                return dayjs(source.discoveryDate).format('YYYY-MM-DD');
            } catch (error) {
                return null;
            }
        },
        description: 'Date when the planet was discovered'
    }
})
```
#### Nettoyage finale
Les schémas etant un peut devenue le bordel, il faut refaire les exports. Par exemple [planet.model.js](./src/models/planet.model.js#L63):
```js 
export { PlanetTC, planetModel as Planet };
```
### Création des *Resolvers*
Les resolvers sont les mutations et les queries, certains sont fournies par `graphql-compose-mongoose`, mais on va en faire (c'est mieux)

#### Création d'un *OTC*
Dans certains cas, il faut créer un *OTC*, qui est soit la modification d'un autre, so un tous nouveaux.
Par exemple, dans [exploration.type.js](./src/schema/types/exploration.type.js#L69), pour la création d'une explorations, nous créons un nouveau *OTC*, dans lequelle il faut enlever les *fields* `href` et `uuid`, car ils sont générés par mongoose, et il faut ajouter le *field* `planetID`, qui est requis à la création d'une exploration.
```js
const CreateOneExplorationTC = ExplorationTC.clone('CreateOneExplorationTC');
removeFields(CreateOneExplorationTC, ['uuid', 'href']);
CreateOneExplorationTC.addFields({
    planetID: {
        type: 'String!',
        required: true,
        description: 'UUID of the planet associated with the exploration'
    }
});
```
Il est aussi parfois requis de faire un *OTC* *from scratch*, telle que dans les paginations, pour qu'on puisse accéder au data et aux propriétés de la pagianations facilement.
```js
const PaginatedFindAllExplorationTC = schemaComposer.createObjectTC({
    name: 'ExplorationPaginationPayload',
    fields: {
        explorations: [ExplorationTC],
        pageInfo: pageInfoTC, //pageInfoTC est aussi un OTC créer from scratch
    },
});
```
#### Création du *Resolver*
Pour créer le *resolver* il faut lui donner un nom, un description,un type de retour, des arguments, dans ce cas, un *OTC* et un *resolve*. Le *resolve* est la fonction appeler par le serveur *GraphQL*. Elle doit donc retourner du *JSON* correspondant au type donnée. Par exemple [exploration.type.js](./src/schema/types/exploration.type.js#L79)
```js
ExplorationTC.addResolver({
    name: 'createOne',
    description: 'Create a new exploration and associate it with a planet',
    type: ExplorationTC.getType(),
    args: {
        createOneExplorationInput: {
            type: CreateOneExplorationTC.getInputType(),
            required: true
        }
    },
    resolve: async ({ args }) => {
        const explorationData = args.createOneExplorationInput;
        const newExploration = await explorationRepository.create(explorationData);
        return explorationRepository.retrieveByUUID(newExploration.uuid);
    }
});
```
Certains resolver sont plus complexes, telles que celui de la pagination
```js
ExplorationTC.addResolver({
    name: 'findAllPaginated',
    description: 'Retrieve all explorations, can be paginated using limit and skip',
    args: {
        ...ExplorationTC.getResolver('findMany').getArgs(),
        page: 'Int!',
        limit: 'Int!',
    },
    type: PaginatedFindAllExplorationTC,
    resolve: async ({ args }) => {
        const filter = args.filter || {};
        if (args.page < 1) throw new Error('Page must be greater than 0');

        if (args.limit > 15) args.limit = 15;

        const skip = (args.page - 1) * args.limit;
        const options = {
            limit: args.limit,
            skip,
            sort: args.sort,
            planet: args.planet
        };
        const [explorations, totalCount] = await explorationRepository.retrieveByCriteria(filter, options);

        return {
            explorations: explorations,
            pageInfo: new PageInfo({ totalCount, limit: args.limit, page: args.page })
        };
    }
});
```
### Complétion du schéma GraphQL
Pour finir, il faut complété le schéma *GraphQL*. Il faut donc créer le fichier [`schema/composer.js`](./src/schema/composer.js) et y ajouter les *Queries* et les *Mutations*. C'est ce schéma qui est utiliser dans le serveur *GraphQL* ` const server = new ApolloServer({schema,});`
```js
const composer = new SchemaComposer();

composer.Query.addFields({
    planets: PlanetTC.getResolver('findAll'),
    planetsPaginated: PlanetTC.getResolver('findAllPaginated'),
    explorations: ExplorationTC.getResolver('findAll'),
    explorationsPaginated: ExplorationTC.getResolver('findAllPaginated'),
});

composer.Mutation.addFields({
    createExploration: ExplorationTC.getResolver('createOne'),
    createPlanet: PlanetTC.getResolver('createOne'),
    updatePlanet: PlanetTC.getResolver('updateOne'),
    deletePlanet: PlanetTC.getResolver('deleteOne'),
});
const schema = composer.buildSchema();
export default schema;
```


### Autres modifications
#### Filter
Pour faire fonctionner le REGEX, il ma fallue ajouter la fonction fixFilter qui modifie ce qui est fournis dans la query *GraphQL*. Cette fonction se trouve dans [filter.js](./src/core/filter.js)
```js
export const fixFilter = (filter) => {
    if (filter._operators) {
        const operatorKeys = Object.keys(filter._operators);
        operatorKeys.forEach((key) => {
            const operator = filter._operators[key];
            if (operator.regex) {
                filter[key] = { $regex: operator.regex, $options: 'i' };
            }
        });
        delete filter._operators; 
    }
    return filter;
}
```
#### Populate
Mes connaissances sur Mongoose étant pauvres, je n'ai jamais réussi à *populate* un objet après sa création, je retourne donc l'objet trouvé grâce à son *UUID* après avoir créer une exploration. 
```js
resolve: async ({ args }) => {
    const explorationData = args.createOneExplorationInput;
    const newExploration = await explorationRepository.create(explorationData);
    return explorationRepository.retrieveByUUID(newExploration.uuid);
}
```

### Utiles
#### Fragments
En *GraphQL*, il est utile de savoir utiliser des *Fragments*, qui sont des parties de requêtes, par exemple, si on veut souvent avoir une *planet*, on pour créer une *fragement*
```js
const planetFragment = gql`
fragment planetFragment on Planet {
    name
    uuid
    discoveredBy
    discoveryDate
    temperature
    satellites
    position {
        x
        y
        z
    }
    href
    lightspeed
}
`;
```
puis, l'ajouter avant un query: 
```js
const query = gql`
${planetFragment}
query {
    planets {
        ...planetFragment
    }
}
`;
```

#### Renommage
Dans une query, il est parfois utile de renommer des propriétés, surtout si elle sont vielles ou simplement mal nommés, pour ce faire, ils suffit d'écrire la propriété ainsi, où `unePlanetteCool` est le nouveux nom de `planet`
```graphql
query Explorations {
    explorations {
        unePlanetteCool:planet {
            ...planetFragment
        }
    }
}
```
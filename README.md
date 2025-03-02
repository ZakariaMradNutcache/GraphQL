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
    $position:PlanetPositionInput! #Ici le nom PlanetPositionInput vient du type de champs de position, généré par graphql-compose-mongoose
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
### Sort
### Limit
### Filter
## Création de Queries

## Création de Mutations

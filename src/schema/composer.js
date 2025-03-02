import { SchemaComposer } from 'graphql-compose';
import PlanetTC from './types/planet.type.js';
import ExplorationTC from './types/exploration.type.js';

const composer = new SchemaComposer();
composer.Query.addFields({
    planets: PlanetTC.getResolver('findAll'),
    explorations: ExplorationTC.getResolver('findAll'),
});

composer.Mutation.addFields({
    createExploration: ExplorationTC.getResolver('createOne'),
    createPlanet: PlanetTC.getResolver('createOne'),
    updatePlanet: PlanetTC.getResolver('updateOne'),
    deletePlanet: PlanetTC.getResolver('deleteOne'),
});
const schema = composer.buildSchema();
export default schema;
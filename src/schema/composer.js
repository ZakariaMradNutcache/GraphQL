import { SchemaComposer } from "graphql-compose";
import PlanetTC from "./types/planet.type.js";
import ExplorationTC from "./types/exploration.type.js";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const composer = new SchemaComposer();

composer.Query.addFields({
  planets: PlanetTC.getResolver("findAll"),
  planetsPaginated: PlanetTC.getResolver("findAllPaginated"),
  explorations: ExplorationTC.getResolver("findAll"),
  explorationsPaginated: ExplorationTC.getResolver("findAllPaginated"),
});

composer.Mutation.addFields({
  createExploration: ExplorationTC.getResolver("createOne"),
  createPlanet: PlanetTC.getResolver("createOne"),
  updatePlanet: PlanetTC.getResolver("updateOne"),
  deletePlanet: PlanetTC.getResolver("deleteOne"),
});

composer.Subscription.addFields({
  planetUpdated: {
    type: PlanetTC,
    subscribe: () => pubsub.asyncIterableIterator(["PLANET_UPDATED"]),
  },
  planetDeleted: {
    type: PlanetTC,
    args: {
        planetID: "String!",
    },
    subscribe: (_,args) =>
      pubsub.asyncIterableIterator([`PLANET_DELETED_BY_UUID_${args.planetID}`]),
  },
});

const schema = composer.buildSchema();
export { schema, pubsub };

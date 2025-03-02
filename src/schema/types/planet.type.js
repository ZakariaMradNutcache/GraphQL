import { composeWithMongoose } from 'graphql-compose-mongoose';
import { PlanetTC } from '../../models/planet.model.js';
import { ExplorationTC } from '../../models/exploration.model.js';
import planetRepository from '../../repositories/planet.repository.js';
import { removeFields } from '../../core/removeFields.js';
import { schemaComposer } from 'graphql-compose';



const FindAllPlanetTC = PlanetTC.clone('FindAllPlanetTC');
FindAllPlanetTC.addFields({
    explorations: {
        type: [ExplorationTC],
        description: 'Explorations of the planet',
        resolve: (source) => source.explorations,
        projection: { uuid: 1 }
    }
});
PlanetTC.addResolver({
    description: 'Retrieve all planets, can be paginated using limit and skip',
    name: 'findAll',
    args: PlanetTC.getResolver('findMany').args,
    type: [FindAllPlanetTC.getType()],
    resolve: async ({ args }) => {
        const filter = args.filter || {};
        
        const options = {
            limit: args.limit,
            skip: args.skip,
            sort: args.sort,
            planet: args.planet
        };
        const [explorations, _] = await planetRepository.retrieveByCriteria(filter, options);
        return explorations;
    }
});

PlanetTC.addResolver({
    name: 'findAllPaginated',
    description: 'Retrieve all planets, with optional pagination',
    args: {
        ...PlanetTC.getResolver('findMany').getArgs(),
        page: 'Int!',
        limit: 'Int!',
    },
    type: schemaComposer.createObjectTC({
        name: 'PlanetPaginationPayload',
        fields: {
            data: '[FindAllPlanetTC!]!',
            count: 'Int!',
            totalPages: 'Int!',
            currentPage: 'Int!',
        },
    }),
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

        // Fetch both paginated data and total count
        const [planets, totalCount] = await planetRepository.retrieveByCriteria(filter, options);

        return {
            data: planets,
            count: totalCount,
            totalPages: Math.ceil(totalCount / args.limit),
            currentPage: args.page,
        };
    }
});

const CreateOnePlanetTC = PlanetTC.clone('CreateOnePlanetTC');
removeFields(CreateOnePlanetTC, ['uuid', 'href', 'lightspeed', 'discoveryDate']);
PlanetTC.addResolver({
    name: 'createOne',
    description: 'Create a new planet',
    type: PlanetTC.getType(),
    args: {
        createOnePlanetInput: {
            type: CreateOnePlanetTC.getInputType(),
            required: true,
            description: 'Data to create the planet'
        }
    },
    resolve: async ({ _, args }) => {
        const planetData = args.createOnePlanetInput;
        const newPlanet = await planetRepository.create(planetData);
        return newPlanet;
    }
});

const UpdateOnePlanetTC = PlanetTC.clone('UpdateOnePlanetTC');
removeFields(UpdateOnePlanetTC, ['uuid', 'href', 'lightspeed']);
UpdateOnePlanetTC.getFieldNames().forEach(fieldName => {
    UpdateOnePlanetTC.makeFieldNullable(fieldName);
});
PlanetTC.addResolver({
    name: 'updateOne',
    description: 'Update a planet using its UUID',
    type: PlanetTC.getType(),
    args: {
        planetID: {
            type: 'String!',
            required: true,
            description: 'UUID of the planet to update'
        },
        updateOnePlanetInput: {
            type: UpdateOnePlanetTC.getInputType(),
            required: true,
            description: 'Data to update the planet'
        },
    },
    resolve: async ({ _, args }) => {
        const planetData = args.updateOnePlanetInput;
        const planetID = args.planetID;
        const newPlanet = await planetRepository.update(planetID, planetData);
        return newPlanet;
    }
});

PlanetTC.addResolver({
    name: 'deleteOne',
    description: 'Delete a planet using its UUID',
    type: 'Boolean!',

    args: {
        planetID: {
            type: 'String!',
            required: true,
            description: 'UUID of the planet to update'
        }
    },
    resolve: () => {
        throw new Error('Not allowed');
    }
});

export default PlanetTC;
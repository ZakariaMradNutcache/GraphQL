import { ExplorationTC } from '../../models/exploration.model.js';
import explorationRepository from '../../repositories/exploration.repository.js';
import { PlanetTC } from '../../models/planet.model.js';
import { removeFields } from '../../core/removeFields.js';

ExplorationTC.addResolver({
    name: 'findAll',
    description: 'Retrieve all explorations, can be paginated using limit and skip',
    args: ExplorationTC.getResolver('findMany').args,
    type: [ExplorationTC.getType()],
    resolve: async ({ args, source }) => {

        const filter = args.filter || {};

        if (args.limit > 15) args.limit = 15;

        const options = {
            limit: args.limit,
            skip: args.skip,
            sort: args.sort,
            planet: args.planet
        };
        const [explorations, _] = await explorationRepository.retrieveByCriteria(filter, options);
        return explorations;
    }
});

const CreateOneExplorationTC = ExplorationTC.clone('CreateOneExplorationTC');
removeFields(CreateOneExplorationTC, ['uuid', 'href']);
CreateOneExplorationTC.addFields({
    planetID: {
        type: 'String!',
        required: true,
        description: 'UUID of the planet associated with the exploration'
    }
});

ExplorationTC.addResolver({
    name: 'createOne',
    description: 'Create a new exploration and associate it with a planet',
    type: ExplorationTC.addFields({
        planet: {
            type: PlanetTC,
            description: 'Planet associated with the exploration (can be null)',
            resolve: (source) => source.planet,
            projection: { planet: 1 }
        }
    }).getType(),
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


export default ExplorationTC;

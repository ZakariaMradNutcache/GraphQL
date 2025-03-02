import { ExplorationTC } from '../../models/exploration.model.js';
import explorationRepository from '../../repositories/exploration.repository.js';
import { removeFields } from '../../core/removeFields.js';
import { schemaComposer } from 'graphql-compose';
import pageInfoTC from '../../core/pageInfoTC.js';


ExplorationTC.addResolver({
    name: 'findAll',
    description: 'Retrieve all explorations, can be paginated using limit and skip',
    args: ExplorationTC.getResolver('findMany').args,
    type: [ExplorationTC.getType()],
    resolve: async ({ args }) => {
        const filter = args.filter || {};
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

const PaginatedFindAllExplorationTC = schemaComposer.createObjectTC({
    name: 'ExplorationPaginationPayload',
    fields: {
        explorations: [ExplorationTC],
        pageInfo: pageInfoTC,
    },
});

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
            data: explorations,
            count: totalCount,
            totalPages: Math.ceil(totalCount / args.limit),
            currentPage: args.page,
        };
    }
});



const CreateOneExplorationTC = ExplorationTC.clone('CreateOneExplorationTC');
removeFields(CreateOneExplorationTC, ['uuid', 'href', 'planet']);
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


export default ExplorationTC;

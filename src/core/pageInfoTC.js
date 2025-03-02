import { schemaComposer } from 'graphql-compose';

const pageInfoTC = schemaComposer.createObjectTC({
    name: 'PageInfo',
    fields: {
        currentPage: 'Int!',
        hasPreviousPage: 'Boolean!',
        hasNextPage: 'Boolean!',
        nextPage: 'Int',
        previousPage: 'Int',
    },
});


export default pageInfoTC;
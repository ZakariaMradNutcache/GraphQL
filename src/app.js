import express from 'express';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import schema from './schema/composer.js';

import database from './core/database.js';
import errorsMiddleware from './middlewares/errors.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

database();

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();

const server = new ApolloServer({
    schema,
});

await server.start();
app.use('/', express.json(), expressMiddleware(server));


app.use(errorsMiddleware);


export default app;
import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { v4 as uuidv4 } from 'uuid';
import { href } from 'express-paginate';
import { PlanetTC } from './planet.model.js';
import { removeFields } from '../core/removeFields.js';

const explorationSchema = mongoose.Schema(
  {
    explorationDate: { type: Date, default: Date.now, required: true, description: 'Date of the exploration' },
    uuid: { type: String, unique: true, required: true, default: () => uuidv4(), description: 'UUID of the exploration' },
    planet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Planet',
      required: true,
      description: 'Planet associated with the exploration'
    },
    coord: {
      lon: { type: Number, description: 'Longitude of the exploration' },
      lat: { type: Number, description: 'Latitude of the exploration' }
    },
    scans: [
      {
        element: { type: String, description: 'Element scanned' },
        percent: { type: Number, description: 'Percentage of the element scanned' },
        _id: false,
      },
    ],
    comment: { type: String, description: 'Comment of the exploration' }
  },
  {
    collection: 'explorations',
    strict: 'throw',
    id: false,
  }
);


const explorationsModel = mongoose.model('Exploration', explorationSchema);
const ExplorationTC = composeWithMongoose(explorationsModel, {});
ExplorationTC.addFields({
  planet: {
    type: PlanetTC,
    description: 'Planet associated with the exploration (can be null)',
    resolve: (source) => source.planet,
    projection: { planet: 1 }
  },
  //We add the href, but if the api is GraphQL, we should not use it
  href: {
    type: 'String',
    description: 'URL of the exploration (as the api is GraphQL, we should not use it)',
    resolve: (source) => `${process.env.BASE_URL}/explorations/${source.uuid}`
  }
}).removeField('_id').removeField('__v').removeField('createdAt').removeField('updatedAt').removeField('planet');

export { ExplorationTC, explorationsModel as Exploration };

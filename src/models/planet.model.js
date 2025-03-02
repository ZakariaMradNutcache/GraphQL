import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { v4 as uuidv4 } from 'uuid';
import { removeFields } from '../core/removeFields.js';

const planetSchema = mongoose.Schema({
    name: { type: String, unique: true, required: true, description: 'Name of the planet' },
    uuid: { type: String, unique: true, required: true, default: () => uuidv4(), description: 'UUID of the planet' },
    discoveredBy: { type: String, index: true, description: 'Name of the person who discovered the planet' },
    discoveryDate: { type: Date, description: 'Date when the planet was discovered' },
    temperature: { type: Number, description: 'Temperature of the planet' },
    satellites: { type: [String], description: 'List of satellites orbiting the planet' },
    position: {
        x: { type: Number, min: -1000, max: 1000, required: true, description: 'X coordinate of the planet' },
        y: { type: Number, min: -1000, max: 1000, required: true, description: 'Y coordinate of the planet' },
        z: { type: Number, min: -1000, max: 1000, required: true, description: 'Z coordinate of the planet' }
    }
}, {
    collection: 'planets',
    strict: 'throw',
    timestamps: true,
    id: false
});

planetSchema.virtual('explorations', {
    ref: 'Exploration',
    localField: '_id',
    foreignField: 'planet',
    justOne: false
});

const planetModel = mongoose.model('Planet', planetSchema);
const PlanetTC = composeWithMongoose(planetModel, {});
removeFields(PlanetTC, ['createdAt', 'updatedAt', '_id', '__v']);
PlanetTC.addFields({
    href: {
        type: 'String',
        resolve: (source) => `${process.env.BASE_URL}/planets/${source.uuid}`,
        description: 'URL of the planet'
    },
    discoveryDate: {
        type: 'Date',
        resolve: (source) => {
            if (!source.discoveryDate) {
                return null;
            }
            try {
                return new Date(source.discoveryDate);
            } catch (error) {
                return null;
            }
        },
        description: 'Date when the planet was discovered'
    },
    lightspeed: {
        type: 'String',
        resolve: (source) => `${source.position.x.toString(16)}@${source.position.y.toString(16)}#${source.position.z.toString(16)}`,
        description: 'Lightspeed coordinates of the planet'
    }
})

export { PlanetTC, planetModel as Planet };
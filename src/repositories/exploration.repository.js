import { Exploration } from '../models/exploration.model.js';
import planetRepository from './planet.repository.js'
import { fixFilter } from '../core/filter.js';

class ExplorationsRepository {

    retrieveByCriteria(filter, options) {
        filter = filter || {};
        filter = fixFilter(filter);

        const retrieveQuery = Exploration
            .find(filter)
            .limit(options.limit)
            .skip(options.skip)
            .sort({ 'explorationDate': 'desc' })
            .populate('planet', 'uuid');
        const countQuery = Exploration.countDocuments(filter);
        retrieveQuery.populate('planet');

        return Promise.all([retrieveQuery, countQuery]);
    }

    retrieveByUUID(uuid) {
        const exploration = Exploration.findOne({
            uuid
        }).populate('planet', 'uuid');
        exploration.populate('planet');
        return exploration;
    }

    async create(explorationData) {
        const planetId = await planetRepository.retrievePlanetIdByUUID(explorationData.planetID);
        if (!planetId) {
            throw new Error('Planet not found');
        }
        explorationData.planet = planetId;
        delete explorationData.planetID;
        return Exploration.create(explorationData);
    }

}

export default new ExplorationsRepository();
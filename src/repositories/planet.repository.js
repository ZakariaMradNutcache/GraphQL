import dayjs from 'dayjs';
import { Planet } from '../models/planet.model.js';
import { fixFilter } from '../core/filter.js';

const ZERO_KELVIN = -273.15;

class PlanetRepository {
  retrieveByCriteria(filter, options) {
    filter = filter || {};
    filter = fixFilter(filter);

    const retrieveQuery = Planet
      .find(filter)
      .limit(options.limit)
      .skip(options.skip)
      .sort(options.sort)
      .populate('explorations', 'uuid');
    const countQuery = Planet.countDocuments(filter);
    retrieveQuery.populate('explorations');

    return Promise.all([retrieveQuery, countQuery]);

  }

  create(planet) {
    return Planet.create(planet);
  }

  update(planetID, planet) {
    return Planet.findOneAndUpdate(
      { uuid: planetID },
      { $set: Object.assign(planet) },
      { runValidators: true, new: true }
    );
  }

  async retrievePlanetIdByUUID(uuid) {
    const planet = await Planet.findOne({ uuid });
    return planet ? planet._id : null;
  }

  async retrieveByUUID(uuid) {
    const planet = Planet.findOne({
      uuid
    }).populate('explorations', 'uuid');
    planet.populate('explorations');
    return planet;
  }
}

export default new PlanetRepository();

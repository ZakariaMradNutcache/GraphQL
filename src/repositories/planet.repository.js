import dayjs from 'dayjs';
import { Planet } from '../models/planet.model.js';

const ZERO_KELVIN = -273.15;

class PlanetRepository {
  retrieveByCriteria(filter, options) {
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
}

export default new PlanetRepository();

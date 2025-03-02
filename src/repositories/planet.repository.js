import dayjs from 'dayjs';
import { Planet } from '../models/planet.model.js';

const ZERO_KELVIN = -273.15;

class PlanetRepository {
  retrieveByCriteria(filter, options) {
    if (filter._operators) {
      const operatorKeys = Object.keys(filter._operators);
      operatorKeys.forEach((key) => {
        const operator = filter._operators[key];
        if (operator.regex) {
          filter[key] = { $regex: operator.regex, $options: 'i' }; // 'i' for case-insensitive
        }
      });
      delete filter._operators; // Remove _operators from filter
    }
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

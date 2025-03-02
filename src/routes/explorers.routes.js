import express from 'express';

import planetRepository from '../repositories/planet.repository.js';

import { handleTemperatureUnitURLParam } from '../middlewares/temperature.unit.middleware.js';

const router = express.Router();

router.get('/:explorerName', handleTemperatureUnitURLParam, getPlanetsDiscoveredBy);

async function getPlanetsDiscoveredBy(req, res, next) {

  try {
    const criteria = { discoveredBy: req.params.explorerName };
    let planets = await planetRepository.retrieveByCriteria(criteria);

    planets = planets.map((p) => {
      p = p.toObject({ getters: false, virtuals: false });
      p = planetRepository.transform(p, req.transformOptions);
      return p;
    });

    res.status(200).json(planets);
  } catch (err) {
    return next(err);
  }
}

export default router;

import HttpError from 'http-errors';
export function handleTemperatureUnitURLParam(req, res, next) {
  req.transformOptions = {};

  //Validation du paramètre d'URL unit (?unit)
  if (req.query.unit) {
    const unit = req.query.unit;
    if (unit === 'c') {
      req.transformOptions.unit = unit;
    } else {
      throw HttpError.BadRequest(`Le paramètre unit doit avoir la valeur c, valeur entrée ${unit}`);
    }
  }
  next();
}

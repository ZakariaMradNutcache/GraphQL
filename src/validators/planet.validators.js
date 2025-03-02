import expressValidator from 'express-validator';
const { body } = expressValidator;

class PlanetValidators {

    //https://github.com/validatorjs/validator.js#validators
    //https://express-validator.github.io/docs/index.html    
    complete() {
        return [
            body('name').exists().withMessage('Requis'),
            body('discoveredBy').exists().withMessage('Requis'),
            body('discoveryDate').exists().withMessage('Requis').bail()
                .isISO8601().withMessage('doit être une date ISO8601').bail()
                .isBefore(new Date().toISOString()).withMessage('doit être dans le passé'),
            body('temperature').exists().withMessage('Requis'),
            body('satellites').exists().isArray(),
            body('position.x').exists().withMessage('Requis'),
            body('position.y').exists().withMessage('Requis'),
            body('position.z').exists().withMessage('Requis'),
            ...this.partial() //... Déconstruction du tableau
        ]
    }

    partial() {
        return [
            body('uuid').not().exists().withMessage('uuid ne doit pas être présent'),
            body('position.x')
                .isFloat({min: -1000, max: 1000})
                .withMessage('x doit être décimal et compris entre -1000 et 1000'),
            body('position.y')
                .isFloat({min: -1000, max: 1000})
                .withMessage('y doit être décimal et compris entre -1000 et 1000'),
            body('position.z')
                .isFloat({min: -1000, max: 1000})
                .withMessage('z doit être décimal et compris entre -1000 et 1000'),
            body('temperature').optional().isNumeric().withMessage('doit être numérique')   
        ];
    }

}

export default new PlanetValidators();
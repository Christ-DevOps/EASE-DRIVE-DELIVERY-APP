const Joi = require('joi');

exports.validatePartner = (req, res, next) => {
    const schema = Joi.object({
        restaurantName: Joi.string().required(),
        restaurantLocation: Joi.object({
            type: Joi.string().valid('Point').optional(),
            coordinates: Joi.array().items(Joi.number()).length(2).optional(),
        }).optional(),
        category: Joi.array().items(Joi.string()).required(),
        description: Joi.string().required(),
        documents: Joi.array().items(Joi.string()).optional(),
        BankAccount: Joi.string().required(),
        Logistics: Joi.boolean().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

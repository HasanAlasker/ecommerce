import Joi from 'joi'

function validate(schema) {
  return (req, res, next) => {
    const data = { body: req.body, params: req.params, query: req.query };

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation Error',
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value.body = {};
    req.params = value.params = {};
    req.query = value.query || {};

    next();
  };
}

module.exports = { Joi, validate };
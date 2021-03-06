'use strict';

const Joi = require('joi');

module.exports = {
    url: Joi.string().required().uri({
        scheme: [
            'http',
            'https'
        ]
    }),
    proxy: Joi.string().uri({
        scheme: [
            'http',
            'https'
        ]
    }).allow([null]),
    isCompleted: Joi.boolean().required(),
    createdAt: Joi.date().timestamp().required(),
    elapsedMilliseconds: Joi.number().required(),
    loaders: Joi.array().required(),
    data: Joi.object().required(),
    loaderConfig: Joi.array(),
    config: Joi.object(),
};

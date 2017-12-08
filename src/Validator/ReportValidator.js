'use strict';

const Promise = require('bluebird');
const joi = require('joi');
const schema = require('../Schema/ReportSchema');


class ReportValidator {

    /**
     * Validate report object
     *
     * @param {Object} report
     * @returns {void | Promise<any> | Promise<never> | *}
     */
    validate(report) {
        const result = joi.validate(report, schema);
        if(result.error === null){
            return Promise.resolve()
        }
        
        return Promise.reject(result.error);
    }
}

module.exports = ReportValidator;
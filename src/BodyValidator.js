'use strict'

const Ajv = require('ajv')

module.exports = class BodyValidator {

    static validate(validationSchema, body) {
        return new Promise((resolve, reject) => {
            const ajv = new Ajv({ allErrors: true })
            const isValid = ajv.validate(validationSchema, body)
            isValid || !ajv.errors ? resolve({ isValid }) : reject({ isValid, errors: ajv.errors })
        })
    }
}

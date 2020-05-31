'use strict'

const validationRules = {
    name: { type: 'string', regex: /^.{1,100}$/ },
    direction: { type: 'int', possibleValues: [-1, 1] },
    offset: { type: 'int' },
    baseline: { type: 'int', range: { min: 0, max: 10000 } },
    voltage: { type: 'int' },
    range: { type: 'int' }
}
const requiredFields = Object.keys(validationRules)

module.exports = class Validator {

    static validate(sensor) {
        return this._checkForMissingFields(Object.keys(sensor)).concat(this._checkFields(sensor))
    }

    static _checkFields(sensor) {
        const validationFailures = []
        for (let [field, value] of Object.entries(sensor)) {
            const validationData = validationRules[field]
            if (validationData) {
                if (validationData.type === 'string') {
                    if (typeof value !== validationData.type) {
                        validationFailures.push(`Value ${value} for field ${field} should be of type string. Not ${typeof value}.`)
                    }
                    if (validationData.regex && !validationData.regex.test(value)) {
                        validationFailures.push(`Value ${value} for field ${field} did not match regex ${validationData.regex}.`)
                    }
                } else if (validationData.type === 'int') {
                    if (!this._isInt(value)) {
                        validationFailures.push(`Value ${value} for field ${field} should be of type integer. Not ${typeof value}.`)
                    }
                    if (validationData.range && (value < validationData.range.min || value > validationData.range.max)) {
                        validationFailures.push(`Value ${value} for field ${field} is not inside the allowed range of ${JSON.stringify(validationData.range)}.`)
                    }
                }
                if (validationData.possibleValues && !validationData.possibleValues.includes(value)) {
                    validationFailures.push(`Value ${value} for field ${field} was not in the list of possible values [${validationData.possibleValues}].`)
                }
            } else {
                validationFailures.push(`Field ${field} is not allowed.`)
            }
        }
        return validationFailures
    }

    static _isInt(data) { return (data === parseInt(data, 10)) }

    static _checkForMissingFields(sensorKeys) {
        const missingFields = requiredFields.filter(field => !sensorKeys.includes(field))
        return missingFields.length ? [`Missing fields ${missingFields.join(', ')}.`] : []
    }
}
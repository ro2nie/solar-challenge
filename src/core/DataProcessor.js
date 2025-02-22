'use strict'
const Validator = require('./Validator')
let promises, valid, invalid, validationFailures

module.exports = class DataProcessor {

    static async process(sensors) {
        promises = [], valid = [], invalid = [], validationFailures = []
        for (let sensor of sensors) {
            promises.push(this._processSensorData(sensor))
        }
        const responses = await Promise.all(promises.map(p => p.catch(error => error)))
        responses.forEach((response) => {
            if (response) {
                if (response.errors) {
                    invalid.push(response)
                } else {
                    valid.push(response)
                }
            }
        })

        const data = {}
        if (valid.length) {
            data['valid'] = valid
        }
        if (invalid.length) {
            data['invalid'] = invalid
        }
        return data
    }

    static _processSensorData(sensor) {
        return new Promise((resolve, reject) => {
            validationFailures = Validator.validate(sensor)
            const sensorCopy = Object.assign({}, sensor)
            if (validationFailures.length) {
                sensorCopy['errors'] = validationFailures
                reject(sensorCopy)
            } else {
                sensorCopy['current'] = this._calculateCurrent(sensor)
                resolve(sensorCopy)
            }
        })
    }

    static _calculateCurrent(sensor) {
        return (sensor.voltage + sensor.offset - sensor.baseline) * (sensor.range / sensor.baseline) * sensor.direction
    }
}
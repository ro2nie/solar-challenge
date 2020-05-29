const validationRules = {
    name: { type: 'string', regex: /^.{1,100}$/ },
    direction: { type: 'int', possibleValues: [-1, 1] },
    offset: { type: 'int' },
    baseline: { type: 'int', range: { min: 0, max: 10000 } },
    voltage: { type: 'int' },
    range: { type: 'int' }
}

module.exports = class DataProcessor {

    process(body) {
        const validationFailures = []
        if (!body.sensors || !body.sensors.length) {
            validationFailures.push('body did not contain sensor data')
        } else {
            this._processAllSensorsData(body.sensors)
        }
        return validationFailures
    }

    async _processAllSensorsData(sensors) {
        const promises = []

        for (let [idx, sensor] of sensors.entries()) {
            promises.push(this._processSensorData(sensor, idx))
        }

        const responses = await Promise.all(promises.map(p => p.catch(error => error)))
        responses.forEach((response) => {
            console.log('RESPONSE', response)
            if (response) {
                
                // validationFailures.push(`Image link ${res.config.url} returned a ${res.response.status} response code. Found at ${urlsToExtract[idx].path}`)
            }
        })
    }

    _processSensorData(sensor, idx) {
        return new Promise((resolve, reject) => {
            const validationFailures = this._validate(sensor, idx)
            if (validationFailures.length) {
                reject({ sensor, errors: validationFailures })
            } else {
                resolve({ name: sensor.name, current: this._calculateCurrent(sensor) })
            }
        })
    }

    _validate(sensor, idx) {
        const validationFailures = []
        console.log('Object.entries(sensor)', Object.entries(sensor).keys())
        for (let [field, value] of Object.entries(sensor)) {
            console.log('FIELD', field)
            console.log('VALUE', value)
            console.log('validationRules.field', validationRules[field])
            if (validationRules[field]) {
                const validationData = validationRules[field]
                if (validationData.type === 'string' && typeof value !== validationData.type) {
                    validationFailures.push(`Value ${value} should be a string. Not a(n) ${typeof value}. Found at .sensors[${idx}].${field}`)
                }

                if (validationData.type === 'int' && !this._isInt(value)) {
                    validationFailures.push(`Value ${value} should be an integer. Not a(n) ${typeof value}. Found at .sensors[${idx}].${field}`)
                }

                if (validationData.range && (value < validationData.range.min || value > validationData.range.max)) {
                    validationFailures.push(`Value ${value} is not inside the allowed range of ${JSON.stringify(validationData.range)}. Found at .sensors[${idx}].${field}`)
                }

                if (validationData.regex && !validationData.regex.test(value)) {
                    validationFailures.push(`Value ${value} did not match regex ${validationData.regex}. Found at .sensors[${idx}].${field}`)
                }

                if (validationData.possibleValues && !validationData.possibleValues.includes(value)) {
                    validationFailures.push(`Value ${value} was not in the list of possible values [${validationData.possibleValues}]. Found at .sensors[${idx}].${field}`)
                }
            } else {
                validationFailures.push(`Field ${field} is not allowed. Found at .sensors[${idx}].${field}`)
            }
        }
        return validationFailures
    }

    _isInt(data) {
        return (data === parseInt(data, 10))
    }

    _calculateCurrent(sensor) {
        return (sensor.voltage + sensor.offset - sensor.baseline) * (sensor.range / sensor.baseline) * sensor.direction
    }

}
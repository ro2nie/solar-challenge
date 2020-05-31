'use strict'

const { responseBuilder, HTTP_STATUS } = require('./utils/HttpStatusCodes')
const DataProcessor = require('./core/DataProcessor')
const SensorService = require('./service/SensorService')
let body

module.exports.solar = async event => {
    try {
        try {
            body = JSON.parse(event.body)
        } catch (err) {
            return responseBuilder(HTTP_STATUS.UNPROCESSABLE_ENTITY, err.message)
        }
        if (!body || !body.sensors || !body.sensors.length) {
            return responseBuilder(HTTP_STATUS.BAD_REQUEST, 'body did not contain sensor data')
        }
        await SensorService.store(await DataProcessor.process(body.sensors))
        return responseBuilder(HTTP_STATUS.ACCEPTED)
    } catch (err) {
        return responseBuilder(HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message)
    }
};

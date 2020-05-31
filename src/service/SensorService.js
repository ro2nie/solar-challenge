'use strict'

const { uuidV4 } = require('../utils/UUIDGenerator')
const { s3Service } = require('../store/S3Service')
let promises, uuid

module.exports = class SensorService {

    static store(sensorData) {
        promises = []
        uuid = uuidV4()
        if (sensorData.valid) {
            promises.push(this._putObject(sensorData.valid, 'valid'))
        }
        if (sensorData.invalid) {
            promises.push(this._putObject(sensorData.invalid, 'invalid'))
        }
        return Promise.all(promises)
    }

    static _putObject(sensorData, type) {
        return s3Service.putObject(process.env.STORE_S3_BUCKET, this._constructPath(type), JSON.stringify(sensorData))
    }

    static _constructPath(type) {
        const eventDate = new Date()
        const year = eventDate.getUTCFullYear().toString()
        const month = (eventDate.getUTCMonth() + 1).toString().padStart(2, '0')
        const day = eventDate.getUTCDate().toString().padStart(2, '0')
        const hour = eventDate.getUTCHours().toString().padStart(2, '0')
        return `${process.env.ENV}/${type}/${year}/${month}/${day}/${hour}/${uuid}.json`
    }
}
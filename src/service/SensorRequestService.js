'use strict'

const { v4 } = require('uuid')
const s3Service = require('./S3Service').s3Service
const uuid = v4()

module.exports = class SensorRequestService {

    static store(sensorData) {
        const promises = [this._putObject(sensorData.valid, 'valid'), this._putObject(sensorData.invalid, 'invalid')]
        Promise.all(promises).catch(err => {
            console.log('ERR', err)
            //log it to cloudwatch
        })
    }

    static _putObject(sensorData, type) {
        s3Service.putObject(process.env.STORE_S3_BUCKET, this._constructPath(type), JSON.stringify(sensorData))
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
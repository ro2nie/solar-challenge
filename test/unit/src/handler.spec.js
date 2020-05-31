'use strict'

const { solar } = require('../../../src/handler')
const DataProcessor = require('../../../src/core/DataProcessor')
const SensorService = require('../../../src/service/SensorService')
let validSensorsPayload

describe('Handler', () => {

    beforeEach(() => {
        jest.resetModules()
        jest.restoreAllMocks()
        validSensorsPayload = require('../resources/validSensors.json')
    })

    it('Fails with a 422 unprocessable entity response on invalid JSON', async () => {
        const event = { body: 'invalid-json-payload' }
        const actual = await solar(event)
        const expected = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            statusCode: 422,
            body: JSON.stringify({ error: 'Unprocessable Entity', message: 'Unexpected token i in JSON at position 0' })
        }
        expect(actual).toStrictEqual(expected)
    })

    it('Fails with a 400 bad request response on sensors not present', async () => {
        const event = { body: JSON.stringify({ foo: 'bar' }) }
        const actual = await solar(event)
        const expected = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad Request', message: 'body did not contain sensor data' })
        }
        expect(actual).toStrictEqual(expected)
    })

    it('Fails with a 400 bad request response on empty sensors list', async () => {
        const event = { body: JSON.stringify({ sensors: [] }) }
        const actual = await solar(event)
        const expected = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad Request', message: 'body did not contain sensor data' })
        }
        expect(actual).toStrictEqual(expected)
    })

    it('Succeeds with a 202 accepted response', async () => {
        const dataProcessorSpy = jest.spyOn(DataProcessor, 'process').mockImplementation(() => Promise.resolve('foo'))
        const SensorServiceSpy = jest.spyOn(SensorService, 'store').mockImplementation(() => Promise.resolve())
        const event = { body: JSON.stringify(validSensorsPayload) }
        const actual = await solar(event)
        const expected = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            statusCode: 202
        }
        expect(actual).toStrictEqual(expected)
        expect(dataProcessorSpy).toHaveBeenCalledWith(validSensorsPayload.sensors)
        expect(SensorServiceSpy).toHaveBeenCalledWith('foo')
    })

    it('Fails with a 500 internal server error response', async () => {
        jest.spyOn(DataProcessor, 'process').mockImplementation(() => { throw Error('an internal error occurred')})
        const event = { body: JSON.stringify(validSensorsPayload) }
        const actual = await solar(event)
        const expected = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', message: 'an internal error occurred' })
        }
        expect(actual).toStrictEqual(expected)
    })
})
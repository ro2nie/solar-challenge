'use strict'

const { s3Service } = require('../../../../src/store/S3Service')
const SensorService = require('../../../../src/service/SensorService')
const env = 'dev'
const bucketName = 'the-bucket-name'
const validPathRegex = /^dev\/valid\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}.json$/
const invalidPathRegex = /^dev\/invalid\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}.json$/
process.env.ENV = env
process.env.STORE_S3_BUCKET = bucketName

describe('SensorService', () => {

    beforeEach(() => {
        jest.restoreAllMocks()
    })

    afterEach(() => {
        delete process.env.ENV
        delete process.env.STORE_S3_BUCKET
    })

    it('Stores valid and invalid data', async () => {
        const putObjectSpy = jest.spyOn(s3Service, 'putObject').mockImplementation(() => Promise.resolve())
        const sensorData = { valid: { foo: 'bar' }, invalid: { foo: 'bar' } }
        await SensorService.store(sensorData)
        const putObjectCallsArgs = putObjectSpy.mock.calls
        expect(putObjectCallsArgs.length).toBe(2)

        //Valid
        const bucketNameArgValid = putObjectCallsArgs[0][0]
        const keyArgValid = putObjectCallsArgs[0][1]
        const bodyArgValid = putObjectCallsArgs[0][2]
        expect(bucketNameArgValid).toStrictEqual(bucketName)
        expect(keyArgValid).toMatch(validPathRegex)
        expect(bodyArgValid).toStrictEqual(JSON.stringify(sensorData.valid))

        //Invalid
        const bucketNameArgInvalid = putObjectCallsArgs[1][0]
        const keyArgInvalid = putObjectCallsArgs[1][1]
        const bodyArgInvalid = putObjectCallsArgs[1][2]
        expect(bucketNameArgInvalid).toStrictEqual(bucketName)
        expect(keyArgInvalid).toMatch(invalidPathRegex)
        expect(bodyArgInvalid).toStrictEqual(JSON.stringify(sensorData.valid))
    })

    it('Stores valid data only', async () => {        
        const putObjectSpy = jest.spyOn(s3Service, 'putObject').mockImplementation(() => Promise.resolve())
        const sensorData = { valid: { foo: 'bar' } }
        await SensorService.store(sensorData)
        const putObjectCallsArgs = putObjectSpy.mock.calls
        expect(putObjectCallsArgs.length).toBe(1)

        //Valid
        const bucketNameArgValid = putObjectCallsArgs[0][0]
        const keyArgValid = putObjectCallsArgs[0][1]
        const bodyArgValid = putObjectCallsArgs[0][2]
        expect(bucketNameArgValid).toStrictEqual(bucketName)
        expect(keyArgValid).toMatch(validPathRegex)
        expect(bodyArgValid).toStrictEqual(JSON.stringify(sensorData.valid))
    })

    it('Stores valid data only', async () => {
        const putObjectSpy = jest.spyOn(s3Service, 'putObject').mockImplementation(() => Promise.resolve())
        const sensorData = { invalid: { foo: 'bar' } }
        await SensorService.store(sensorData)
        const putObjectCallsArgs = putObjectSpy.mock.calls
        expect(putObjectCallsArgs.length).toBe(1)

        //Invalid
        const bucketNameArgInvalid = putObjectCallsArgs[0][0]
        const keyArgInvalid = putObjectCallsArgs[0][1]
        const bodyArgInvalid = putObjectCallsArgs[0][2]
        expect(bucketNameArgInvalid).toStrictEqual(bucketName)
        expect(keyArgInvalid).toMatch(invalidPathRegex)
        expect(bodyArgInvalid).toStrictEqual(JSON.stringify(sensorData.invalid))
    })
})
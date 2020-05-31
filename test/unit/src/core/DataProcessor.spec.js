'use strict'
const Validator = require('../../../../src/core/Validator')
const DataProcessor = require('../../../../src/core/DataProcessor')


describe('DataProcessor', () => {

    beforeEach(() => { jest.restoreAllMocks() })

    it('Processes invalid sensors', async () => {
        const validatorSpy = jest.spyOn(Validator, 'validate')
            .mockImplementation(() => ['dummy error on sensor'])
        const sensors = [{ foo: 'bar' }, { hello: 'world' }]
        const data = await DataProcessor.process(sensors)
        expect(validatorSpy.mock.calls).toEqual([[{ 'foo': 'bar' }], [{ 'hello': 'world' }]])
        expect(data).toStrictEqual({ invalid: [{ errors: ['dummy error on sensor'], foo: 'bar' }, { errors: ['dummy error on sensor'], hello: 'world' }] })
    })

    it('Processes valid sensors', async () => {
        const validatorSpy = jest.spyOn(Validator, 'validate')
            .mockImplementation(() => [])
        const sensors = [{ foo: 'bar' }, { hello: 'world' }]
        const data = await DataProcessor.process(sensors)
        expect(validatorSpy.mock.calls).toEqual([[{ 'foo': 'bar' }], [{ 'hello': 'world' }]])
        expect(data).toStrictEqual({ valid: [{ current: NaN, foo: 'bar' }, { current: NaN, hello: 'world' }] })
    })

    it('Calculates current successfully', () => {
        const sensor = {
            name: 'battery',
            direction: 1,
            offset: 0,
            baseline: 5000,
            voltage: 5300,
            range: 300
        }
        expect(DataProcessor._calculateCurrent(sensor)).toBe(18)
    })
})
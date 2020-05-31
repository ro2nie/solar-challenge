'use strict'
const Validator = require('../../../../src/core/Validator')
const validSensorsData = require('../../resources/validSensors.json')
const invalidSensorsData = require('../../resources/invalidSensors.json')

describe('Validator', () => {

    it.each`
    sensor                                     | expectedValidationFailures
    ${validSensorsData.sensors[0]}             | ${[]}
    ${validSensorsData.sensors[1]}             | ${[]}
    ${validSensorsData.sensors[2]}             | ${[]}
    ${validSensorsData.sensors[3]}             | ${[]}
    `('should return $expectedValidationFailures when valid $sensor is used', async ({ sensor, expectedValidationFailures }) => {
        expect(Validator.validate(sensor)).toStrictEqual(expectedValidationFailures)
    });

    it.each`
    sensor                            | expectedValidationFailures
    ${invalidSensorsData.sensors[0]}  | ${['Missing fields name, offset, voltage.']}
    ${invalidSensorsData.sensors[1]}  | ${['Field randomKey is not allowed.']}
    ${invalidSensorsData.sensors[2]}  | ${[
            'Value 2 for field direction was not in the list of possible values [-1,1].',
            'Value 10001 for field baseline is not inside the allowed range of {"min":0,"max":10000}.'
        ]}
    ${invalidSensorsData.sensors[3]}  | ${[
            'Value 1 for field name should be of type string. Not number.',
            'Value 2 for field direction was not in the list of possible values [-1,1].',
            'Value 0.1 for field offset should be of type integer. Not number.',
            'Value -1 for field baseline is not inside the allowed range of {"min":0,"max":10000}.'
        ]}
    ${invalidSensorsData.sensors[4]}  | ${[
            'Value areallylooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooongname for field name did not match regex /^.{1,100}$/.',
            'Value 1 for field direction should be of type integer. Not string.',
            'Value 1 for field direction was not in the list of possible values [-1,1].',
            'Value 0 for field offset should be of type integer. Not string.',
            'Value 1 for field baseline should be of type integer. Not string.',
            'Value 5300 for field voltage should be of type integer. Not string.',
            'Value 0 for field range should be of type integer. Not string.'
        ]}
   
    `('should return $expectedValidationFailures when invalid $sensor is used', async ({ sensor, expectedValidationFailures }) => {
            expect(Validator.validate(sensor)).toStrictEqual(expectedValidationFailures)
        });
})
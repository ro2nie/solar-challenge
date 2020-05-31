'use strict'

const { uuidV4 } = require('../../../../src/utils/UUIDGenerator')

describe('uuidGenerator', () => {

    it('Generates a valid UUID', () => {
        expect(uuidV4()).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
    })
})
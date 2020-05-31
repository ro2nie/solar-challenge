const { S3Service } = require('../../../../src/store/S3Service')

describe('S3Service', () => {

    describe('Test the putObject functon', () => {

        it('Test putObject with success response', async (done) => {
            const expectedResponse = 'SUCCESS'
            const s3Service = new S3Service(createS3Mock(expectedResponse))
            const response = await s3Service.putObject('testBucket', 'someKey', 'some content')
            expect(response).toStrictEqual(expectedResponse)
            done()
        })

        it('Test putObject with error response', async (done) => {
            const expectedResponse = 'ERROR'
            const s3Service = new S3Service(createS3Mock(expectedResponse, true))
            try {
                await s3Service.putObject('testBucket', 'someKey', 'some content')
                done()
            } catch (err) {
                expect(response).toStrictEqual(expectedResponse)
            }
        })
    })

    const createS3Mock = (response, throwError) => {
        return {
            putObject: () => {
                return {
                    promise: () => {
                        return new Promise((resolve, reject) => {
                            if (throwError) {
                                reject(response)
                                return
                            }
                            resolve(response)
                        })
                    }
                }
            }
        }
    }
})
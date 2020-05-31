const { S3Service } = require('../../../../src/store/S3Service')

describe('S3Service', () => {

    it('Test putObject with success response with key not starting with a slash', async (done) => {
        const expectedResponse = 'SUCCESS'
        const startsWithMock = jest.fn().mockImplementation(() => false);
        const substringMock = jest.fn()
        const mockedKey = { startsWith: startsWithMock, substring: substringMock, }
        const s3Service = new S3Service(createS3Mock(expectedResponse))
        const response = await s3Service.putObject('testBucket', mockedKey, 'some content')
        expect(response).toStrictEqual(expectedResponse)
        expect(startsWithMock).toHaveBeenCalledWith('/')
        expect(substringMock).not.toHaveBeenCalled()
        done()
    })

    it('Test putObject with success response with key starting with a slash', async (done) => {
        const expectedResponse = 'SUCCESS'
        const startsWithMock = jest.fn().mockImplementation(() => true);
        const substringMock = jest.fn().mockImplementation(() => true);
        const mockedKey = { startsWith: startsWithMock, substring: substringMock, }
        const s3Service = new S3Service(createS3Mock(expectedResponse))
        const response = await s3Service.putObject('testBucket', mockedKey, 'some content')
        expect(response).toStrictEqual(expectedResponse)
        expect(startsWithMock).toHaveBeenCalledWith('/')
        expect(substringMock).toHaveBeenCalledWith(1)
        done()
    })

    it('Test putObject with error response', async (done) => {
        const expectedResponse = 'ERROR'
        const s3Service = new S3Service(createS3Mock(expectedResponse, true))
        try {
            await s3Service.putObject('testBucket', 'someKey', 'some content')
        } catch (err) {
            expect(response).toStrictEqual(expectedResponse)
        }
        done()
    })

    const createS3Mock = (response, throwError) => {
        return {
            putObject: () => {
                return {
                    promise: () => {
                        return new Promise((resolve, reject) => throwError ? reject(response) : resolve(response))
                    }
                }
            }
        }
    }
})
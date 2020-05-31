const { S3Factory } = require('../../../../src/store/S3Factory')

class Endpoint {
    constructor(url) {
        this.url = url
    }
}

class S3 {
    constructor(config) {
        this.config = config
    }
}

const mockAws = {
    S3: S3,
    Endpoint: Endpoint
}

describe('S3Factory', () => {

    it('Test dev mode', () => {
        process.env.ENV = 'dev'
        process.env.S3_HOST = 'some/host'
        process.env.S3_PORT = '8000'
        const s3Factory = new S3Factory(mockAws)
        const s3 = s3Factory.getS3()
        expect(s3.config).toStrictEqual({
            s3ForcePathStyle: true,
            endpoint: new Endpoint(`http://some/host:8000`)
        })
    })
})
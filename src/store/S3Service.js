'use strict'
const { s3Factory } = require('./S3Factory')

class S3Service {

    constructor(s3) { 
        this.s3 = s3 
    }

    putObject(bucketName, key, body) {
        console.log('The key', key.startsWith())
        return this.s3.putObject({ Bucket: bucketName, Key: key.startsWith('/') ? key.substring(1) : key, ContentType: 'application/json; charset=utf-8', Body: body }).promise().catch(error => console.error(`Error thrown when calling putObject for ${bucketName}:${key}`, error))
    }
}
module.exports = {
    s3Service: new S3Service(s3Factory.getS3()),
    S3Service: S3Service
}
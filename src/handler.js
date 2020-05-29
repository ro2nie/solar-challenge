'use strict';

const DataProcessor = require('./DataProcessor')
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true }
const dataProcessor = new DataProcessor()

module.exports.solar = async event => {
    try {
        let body
        try {
            body = JSON.parse(event.body)
        } catch (err) {
            return {
                statusCode: 422, headers: corsHeaders, body: JSON.stringify({
                    statusCode: 422,
                    error: "Unprocessable entity",
                    message: err.message
                })
            }
        }

        let validationFailures
        try {
            validationFailures = await dataProcessor.process(body)
        } catch (err) {
            console.log('ERR', err)
        }
        console.log('VAL FAIL', validationFailures)

        if (validationFailures.length) {
            return {
                statusCode: 400, headers: corsHeaders, body: JSON.stringify({
                    statusCode: 400,
                    error: "Bad Request",
                    message: validationFailures.join('\n')
                })
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (err) {
        return {
            statusCode: 500, headers: corsHeaders, body: JSON.stringify({
                statusCode: 500,
                error: "Internal Server Error",
                message: err.message
            })
        }
    }
};


/**
 * Todo
 * Receive payload
 * validate it
 * of the valid ones
 * Calculate all sensors in parallel
 * Do error handling
 * Then store the results in S3 for later use
 */


// {
//   "statusCode": 400,
//     "error": "Bad Request",
//       "message": "Invalid request payload JSON format"
// }
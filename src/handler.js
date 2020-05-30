'use strict'

const DataProcessor = require('./DataProcessor')
const SensorRequestService = require('./service/SensorRequestService')
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true }
let body

module.exports.solar = async event => {
    try {
        try {
            body = JSON.parse(event.body)
        } catch (err) {
            return {
                statusCode: 422, headers: corsHeaders, body: JSON.stringify({
                    statusCode: 422,
                    error: "Unprocessable Entity",
                    message: err.message
                })
            }
        }
        
        if (!body || !body.sensors || !body.sensors.length) {
            return {
                statusCode: 400, headers: corsHeaders, body: JSON.stringify({
                    statusCode: 400,
                    error: "Bad Request",
                    message: 'body did not contain sensor data'
                })
            }
        }
        SensorRequestService.store(await DataProcessor.process(body.sensors))
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
// 'use strict'

const HTTP_STATUS = require('./HttpStatusCodes')
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
}

module.exports = class ResponseBuilder {
  static buildResponse(statusCode, detailMessage) {

    const response = { statusCode, headers }

    if (statusCode.startsWith('2')) {
      response.body 
    } else {

    }

    return {
      statusCode,
      headers,


    }


    let body = {
      code: httpStatus.name,
      message: httpStatus.message
    }
    if (detailMessage) {
      body.details = {
        invalid: detailMessage
      }
    }
    return {
      statusCode: httpStatus.returnCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  }
}


// {
//   statusCode: 400,
//     headers: corsHeaders,
//       body: JSON.stringify({
//         statusCode: 400,
//         error: "Bad Request",
//         message: 'body did not contain sensor data'
//       })
// }
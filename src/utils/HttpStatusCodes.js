'use strict'

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
}

const codes = Object.freeze({
    ACCEPTED: {
        statusCode: 202
    },
    BAD_REQUEST: {
        statusCode: 400,
        error: "Bad Request"
    },
    UNPROCESSABLE_ENTITY: {
        statusCode: 422,
        error: "Unprocessable Entity"
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        error: "Internal Server Error"
    }
})

module.exports.HTTP_STATUS = codes

module.exports.responseBuilder = (status, message) => {
    let response = Object.assign({ headers }, { statusCode: status.statusCode })
    if (message) {
        response['body'] = JSON.stringify({
            error: status.error,
            message
        })
    }
    return response
}

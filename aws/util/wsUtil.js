const response = (statusCode, body) => {
    return {statusCode, body}
}

const connectionIdFromEvent = event => event.requestContext.connectionId;

const bodyFromEvent = event => JSON.parse(event.body);

module.exports = {
    response,
    connectionIdFromEvent,
    bodyFromEvent,
}

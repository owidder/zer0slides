const {AWS} = require("./awsUtil");

const response = (statusCode, body) => {
    return {statusCode, body}
}

const connectionIdFromEvent = event => event.requestContext.connectionId;

const bodyFromEvent = event => JSON.parse(event.body);

const send = (event, connectionId, text) => {
    console.log(`>>>>>> send to connectionId [${connectionId}]: "${text}"`);
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    return apigwManagementApi
        .postToConnection({ConnectionId: connectionId, Data: text})
        .promise();
};

module.exports = {
    response,
    connectionIdFromEvent,
    bodyFromEvent,
    send,
}

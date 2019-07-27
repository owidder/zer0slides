const {AWS} = require("./awsUtil");
const {logFunctionIn, logFunctionOut} = require("./logUtil");

const response = (statusCode, body) => {
    return {statusCode, body}
}

const connectionIdFromEvent = event => event.requestContext.connectionId;

const bodyFromEvent = event => JSON.parse(event.body);

const send = (event, connectionId, text) => {
    logFunctionIn("send", {event, connectionId, text});

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    const promise = apigwManagementApi
        .postToConnection({ConnectionId: connectionId, Data: text})
        .promise();

    logFunctionOut("send", {event, connectionId, text});

    return promise;
};

const sendToAllOtherConnections = (event, connectionIds, text) => {
    logFunctionIn("sendToAllOtherConnections", {event, connectionIds, text});

    const selfConnectionId = connectionIdFromEvent(event);
    console.log(`sendToAllConnections (except [${selfConnectionId}]): ${JSON.stringify(connectionIds)}`);
    const sendPromises = connectionIds.map(async ({connectionId}) => {
        try {
            if(connectionId.S != selfConnectionId) {
                return await send(event, connectionId.S, text);

            } else {
                return Promise.resolve();
            }
        } catch (err) {
            console.log(JSON.stringify(err));
            throw err;
        }
    });

    logFunctionOut("sendToAllOtherConnections", {event, connectionIds, text});

    return Promise.all(sendPromises);
}

module.exports = {
    response,
    connectionIdFromEvent,
    bodyFromEvent,
    send,
    sendToAllOtherConnections,
}

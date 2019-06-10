"use strict";

const AWS = require("aws-sdk");
const Bluebird = require("bluebird");
AWS.config.update({region: process.env.AWS_REGION});
const DDB = new AWS.DynamoDB({apiVersion: "2012-10-08"});
AWS.config.setPromisesDependency(Bluebird);
require("aws-sdk/clients/apigatewaymanagementapi");

const fetch = require("node-fetch");
fetch.Promise = Bluebird;

const Z0CONNECTION_TABLE = process.env.Z0CONNECTION_TABLE

const nowAsString = () => {
    const now = new Date();
    return now.toString() + " ms: " + String(now.getMilliseconds());
}

const response = (statusCode, body) => {
    return {statusCode, body}
}

const logFunctionIn = (functionName, obj) => {
    console.log(`>>>> ${functionName}: ${JSON.stringify(obj)}`);
}

const logFunctionOut = (functionName, obj) => {
    console.log(`<<<< ${functionName}: ${JSON.stringify(obj)}`);
}

const ddbCall = (fct, params) => {
    console.log(`ddbCall: '${fct}' with params: ${JSON.stringify(params)}`);

    /*
     * Use own promise, since the callback is sometimes called more than once
     * (Do not ask why!)
     */
    return new Promise(resolve => {
        DDB[fct](params, (err, data) => {
            if(err) {
                console.log(err);
            }
            console.log(">>> data");
            console.log(data);
            console.log("<<< data");
            resolve(data);
        });
    })
}

const connectionIdFromEvent = event => event.requestContext.connectionId;

const bodyFromEvent = event => JSON.parse(event.body);

const putItem = (tableName, item) => {
    const timestamp = nowAsString();
    const itemWithTimestamp = {...item, timestamp: {S: timestamp}};
    console.log(`putItem: ${JSON.stringify(itemWithTimestamp)}`);

    const putParams = {
        TableName: tableName,
        Item: itemWithTimestamp
    };

    return ddbCall('putItem', putParams);
}

const connect = async (event, context, callback) => {
    logFunctionIn("connect", event);

    const connectionId = connectionIdFromEvent(event);
    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionId},
        syncId: {S: "N/A"}
    });

    callback(null, response(200, "CONNECTED"));

    logFunctionOut("connect", event);
}

const disconnect = async (event, context, callback) => {
    logFunctionIn("disconnect", event);

    const deleteParams = {
        TableName: Z0CONNECTION_TABLE,
        Key: {
            connectionId: {S: connectionIdFromEvent(event)}
        }
    };

    await ddbCall('deleteItem', deleteParams);

    callback(null, response(200, "DISCONNECTED"));

    logFunctionOut("disconnect", event);
}

const register = async (event, context, callback) => {
    logFunctionIn("register", event);

    console.log(`register: ${JSON.stringify(event)}`)
    const body = bodyFromEvent(event);
    console.log(`syncId: ${body.syncId}`)

    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionIdFromEvent(event)},
        syncId: {S: body.syncId}
    });

    send(event, connectionIdFromEvent(event), `registered: ${body.syncId}`);

    callback(null, response(200, "REGISTERED"));

    logFunctionOut("register", event);
}

const defaultMessage = (event, context, callback) => {
    callback(null);
};

const getSyncIdForConnectionId = async (connectionId) => {
    logFunctionIn("getSyncIdForConnectionId", {connectionId});

    const params = {
        Key: {connectionId: {S: connectionId}},
        TableName: process.env.Z0CONNECTION_TABLE
    }

    const result = await ddbCall('getItem', params);
    console.log(`result: ${JSON.stringify(result)}`);

    logFunctionOut("getSyncIdForConnectionId", {connectionId});
    if(result) {
        return result.Item.syncId.S;
    } else {
        console.error(`Not found any syncId for connectionId: ${connectionId}`);
        return "";
    }
}

const getConnectionIdsForSyncId = (syncId) => {
    logFunctionIn("getConnectionIdsForSyncId", {syncId});

    const params = {
        TableName: Z0CONNECTION_TABLE,
        ProjectionExpression: "connectionId",
        FilterExpression: "syncId = :syncId",
        ExpressionAttributeValues: {
            ":syncId": {S: syncId}
        }
    }

    const connectionIdsPromise = ddbCall('scan', params);

    logFunctionOut("getConnectionIdsForSyncId", {syncId});

    return connectionIdsPromise
}

const sendCommand = async (event, context, callback) => {
    logFunctionIn("sendCommand", event);

    console.log(`event: ${JSON.stringify(event)}`);
    const syncId = await getSyncIdForConnectionId(connectionIdFromEvent(event));

    const body = bodyFromEvent(event);
    const command = body.command;
    console.log(`command: ${command}`);

    console.log(`syncId: ${syncId}`);
    send(event, connectionIdFromEvent(event), syncId);

    const connectionIdsResult = await getConnectionIdsForSyncId(syncId);
    console.log(`connectionIds: ${JSON.stringify(connectionIdsResult)}`);
    send(event, connectionIdFromEvent(event), JSON.stringify(connectionIdsResult));

    await sendToAllConnections(event, connectionIdsResult.Items, command);

    callback(null, response(200, "COMMAND_SENT"));

    logFunctionOut("sendCommand", event);
}

const sendToAllConnections = (event, connectionIds, text) => {
    const sendPromises = connectionIds.map(async ({connectionId}) => {
        try {
            return await send(event, connectionId.S, text);
        } catch (err) {
            console.log(JSON.stringify(err));
            throw err;
        }
    });

    return Promise.all(sendPromises);
}

const send = (event, connectionId, text) => {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    return apigwManagementApi
        .postToConnection({ConnectionId: connectionId, Data: text})
        .promise();
};

module.exports = {
    connect,
    disconnect,
    sendCommand,
    defaultMessage,
    register
}

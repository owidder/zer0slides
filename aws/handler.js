"use strict";

const {AWS, DDB} = require("./util/awsUtil");

const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {nowAsString} = require("./util/timeUtil");
const {response, connectionIdFromEvent, bodyFromEvent} = require("./util/wsUtil");
const {ddbCall, putItem} = require("./util/ddbUtil");
const {getConnectionIdsForSyncId, getSyncIdForConnectionId, Z0CONNECTION_TABLE} = require("./connection");

const Z0COMMAND_TABLE = process.env.Z0COMMAND_TABLE

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

    const connectionId = connectionIdFromEvent(event);
    const syncId = await getSyncIdForConnectionId(connectionId);

    const deleteParams = {
        TableName: Z0CONNECTION_TABLE,
        Key: {
            connectionId: {S: connectionId}
        }
    };

    await ddbCall('deleteItem', deleteParams);
    await cleanCommandTable(syncId);

    callback(null, response(200, "DISCONNECTED"));

    logFunctionOut("disconnect", event);
}

const deleteCommandEntry = async (syncId) => {
    logFunctionIn("deleteCommandEntry", {syncId});

    const deleteParams = {
        TableName: Z0COMMAND_TABLE,
        Key: {
            syncId: {S: syncId}
        }
    };

    await ddbCall('deleteItem', deleteParams);

    logFunctionOut("deleteCommandEntry", {syncId});
}

const cleanCommandTable = async (syncId) => {
    logFunctionIn("cleanCommandTable", {syncId});

    const connectionIds = await getConnectionIdsForSyncId(syncId);

    if(!(connectionIds.Items && connectionIds.Items.length > 0)) {
        await deleteCommandEntry(syncId);
    }

    logFunctionOut("cleanCommandTable", {syncId});
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

    const params = {
        Key: {syncId: {S: body.syncId}},
        TableName: Z0COMMAND_TABLE
    }

    const result = await ddbCall('getItem', params);
    const lastCommand = (result && result.Item) ? result.Item.command.S : "{}";

    await send(event, connectionIdFromEvent(event), lastCommand);

    callback(null, response(200, "REGISTERED"));

    logFunctionOut("register", event);
}

const defaultMessage = (event, context, callback) => {
    callback(null);
};

const _getSyncIdForConnectionId = async (connectionId) => {
    logFunctionIn("getSyncIdForConnectionId", {connectionId});

    const params = {
        Key: {connectionId: {S: connectionId}},
        TableName: Z0CONNECTION_TABLE
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

const _getConnectionIdsForSyncId = (syncId) => {
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

const putIntoCommandTable = async (syncId, command) => {
    logFunctionIn("putIntoCommandTable", {syncId, command});

    const promise =  putItem(Z0COMMAND_TABLE, {
        syncId: {S: syncId},
        command: {S: command}
    });

    logFunctionOut("putIntoCommandTable", {syncId, command});

    return promise;
}

const sendCommand = async (event, context, callback) => {
    logFunctionIn("sendCommand", event);

    console.log(`event: ${JSON.stringify(event)}`);
    const syncId = await getSyncIdForConnectionId(connectionIdFromEvent(event));

    const body = bodyFromEvent(event);
    const command = body.command;
    console.log(`command: ${command}`);

    console.log(`syncId: ${syncId}`);

    const connectionIdsResult = await getConnectionIdsForSyncId(syncId);
    console.log(`connectionIds: ${JSON.stringify(connectionIdsResult)}`);

    await putIntoCommandTable(syncId, command);

    await sendToAllOtherConnections(event, connectionIdsResult.Items, command);

    callback(null, response(200, "COMMAND_SENT"));

    logFunctionOut("sendCommand", event);
}

const sendToAllOtherConnections = (event, connectionIds, text) => {
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

    return Promise.all(sendPromises);
}

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
    connect,
    disconnect,
    sendCommand,
    defaultMessage,
    register
}

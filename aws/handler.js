"use strict";

const {AWS, DDB} = require("./util/awsUtil");

const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {nowAsString} = require("./util/timeUtil");
const {response, connectionIdFromEvent, bodyFromEvent, send, sendToAllOtherConnections} = require("./util/wsUtil");
const {ddbCall, putItem} = require("./util/ddbUtil");
const {getConnectionIdsForSyncId, getSyncIdForConnectionId, Z0CONNECTION_TABLE, putIntoConnectionTable, removeFromConnectionTable} = require("./connection");
const {cleanCommandTable, Z0COMMAND_TABLE, putIntoCommandTable, getLastCommand} = require("./command");

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
    await removeFromConnectionTable(connectionId);
    await cleanCommandTable(syncId);

    callback(null, response(200, "DISCONNECTED"));

    logFunctionOut("disconnect", event);
}

const register = async (event, context, callback) => {
    logFunctionIn("register", event);

    console.log(`register: ${JSON.stringify(event)}`)
    const body = bodyFromEvent(event);
    console.log(`syncId: ${body.syncId}`)

    await putIntoConnectionTable(connectionIdFromEvent(event), body.syncId);
    const lastCommand = await getLastCommand(body.syncId);
    await send(event, connectionIdFromEvent(event), lastCommand);

    callback(null, response(200, "REGISTERED"));

    logFunctionOut("register", event);
}

const defaultMessage = (event, context, callback) => {
    callback(null);
};

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

module.exports = {
    connect,
    disconnect,
    sendCommand,
    defaultMessage,
    register
}

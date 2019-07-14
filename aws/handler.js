"use strict";

const {AWS, DDB} = require("./util/awsUtil");

const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {response, connectionIdFromEvent, bodyFromEvent, send, sendToAllOtherConnections} = require("./util/wsUtil");
const {getConnectionIdsForSyncId, getSyncIdForConnectionId, saveSyncId, removeFromConnectionTable, createNewConnection, saveCurrentPosition} = require("./connection");
const {cleanCommandTable, putIntoCommandTable, getLastCommand} = require("./command");

const connect = async (event, context, callback) => {
    logFunctionIn("connect", event);

    const connectionId = connectionIdFromEvent(event);
    await createNewConnection(connectionId);

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

    await saveSyncId(connectionIdFromEvent(event), body.syncId);
    const lastCommand = await getLastCommand(body.syncId);
    await send(event, connectionIdFromEvent(event), lastCommand);

    callback(null, response(200, "REGISTERED"));

    logFunctionOut("register", event);
}

const defaultMessage = (event, context, callback) => {
    callback(null);
};

const sendCurrentPosition = async (event, context, callback) => {
    logFunctionIn("sendCurrentPosition", event);

    const connectionId = connectionIdFromEvent(event);
    const body = bodyFromEvent(event);

    await saveCurrentPosition(connectionId, body.currentPosition);

    callback(null, response(200, "CURRENT POSITION SAVED"));

    logFunctionOut("sendCurrentPosition", event);
}

const sendCommand = async (event, context, callback) => {
    logFunctionIn("sendCommand", event);

    const syncId = await getSyncIdForConnectionId(connectionIdFromEvent(event));
    console.log(`syncId: ${syncId}`);

    const body = bodyFromEvent(event);
    const command = body.command;
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
    register,
    sendCurrentPosition,
}

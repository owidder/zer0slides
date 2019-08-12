"use strict";

const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {response, connectionIdFromEvent, bodyFromEvent, send, sendToAllOtherConnections} = require("./util/wsUtil");
const {
    getConnectionIdsForSyncId,
    getSyncIdForConnectionId,
    saveSyncId,
    removeFromConnectionTable,
    createNewConnection,
    saveCurrentPosition,
    setCurrentPosition,
    clearConnectionsForUserName,
    sendAllPositionsToUserName,
    sendAllPositionsToAllConnections} = require("./connection");
const {
    cleanCommandTable,
    updateCommand,
    getLastCommand,
    initSyncId,
    addAttributesToCommand,
    getAdminName} = require("./command");

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

    setTimeout(async () => {
        await removeFromConnectionTable(connectionId);
        await cleanCommandTable(syncId);
        const adminName = await getAdminName(syncId);
        if(adminName) {
            sendAllPositionsToUserName(event, adminName, syncId);
        }
    }, 5000);

    callback(null, response(200, "DISCONNECTED"));

    logFunctionOut("disconnect", event);
}

const register = async (event, context, callback) => {
    logFunctionIn("register", event);

    const body = bodyFromEvent(event);

    const {syncId, myName} = body;
    const connectionId = connectionIdFromEvent(event);
    const myNameOrConnectionId = myName ? myName : connectionId;

    await initSyncId(syncId, myNameOrConnectionId);

    await clearConnectionsForUserName(myNameOrConnectionId);
    await saveSyncId(connectionId, syncId, myNameOrConnectionId);
    const lastCommand = await getLastCommand(body.syncId);

    const adminName = await getAdminName(syncId);
    const isAdmin = (myName == adminName);

    await send(event, connectionId, myName ?
        addAttributesToCommand(lastCommand, {isAdmin}) :
        addAttributesToCommand(lastCommand, {myName: connectionId, isAdmin}));

    await sendAllPositionsToUserName(event, adminName, syncId);

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
    logFunctionIn("sendCommand", {event});

    const syncId = await getSyncIdForConnectionId(connectionIdFromEvent(event));
    console.log(`syncId: ${syncId}`);

    const body = bodyFromEvent(event);
    const commandStr = body.command;
    const command = JSON.parse(commandStr);

    const myName = body.myName;
    const adminName = await getAdminName(syncId);
    setCurrentPosition(event, String(command.slideNo), String(command.stepNo), adminName, myName);

    if(adminName == myName) {
        const connectionIdsResult = await getConnectionIdsForSyncId(syncId);
        console.log(`connectionIds: ${JSON.stringify(connectionIdsResult)}`);

        const hasChanged = await updateCommand(syncId, commandStr);

        if(hasChanged) {
            await sendToAllOtherConnections(event, connectionIdsResult.Items, commandStr);
        }
    }

    callback(null, response(200, "COMMAND_SENT"));

    logFunctionOut("sendCommand", {event, adminName});
}

module.exports = {
    connect,
    disconnect,
    sendCommand,
    defaultMessage,
    register,
    sendCurrentPosition,
}

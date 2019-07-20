const {logFunctionOut, logFunctionIn} = require("./util/logUtil");
const {ddbCall, putItem, updateItem} =  require("./util/ddbUtil");
const {getConnectionIdsForSyncId} = require("./connection");

const Z0COMMAND_TABLE = process.env.Z0COMMAND_TABLE

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

const getNumberOfConnectionsWithSyncId = async (syncId) => {
    logFunctionIn("getNumberOfConnectionsWithSyncId", {syncId});

    const connectionIds = await getConnectionIdsForSyncId(syncId);

    let count = 0;
    if(connectionIds.Items && connectionIds.Items.length > 0) {
        count = connectionIds.Items.length;
    }

    logFunctionOut("getNumberOfConnectionsWithSyncId", {syncId, count});

    return count;
}

const cleanCommandTable = async (syncId) => {
    logFunctionIn("cleanCommandTable", {syncId});

    const numberOfConnections = await getNumberOfConnectionsWithSyncId(syncId);

    if(numberOfConnections == 0) {
        await deleteCommandEntry(syncId);
    }

    logFunctionOut("cleanCommandTable", {syncId, numberOfConnections});
}

const updateCommand = async (syncId, command) => {
    logFunctionIn("updateCommand", {syncId, command});

    await updateItem(Z0COMMAND_TABLE, {syncId: {S: syncId}}, {command})

    logFunctionOut("updateCommand", {syncId, command});
}

const findRow = async (syncId) => {
    logFunctionIn("findRow", {syncId})

    const params = {
        Key: {syncId: {S: syncId}},
        TableName: Z0COMMAND_TABLE
    }

    const result = await ddbCall('getItem', params);
    const row = result ? result.Item : undefined;

    logFunctionOut("findRow", {syncId, result})

    return row
}

const isAdmin = async (syncId, myName) => {
    logFunctionIn("isAdmin", {syncId, myName})

    let _isAdmin = false;

    if(myName && myName.length > 0) {
        const row = await findRow(syncId);
        _isAdmin = (row && row.admin && row.admin.S == myName);
    }

    logFunctionOut("isAdmin", {syncId, myName, _isAdmin})

    return _isAdmin
}

const addAttributesToCommand = (commandAsString, attributes) => {
    logFunctionIn("addAttributesToCommand", {commandAsString, attributes})

    const command = JSON.parse(commandAsString);
    const commandWithAddedAttributes = {...command, ...attributes};

    logFunctionOut("addAttributesToCommand", {commandAsString, attributes, commandWithAddedAttributes})

    return JSON.stringify(commandWithAddedAttributes)
}

const getLastCommand = async (syncId) => {
    logFunctionIn("getLastCommand", {syncId})

    const params = {
        Key: {syncId: {S: syncId}},
        TableName: Z0COMMAND_TABLE
    }

    const result = await ddbCall('getItem', params);
    const lastCommand = (result && result.Item && result.Item.command && result.Item.command.S) ? result.Item.command.S : "{}";

    logFunctionOut("getLastCommand", {syncId, lastCommand});

    return lastCommand
}

const initSyncId = async (syncId, myName) => {
    logFunctionIn("initSyncId", {syncId, connectionId: myName});

    let isAdmin = false;

    const numberOfConnections = await getNumberOfConnectionsWithSyncId(syncId);
    if(numberOfConnections == 0) {
        const item = {
            syncId: {S: syncId},
            admin: {S: myName}
        }
        await putItem(Z0COMMAND_TABLE, item);

        isAdmin = true;
    }

    logFunctionOut("initSyncId", {syncId, connectionId: myName, numberOfConnections});

    return isAdmin
}

module.exports = {
    deleteCommandEntry,
    cleanCommandTable,
    Z0COMMAND_TABLE,
    updateCommand,
    getLastCommand,
    initSyncId,
    addAttributesToCommand,
    isAdmin,
}

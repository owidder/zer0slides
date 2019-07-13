const {logFunctionOut, logFunctionIn} = require("./util/logUtil");
const {ddbCall, putItem} =  require("./util/ddbUtil");
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

const cleanCommandTable = async (syncId) => {
    logFunctionIn("cleanCommandTable", {syncId});

    const connectionIds = await getConnectionIdsForSyncId(syncId);

    if(!(connectionIds.Items && connectionIds.Items.length > 0)) {
        await deleteCommandEntry(syncId);
    }

    logFunctionOut("cleanCommandTable", {syncId});
}

const putIntoCommandTable = async (syncId, command) => {
    logFunctionIn("putIntoCommandTable", {syncId, command});

    await putItem(Z0COMMAND_TABLE, {
        syncId: {S: syncId},
        command: {S: command}
    });

    logFunctionOut("putIntoCommandTable", {syncId, command});
}

const getLastCommand = async (syncId) => {
    logFunctionIn("getLastCommand", {syncId})

    const params = {
        Key: {syncId: {S: syncId}},
        TableName: Z0COMMAND_TABLE
    }

    const result = await ddbCall('getItem', params);
    const lastCommand = (result && result.Item) ? result.Item.command.S : "{}";

    logFunctionOut("getLastCommand", {syncId, lastCommand});

    return lastCommand
}

module.exports = {
    deleteCommandEntry,
    cleanCommandTable,
    Z0COMMAND_TABLE,
    putIntoCommandTable,
    getLastCommand,
}

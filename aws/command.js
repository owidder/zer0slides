const {logFunctionOut, logFunctionIn} = require("./util/logUtil");
const {ddbCall} =  require("./util/ddbUtil");
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

module.exports = {
    deleteCommandEntry,
    cleanCommandTable,
    Z0COMMAND_TABLE
}

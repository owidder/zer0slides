const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {ddbCall, putItem} = require("./util/ddbUtil");
const {bodyFromEvent, connectionIdFromEvent} = require("./util/wsUtil");

const Z0CONNECTION_TABLE = process.env.Z0CONNECTION_TABLE;

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

const getSyncIdForConnectionId = async (connectionId) => {
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

const putIntoConnectionTable = async (connectionId, syncId) => {
    logFunctionIn("putIntoConnectionTable", {connectionId, syncId});

    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionId},
        syncId: {S: syncId}
    });

    logFunctionOut("putIntoConnectionTable", {connectionId, syncId});
}

const removeFromConnectionTable = async (connectionId) => {
    logFunctionIn("removeFromConnectionTable", {connectionId});

    const deleteParams = {
        TableName: Z0CONNECTION_TABLE,
        Key: {
            connectionId: {S: connectionId}
        }
    };

    await ddbCall('deleteItem', deleteParams);

    logFunctionOut("removeFromConnectionTable", {connectionId});
}

module.exports = {
    getConnectionIdsForSyncId,
    getSyncIdForConnectionId,
    Z0CONNECTION_TABLE,
    putIntoConnectionTable,
    removeFromConnectionTable,
}
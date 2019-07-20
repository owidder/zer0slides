const {logFunctionIn, logFunctionOut} = require("./util/logUtil");
const {ddbCall, putItem, updateItem} = require("./util/ddbUtil");

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

const saveSyncId = async (connectionId, syncId, name) => {
    logFunctionIn("saveSyncId", {connectionId, syncId});

    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionId},
        syncId: {S: syncId},
        name: {S: name}
    });

    logFunctionOut("saveSyncId", {connectionId, syncId});
}

const saveCurrentPosition = async (connectionId, currentPosition) => {
    logFunctionIn("saveCurrentPosition", {currentPosition});

    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionId},
        currentPosition: {S: currentPosition}
    });

    logFunctionOut("saveCurrentPosition", {currentPosition});
}

const createNewConnection = async (connectionId) => {
    logFunctionIn("createNewConnection", {connectionId});

    await saveSyncId(connectionId, "N/A");

    logFunctionOut("createNewConnection", {connectionId});
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

const setCurrentPosition = async (connectionId, slideNo, stepNo) => {
    logFunctionIn("setCurrentPosition", {connectionId, slideNo, stepNo})

    await updateItem(Z0CONNECTION_TABLE, {connectionId: {S: connectionId}}, {slideNo, stepNo});

    logFunctionOut("setCurrentPosition", {connectionId, slideNo, stepNo})
}

module.exports = {
    getConnectionIdsForSyncId,
    getSyncIdForConnectionId,
    Z0CONNECTION_TABLE,
    saveSyncId,
    removeFromConnectionTable,
    createNewConnection,
    saveCurrentPosition,
    setCurrentPosition,
}
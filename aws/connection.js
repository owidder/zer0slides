const {logFunctionIn, logFunctionOut, logObject} = require("./util/logUtil");
const {ddbCall, putItem, updateItem} = require("./util/ddbUtil");
const {connectionIdFromEvent,send} = require("./util/wsUtil");
const types = require("./types");

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

const saveSyncId = async (connectionId, syncId, userName) => {
    logFunctionIn("saveSyncId", {connectionId, syncId});

    await putItem(Z0CONNECTION_TABLE, {
        connectionId: {S: connectionId},
        syncId: {S: syncId},
        userName: {S: userName}
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

const getConnectionIdsForUserName = (userName) => {
    const params = {
        TableName: Z0CONNECTION_TABLE,
        ProjectionExpression: "connectionId",
        FilterExpression: "userName = :userName",
        ExpressionAttributeValues: {
            ":userName": {S: userName}
        }
    }

    return ddbCall('scan', params);
}

const clearConnectionsForUserName = async (userName) => {
    logFunctionIn("clearConnectionsForUserName", {userName});

    const connectionIdsObj = await getConnectionIdsForUserName(userName);

    const promises = connectionIdsObj.Items.map(item => {
        return removeFromConnectionTable(item.connectionId.S);
    })

    logFunctionOut("clearConnectionsForUserName", {userName});

    return Promise.all(promises);
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

const formatAllPositions = (allPositions) => {
    logFunctionIn("formatAllPositions", {allPositions});

    let _formatted = [];
    if(allPositions.Items) {
        _formatted = allPositions.Items.map(position => {
            return  Object.keys(position).reduce((formattedPositions, attributeName) => {
                return {...formattedPositions, [attributeName]: position[attributeName].S}
            }, {})
        })
    }

    logFunctionOut("formatAllPositions", {allPositions, _formatted});

    return _formatted;
}

const sendAllPositions = async (event, adminName) => {
    logFunctionIn("sendAllPositions", {event, adminName});

    const params = {
        TableName: Z0CONNECTION_TABLE,
        ProjectionExpression: "connectionId, userName, slideNo, stepNo",
    }

    const allPositionsRaw = await ddbCall('scan', params);
    const allPositions = formatAllPositions(allPositionsRaw);

    const adminConnectionId = await getConnectionIdForUserName(adminName);
    await send(event, adminConnectionId, JSON.stringify({allPositions, type: types.ALL_POSITIONS}));

    logFunctionOut("sendAllPositions", {event, adminName});
}

const setCurrentPosition = async (event, slideNo, stepNo, adminName, userName) => {
    logFunctionIn("setCurrentPosition", {event, slideNo, stepNo})

    const connectionId = connectionIdFromEvent(event);
    await updateItem(Z0CONNECTION_TABLE, {connectionId: {S: connectionId}}, {slideNo, stepNo});

    const adminConnectionId = await getConnectionIdForUserName(adminName);
    await send(event, adminConnectionId, JSON.stringify({connectionId, userName, slideNo, stepNo, type: types.POSITION}));

    logFunctionOut("setCurrentPosition", {event, slideNo, stepNo})
}

const getConnectionIdForUserName = async (userName) => {
    logFunctionIn("getConnectionIdForUserName", {userName})

    const params = {
        TableName: Z0CONNECTION_TABLE,
        ProjectionExpression: "connectionId",
        FilterExpression: "userName = :userName",
        ExpressionAttributeValues: {
            ":userName": {S: userName}
        }
    }

    const connectionIdsObj = await getConnectionIdsForUserName(userName);

    const connectionId = (connectionIdsObj && connectionIdsObj.Items && connectionIdsObj.Items.length > 0) ?
        connectionIdsObj.Items[0].connectionId.S : undefined;

    logFunctionOut("getConnectionIdForUserName", {userName, connectionIdObj: connectionIdsObj, connectionId})

    return connectionId
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
    sendAllPositions,
    clearConnectionsForUserName,
}
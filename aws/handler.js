"use strict";

const AWS = require("aws-sdk");
const Bluebird = require("bluebird");
AWS.config.update({region: process.env.AWS_REGION});
const DDB = new AWS.DynamoDB({apiVersion: "2012-10-08"});
AWS.config.setPromisesDependency(Bluebird);
require("aws-sdk/clients/apigatewaymanagementapi");
const ddb = new AWS.DynamoDB.DocumentClient();

const successfullResponse = {
    statusCode: 200,
    body: "Connected, hell'ya"
};

const fetch = require("node-fetch");
fetch.Promise = Bluebird;

const nowAsString = () => {
    const now = new Date();
    return now.toString() + " ms: " + String(now.getMilliseconds());
}

const response = (statusCode, body) => {
    return {statusCode, body}
}

const putItem = (tableName, item) => {
    const timestamp = nowAsString();
    const itemWithTimestamp = {...item, timestamp: {S: timestamp}};
    console.log(`putItem: ${JSON.stringify(itemWithTimestamp)}`);

    const putParams = {
        TableName: tableName,
        Item: itemWithTimestamp
    };

    return DDB.putItem(putParams, function(err, data) {
        if(err) {
            console.log("err: " + err);
        }
        console.log("data: " + JSON.stringify(data));
    }).promise();
}

const connect = async (event, context, callback) => {
    await putItem(process.env.Z0CONNECTION_TABLE, {
        connectionId: {S: event.requestContext.connectionId},
        syncId: {S: "N/A"}
    });

    callback(null, response(200, "CONNECTED"));
}

const disconnect = async (event, context, callback) => {
    const deleteParams = {
        TableName: process.env.Z0CONNECTION_TABLE,
        Key: {
            connectionId: {S: event.requestContext.connectionId}
        }
    };

    await DDB.deleteItem(deleteParams).promise();

    callback(null, response(200, "DISCONNECTED"));
}

const register = async (event, context, callback) => {

    console.log(`register: ${JSON.stringify(event)}`)
    const body = JSON.parse(event.body);
    console.log(`syncId: ${body.syncId}`)

    await putItem(process.env.Z0CONNECTION_TABLE, {
        connectionId: {S: event.requestContext.connectionId},
        syncId: {S: body.syncId}
    });

    callback(null, response(200, "REGISTERED"));
}

const defaultMessage = (event, context, callback) => {
    callback(null);
};

const sendCommand = async (event, context, callback) => {
    console.log("sendMessage");
    console.log("event: " + JSON.stringify(event));
    console.log("context: " + JSON.stringify(context));
    let connectionData;
    try {
        connectionData = await DDB.scan({
            TableName: process.env.Z0CONNECTION_TABLE,
            ProjectionExpression: "connectionId"
        }).promise();
    } catch (err) {
        console.log(err);
        return {statusCode: 500};
    }
    const postCalls = connectionData.Items.map(async ({connectionId}) => {
        try {
            return await send(event, connectionId.S);
        } catch (err) {
            console.log(JSON.stringify(err));
            throw err;
        }
    });

    try {
        await Promise.all(postCalls);
    } catch (err) {
        console.log(err);
        callback(null, JSON.stringify(err));
    }
    callback(null, successfullResponse);
};

const send = (event, connectionId) => {
    const postData = JSON.parse(event.body).data;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    return apigwManagementApi
        .postToConnection({ConnectionId: connectionId, Data: postData})
        .promise();
};

module.exports = {
    connect,
    disconnect,
    sendCommand,
    defaultMessage,
    register
}

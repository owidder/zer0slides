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

const connect = async (event, context, callback) => {
    console.log("start connect");
    try {
        const putParams = {
            TableName: process.env.Z0CONNECTION_TABLE,
            Item: {
                connectionId: {S: event.requestContext.connectionId}
            }
        };

        await DDB.putItem(putParams, function(err, data) {
            console.log("err: " + err);
            console.log("data: " + JSON.stringify(data));
        }).promise();

        callback(null, {statusCode: 200, body: "CONNECTED"});
    } catch (e) {
        console.log(e);
        callback(null, {statusCode: 500, body: e});
    }
}

const disconnect = async (event, context, callback) => {
    try {
        const deleteParams = {
            TableName: process.env.Z0CONNECTION_TABLE,
            Key: {
                connectionId: {S: event.requestContext.connectionId}
            }
        };

        await DDB.deleteItem(deleteParams).promise();

        callback(null, {statusCode: 200, body: "DISCONNECTED"});
    } catch (e) {
        callback(null, {statusCode: 500, body: e});
    }
}

const defaultMessage = (event, context, callback) => {
    console.log("defaultMessage");
    console.log("event: " + JSON.stringify(event));
    console.log("context: " + JSON.stringify(context));
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
    defaultMessage
}

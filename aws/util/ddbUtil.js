const {DDB} = require("./awsUtil");
const {nowAsString} = require("./timeUtil");
const {logFunctionIn, logFunctionOut} = require("./logUtil");

const ddbCall = (fct, params) => {
    logFunctionIn("ddbCall", {fct, params})

    /*
     * Use own promise, since the callback is sometimes called more than once
     * (Do not ask why!)
     */
    const promise = new Promise(resolve => {
        DDB[fct](params, (err, data) => {
            if(err) {
                console.log(err);
            }
            console.log(`>>> data: ${fct} / ${JSON.stringify(params)}`);
            console.log(data);
            console.log(`<<< data: ${fct} / ${JSON.stringify(params)}`);
            resolve(data);
        });
    })

    logFunctionOut("ddbCall", {fct, params})

    return promise
}

const createUpdateExpression = (attributesToUpdate) => {
    logFunctionIn("createUpdateExpression", {attributesToUpdate})

    const attributeNames = Object.keys(attributesToUpdate);
    const updateExpressionParts = attributeNames.map(attributeName => {
        return `${attributeName} = :${attributeName}`
    })

    const updateExpression = `set ${updateExpressionParts.join(", ")}`;

    logFunctionOut("createUpdateExpression", {attributesToUpdate, updateExpression})

    return updateExpression
}

const createExpressionAttributeValues = (attributesToUpdate) => {
    logFunctionIn("createExpressionAttributeValues", {attributesToUpdate})

    const attributeNames = Object.keys(attributesToUpdate);

    const expressionAttributeValues = attributeNames.reduce((accum, attributeName) => {
        return {...accum, [`:${attributeName}`]: {S: attributesToUpdate[attributeName]}}
    }, {})

    logFunctionOut("createExpressionAttributeValues", {attributesToUpdate, expressionAttributeValues})

    return expressionAttributeValues
}

const updateItem = (tableName, key, attributesToUpdate) => {
    logFunctionIn("updateItem", {tableName, key, attributesToUpdate})

    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: createUpdateExpression(attributesToUpdate),
        ExpressionAttributeValues: createExpressionAttributeValues(attributesToUpdate),
        ReturnValues: "UPDATED_NEW"
    }

    const promise = ddbCall('updateItem', params);

    logFunctionOut("updateItem", {tableName, key, attributesToUpdate})

    return promise
}

const putItem = (tableName, item) => {
    logFunctionIn("putItem", {tableName, item})

    const timestamp = nowAsString();
    const itemWithTimestamp = {...item, timestamp: {S: timestamp}};
    console.log(`putItem: ${JSON.stringify(itemWithTimestamp)}`);

    const putParams = {
        TableName: tableName,
        Item: itemWithTimestamp
    };

    const promise = ddbCall('putItem', putParams);

    logFunctionOut("putItem", {tableName, itemWithTimestamp})

    return promise
}

module.exports = {
    ddbCall,
    putItem,
    updateItem,
}

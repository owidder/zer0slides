const {DDB} = require("./awsUtil");
const {nowAsString} = require("./timeUtil");

const ddbCall = (fct, params) => {
    console.log(`ddbCall: '${fct}' with params: ${JSON.stringify(params)}`);

    /*
     * Use own promise, since the callback is sometimes called more than once
     * (Do not ask why!)
     */
    return new Promise(resolve => {
        DDB[fct](params, (err, data) => {
            if(err) {
                console.log(err);
            }
            console.log(">>> data");
            console.log(data);
            console.log("<<< data");
            resolve(data);
        });
    })
}

const putItem = (tableName, item) => {
    const timestamp = nowAsString();
    const itemWithTimestamp = {...item, timestamp: {S: timestamp}};
    console.log(`putItem: ${JSON.stringify(itemWithTimestamp)}`);

    const putParams = {
        TableName: tableName,
        Item: itemWithTimestamp
    };

    return ddbCall('putItem', putParams);
}

module.exports = {
    ddbCall,
    putItem,
}

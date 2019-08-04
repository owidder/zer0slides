const register = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const {syncId, userName} = body;

    const putParams = {
        TableName: tableName,
        Item: {
        connectionId: {S: connectionId},
        syncId: {S: syncId},
        userName: {S: userName}
        }
    };

    await new Promise(r => {
        DDB.putItem(putParams, (err, data) => {
            if(err) {
                console.log(err);
            }
            resolve(data);
        });
    })

}

const logFunctionIn = (functionName, obj) => {
    console.log(`>>>> ${functionName}: ${JSON.stringify(obj)}`);
}

const logFunctionOut = (functionName, obj) => {
    console.log(`<<<< ${functionName}: ${JSON.stringify(obj)}`);
}

const logObject = (obj) => {
    console.log(JSON.stringify(obj));
}

module.exports = {
    logFunctionIn,
    logFunctionOut,
    logObject,
}

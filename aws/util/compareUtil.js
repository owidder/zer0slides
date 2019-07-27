const {logFunctionOut, logFunctionIn} = require("./logUtil");

const objectsEqual = (obj1, obj2) => {
    logFunctionIn("objectsEqual", {obj1, obj2});

    let _isEqual = false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if(keys1.length == keys2.length) {
        _isEqual = Object.keys(obj1).reduce((isEqual, attrName) => {
            return isEqual && (obj1[attrName] == obj2[attrName])
        }, true)
    }

    logFunctionOut("objectsEqual", {obj1, obj2, _isEqual});

    return _isEqual
}

module.exports = {objectsEqual}
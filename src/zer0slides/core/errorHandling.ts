export const errorTypes = {
    UNKNOWN_MESSAGE: "unknown message"
}

export type ErrorCallback = (message: string) => void;

const errorCallbacks: {[key: string]: ErrorCallback[]} = {};

export const addErrorCallback = (type: string, errorCallback: ErrorCallback) => {
    if(!errorCallbacks[type]) {
        errorCallbacks[type] = [];
    }
    errorCallbacks[type].push(errorCallback);
}

export const handleError = (type: string, message: string) => {
    if(errorCallbacks[type]) {
        errorCallbacks[type].forEach(errorCallback => errorCallback(message));
    }
}

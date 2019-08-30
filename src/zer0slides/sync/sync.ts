import {getParamValue, getParamValueWithDefault, setHashValue} from "../url/queryUtil2";
import {SimplePromise} from "../util/SimplePromise";
import {endpoint} from "./endpoint";
import {addPosition, AllPositions, Position, setAllPositions} from "./positions";
import {handleError, errorTypes} from "../core/errorHandling";
import {logObject} from "../util/logUtil";
import * as types from "./types";

const DEFAULT_STAGE = "dev";

const TYPE_COMMAND = "command";

let isAdminFlag = false;

export const isAdmin = () => {
    return isAdminFlag;
}

export interface Command {
    slideNo: number;
    stepNo: number;
}

export interface Typed {
    type: string;
    myName?: string;
    isAdmin?: boolean;
}

export const socketPromise: SimplePromise<WebSocket> = new SimplePromise();

const getWebsocketEndpoint = () => {
    const wse = getParamValue("wse");
    if(wse && wse.length > 0) {
        return decodeURIComponent(wse);
    }

    const stage = getParamValueWithDefault("stage", DEFAULT_STAGE);

    return endpoint[stage];
}

const register = (socket: WebSocket, syncId: string, myName?: string) => {
    const param = {
        action: "register",
        syncId,
        myName
    }

    socket.send(JSON.stringify(param));

    socketPromise.resolve(socket);
}

export const firstMessagePromise = new SimplePromise();

const getSyncId = () => getParamValue("syncId");
const getMyName = () => getParamValue("myName");

export const isSynced = (syncId?: string) => {
    const _syncId = syncId ? syncId : getSyncId();
    return (_syncId && _syncId.length > 0)
}

type Callback = (Typed) => void;

const typeToCallback: {[index: string]: Callback} = {}

export const registerCallbackForType = (type: string, callback: Callback) => {
    typeToCallback[type] = callback;
}

const handleTyped = (dataObj: Typed) => {
    if(dataObj.type) {
        logObject(dataObj, `new ${dataObj.type}`);
        const callback = typeToCallback[dataObj.type];
        if(callback) {
            callback(dataObj);
        }
        else {
            console.warn(`cannot handle: ${JSON.stringify(dataObj)}`);
        }
    }
}

const setMyName = (event: Typed) => {
    if(event.myName) {
        setHashValue("myName", event.myName)
    }
}

let lastCommand: Command;

export const initSync = (commandCallback: (Command) => void): Promise<void> => {
    const syncId = getSyncId();
    const myName = getMyName();
    if(isSynced(syncId)) {
        return new Promise(resolve => {
            const wse = getWebsocketEndpoint();
            const socket = new WebSocket(wse);

            socket.onopen = () => {
                console.log(`do register: ${new Date().toString()}`)
                register(socket, syncId, myName);
                resolve();
            }

            socket.onmessage = (event: {data: string}) => {
                const {data} = event;
                const typed: Typed = JSON.parse(data);

                setMyName(typed);
                if(typed.isAdmin !== undefined) {
                    isAdminFlag = typed.isAdmin;
                    console.log(`isAdmin: ${typed.isAdmin}`);
                }

                if(!typed.type || typed.type == TYPE_COMMAND) {
                    if((typed as any).message) {
                        console.error((typed as any).message);
                        handleError(errorTypes.UNKNOWN_MESSAGE, (typed as any).message);
                    }

                    const command = typed as unknown as Command;

                    logObject(command, "new command");

                    if(lastCommand == undefined) {
                        firstMessagePromise.resolve(command);
                    } else {
                        commandCallback(command);
                    }

                    lastCommand = command;
                } else {
                    handleTyped(typed);
                }

            };
        })
    }

    return Promise.resolve();
}

export const sendSlideNoAndStepNo = (slideNo: number, stepNo = -1) => {
    console.log(`sendSlideNoAndStepNo: ${JSON.stringify({slideNo, stepNo})}`)
    
    if(isSynced() && isAdmin()) {
        const myName = getMyName();
        const command = {slideNo: slideNo, stepNo: stepNo, type: TYPE_COMMAND};
        const commandStr = JSON.stringify(command);
        firstMessagePromise.then(() => {
            socketPromise.then((socket) => {
                console.log(`sending: ${commandStr}`);
                socket.send(JSON.stringify({action: "sendCommand", command: commandStr, myName}));
                lastCommand = command;
            })
        })
    }
}

registerCallbackForType(types.POSITION, (typed: Typed) => {
    const position = typed as unknown as Position;
    addPosition(position);
})

registerCallbackForType(types.ALL_POSITIONS, (typed: Typed) => {
    const allPositions = typed as unknown as AllPositions;
    setAllPositions(allPositions);
})
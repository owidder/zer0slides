import {getParamValue, getParamValueWithDefault} from "../url/queryUtil2";
import {SimplePromise} from "../util/SimplePromise";
import {endpoint} from "./endpoint";

const DEFAULT_STAGE = "dev";

const TYPE_COMMAND = "command";

export interface Command {
    slideNo: number;
    stepNo: number;
}

export interface Typed {
    type: string;
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

const register = (socket: WebSocket, syncId: string) => {
    const param = {
        action: "register",
        syncId
    }

    socket.send(JSON.stringify(param));

    socketPromise.resolve(socket);
}

export const firstMessagePromise = new SimplePromise();

const getSyncId = () => getParamValue("syncId");

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
        const callback = typeToCallback[dataObj.type];
        if(callback) {
            callback(dataObj);
        }
        else {
            console.warn(`cannot handle: ${JSON.stringify(dataObj)}`);
        }
    }
}

let lastCommand: Command;

export const initSync = (commandCallback: (Command) => void): Promise<void> => {
    const syncId = getSyncId();
    if(isSynced(syncId)) {
        return new Promise(resolve => {
            const wse = getWebsocketEndpoint();
            const socket = new WebSocket(wse);

            socket.onopen = () => {
                console.log(`do register: ${new Date().toString()}`)
                register(socket, syncId);
                resolve();
            }

            socket.onmessage = (event: {data: string}) => {
                const {data} = event;
                const typed: Typed = JSON.parse(data);

                if(!typed.type || typed.type == TYPE_COMMAND) {
                    const command = typed as unknown as Command;

                    console.log(command);

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
    if(isSynced() && (lastCommand.slideNo != slideNo || lastCommand.stepNo != stepNo)) {
        const command = {slideNo: slideNo, stepNo: stepNo, type: TYPE_COMMAND};
        const commandStr = JSON.stringify(command);
        firstMessagePromise.then(() => {
            socketPromise.then((socket) => {
                console.log(`sending: ${commandStr}`);
                socket.send(JSON.stringify({action: "sendCommand", command: commandStr}));
                lastCommand = command;
            })
        })
    }
}

import {getParamValue, getParamValueWithDefault} from "../url/queryUtil2";
import {slideCore} from "../core/core";
import {SimplePromise} from "../util/SimplePromise";
import {endpoint} from "./endpoint";

const DEFAULT_STAGE = "dev";

interface Command {
    slideNo: number;
    stepNo: number;
}

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

    slideCore.socketPromise.resolve(socket);
}

export const firstMessagePromise = new SimplePromise();

const getSyncId = () => getParamValue("syncId");

export const isSynced = (syncId?: string) => {
    const _syncId = syncId ? syncId : getSyncId();
    return (_syncId && _syncId.length > 0)
}

export const initSync = (): Promise<void> => {
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

            socket.onmessage = onMessage;
        })
    }

    return Promise.resolve();
}

let lastCommand: Command;

export const onMessage = (event: {data: string}) => {
    const {data} = event;
    const command: Command = JSON.parse(data);

    console.log(command);

    if(lastCommand == undefined) {
        firstMessagePromise.resolve(command);
    } else {
        slideCore.gotoSlideNoAndStepNo(command.slideNo, command.stepNo);
    }

    lastCommand = command;
}

export const sendSlideNoAndStepNo = (slideNo: number, stepNo = -1) => {
    if(isSynced() && (lastCommand.slideNo != slideNo || lastCommand.stepNo != stepNo)) {
        const command = {slideNo: slideNo, stepNo: stepNo};
        const commandStr = JSON.stringify(command);
        firstMessagePromise.then(() => {
            slideCore.socketPromise.then((socket) => {
                console.log(`sending: ${commandStr}`);
                socket.send(JSON.stringify({action: "sendCommand", command: commandStr}));
                lastCommand = command;
            })
        })
    }
}

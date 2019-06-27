import {getParamValue, getParamValueWithDefault} from "../url/queryUtil2";
import {slideCore} from "../core/core";
import {SimplePromise} from "../util/SimplePromise";
import {endpoint} from "./endpoint";

const DEFAULT_STAGE = "dev";

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

export const initSync = () => {
    return new Promise(resolve => {
        const syncId = getParamValue("syncId");
        if(syncId && syncId.length > 0) {
            const wse = getWebsocketEndpoint();
            const socket = new WebSocket(wse);

            socket.onopen = () => {
                register(socket, syncId);
                resolve();
            }

            socket.onmessage = onMessage;
        }
    })
}

export const onMessage = () => {
    firstMessagePromise.resolve();
}

export const sendCommand = (command: string) => {
    firstMessagePromise.then(() => {
        slideCore.socketPromise.then((socket) => {
            socket.send(JSON.stringify({action: "sendCommand", command}));
        })
    })
}

import {paramValue} from "../url/queryUtil";
import {slideCore} from "../core/core";
import {SimplePromise} from "../util/SimplePromise";

const getWebsocketEndpoint = async () => {
    const wse = paramValue("wse");
    return decodeURIComponent(wse);
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
    return new Promise(async resolve => {
        const syncId = paramValue("syncId");
        if(syncId && syncId.length > 0) {
            const wse = await getWebsocketEndpoint();
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

import {paramValue} from "../url/queryUtil";
import {slideCore} from "../core/core";

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

export const initSync = async () => {
    const syncId = paramValue("syncId");
    if(syncId && syncId.length > 0) {
        const wse = await getWebsocketEndpoint();
        const socket = new WebSocket(wse);
        socket.onopen = () => {
            register(socket, syncId);
        }
    }
}

export const sendCommand = (command: string) => {
    slideCore.socketPromise.then((socket) => {
        socket.send(command);
    })
}

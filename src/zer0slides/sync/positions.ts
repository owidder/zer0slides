export interface Position {
    connectionId: string;
    userName: string;
    slideNo: number;
    stepNo: number;
}

export interface Positions {
    [key: string]: Position;
}

export const positions: Positions = {};

export type Callback = () => void;
let _callback: Callback = () => undefined;

export const registerPositionChangedCallback = (callback: () => void) => {
    _callback = callback;
    if(Object.keys(positions).length > 0) {
        callback();
    }
}

export const addPosition = (position: Position) => {
    console.log(`add position: ${JSON.stringify(position)}`);
    positions[position.userName] = position;
    _callback();
}

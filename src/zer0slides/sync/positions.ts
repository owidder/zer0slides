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

export const addPosition = (position: Position) => {
    console.log(`add position: ${JSON.stringify(position)}`);
    positions[position.userName] = position;
}

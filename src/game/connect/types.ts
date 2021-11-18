export interface ServerWorld {
    id: string;
    name: string;
    tiles: Tile[];
    iframes: IframeGameObject[];
    images: ImageGameObject[];
    globalFields: GlobalField[];
}

export enum GameObjectType {
    Floor,
    Wall,
    Effect,
}

export interface Tile {
    x: number;
    y: number;
    movableRight: boolean;
    movableBottom: boolean;
}

export interface GameObject {
    type: GameObjectType;
    src: string;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IframeGameObject extends GameObject {
    fieldPortMappings: FieldPortMapping[];
    broadcasterPortMappings: BroadcasterPortMapping[];
}

export interface ImageGameObject extends GameObject {
    
}

// Mapping
export interface FieldPortMapping {
    id: number;
    portId: string;
}

export interface BroadcasterPortMapping {
    id: number;
    portId: string;
}

// Field & Broadcaster
export interface GlobalField {
    id: number;
    name: string;
    value: string;
}
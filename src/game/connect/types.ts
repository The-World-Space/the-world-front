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
    fieldPortMappings: IframeFieldPortMapping[];
    broadcasterPortMappings: IframeBroadcasterPortMapping[];
}

export interface ImageGameObject extends GameObject {
    
}

// Mapping
export interface IframeFieldPortMapping {
    id: number;
    portId: string;
    field: Field;
}

export interface IframeBroadcasterPortMapping {
    id: number;
    portId: string;
    broadcaster: Broadcaster;
}

// Field & Broadcaster
export interface Field {
    id: number;
    name: string;
    value: string;
}

export interface LocalField {
    iframe: IframeGameObject
}

export interface GlobalField {
    world: ServerWorld
}

export interface Broadcaster {
    id: number;
    name: string;
}

export interface LocalBroadcaster {
    iframe: IframeGameObject
}

export interface GlobalBroadcaster {
    world: ServerWorld
}
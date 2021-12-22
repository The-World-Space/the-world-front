
export namespace Server {

    type TILE_NUM = number;
    type CSS_OPTION = string;
    
    export interface World {
        id: string;
        name: string;
        tiles: Tile[];
        iframes: IframeGameObject[];
        images: ImageGameObject[];
        globalFields: GlobalField[];
    }
    
    export interface User {
        id: string,
        nickname: string,
        skinSrc: string
    }
    
    export enum GameObjectType {
        Floor,
        Wall,
        Effect,
    }
    
    export interface Tile {
        x: number;
        y: number;
        standable: boolean;
    }
    
    export interface GameObject {
        type: GameObjectType;
        src: string;
        id: number;
        x: TILE_NUM;
        y: TILE_NUM;
        width: TILE_NUM;
        height: TILE_NUM;
    }
    
    export interface IframeGameObject extends GameObject {
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
    }
    
    enum Anchor {
        TOP_LEFT,
        TOP_MID,
        TOP_RIGHT,
        CENTER_LEFT,
        CENTER_MID,
        CENTER_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_MID,
        BOTTOM_RIGHT
    }
    
    export interface IframeWidgetObject {
        width: CSS_OPTION,
        height: CSS_OPTION,
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
    
        anchor: Anchor;
        offset: {
            x: CSS_OPTION,
            y: CSS_OPTION
        }
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
        world: World
    }
    
    export interface Broadcaster {
        id: number;
        name: string;
    }
    
    export interface LocalBroadcaster {
        iframe: IframeGameObject
    }
    
    export interface GlobalBroadcaster {
        world: World
    }
}

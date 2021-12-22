
export namespace Server {

    type TileNum = number;
    type CssOption = string;

    type IframeSrc = string;
    type ImageSrc = string;
    
    export interface World {
        id: string;
        name: string;
        tiles: Tile[];
        iframes: IframeGameObject[];
        images: ImageGameObject[];
        globalFields: GlobalField[];
    }
    
    export interface User {
        id: string;
        nickname: string;
        skinSrc: ImageSrc;
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
    
    interface GameObject {
        type: GameObjectType;
        id: number;
        x: TileNum;
        y: TileNum;
        width: TileNum;
        height: TileNum;
    }
    
    export interface IframeGameObject extends GameObject {
        src: IframeSrc;
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
    }

    export interface ImageGameObject extends GameObject {
        src: ImageSrc;
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
    
    interface Widget {
        width: CssOption;
        height: CssOption;
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
    
        anchor: Anchor;
        offsetX: CssOption;
        offsetY: CssOption;
    }

    export interface IframeWidget extends Widget {
        src: IframeSrc;
    }

    export interface ImageWidget extends Widget {
        src: ImageSrc;
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


export namespace Server {

    type TileNum = number;
    type CssOption = string;

    type IframeSrc = string;
    type ImageSrc = string;

    export interface World {
        id: string;
        name: string;
        isPublic: boolean;
        players: User[];
        colliders: Collider[];
        atlasTiles: AtlasTile[];
        iframes: IframeGameObject[];
        images: ImageGameObject[];
        imageWidgets: ImageWidget[];
        globalFields: GlobalField[];
        globalBroadcasters: GlobalBroadcaster[];
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

    export interface Collider {
        x: number;
        y: number;
        isBlocked: boolean;
    }

    export interface AtlasTile {
        x: number;
        y: number;
        atlasIndex: number;
        atlas: Atlas;
        type: GameObjectType;
    }

    export interface Atlas {
        id: number;
        owner: User;
        isPublic: boolean;
        columnCount: number;
        rowCount: number;
        src: string;
        name: string;
    }

    interface GameObject {
        type: GameObjectType;
        id: number;
        x: TileNum;
        y: TileNum;
    }

    interface GameObjectProtoCollider extends Collider {
        gameObject: GameObjectProto;
    }

    interface GameObjectProto {
        name: string;
        id: number;
        owner: User;
        isPublic: boolean;
        width: TileNum;
        height: TileNum;
        type: GameObjectType;
        colliders: GameObjectProtoCollider[];
    }

    export interface IframeGameObjectProto extends GameObjectProto {
        src: IframeSrc;
    }

    export interface PenpalConnectable {
        id: number;
        src: IframeSrc;
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
        localBroadcasters: LocalBroadcaster[];
        localFields: LocalField[];
    }

    export interface IframeGameObject extends GameObject, PenpalConnectable {
        proto: IframeGameObjectProto;
    }

    export interface ImageGameObject extends GameObject {
        proto: ImageGameObjectProto;
    }

    export interface ImageGameObjectProto extends GameObjectProto {
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
        id: number;
        width: CssOption;
        height: CssOption;

        anchor: Anchor;
        offsetX: CssOption;
        offsetY: CssOption;
    }

    export interface IframeWidget extends Widget, PenpalConnectable {
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

    export interface LocalField extends Field {
        iframe: IframeGameObject;
    }

    export interface GlobalField extends Field {
        world: World;
    }

    export interface Broadcaster {
        id: number;
        name: string;
    }

    export interface LocalBroadcaster extends Broadcaster {
        iframe: IframeGameObject;
    }

    export interface GlobalBroadcaster extends Field {
        world: World;
    }
}

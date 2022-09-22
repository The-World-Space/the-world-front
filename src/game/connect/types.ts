export namespace Server {
    type TileNum = number;
    type CssOption = string;

    type IframeSrc = string;
    type ImageSrc = string;

    export interface World {
        id: string;
        name: string;
        admins: User[];
        amIAdmin: boolean;
        amIOwner: boolean;
        isPublic: boolean;
        players: User[];
        colliders: Collider[];
        atlasInfoScalar: AtlasInfoScalar;
        iframes: IframeGameObject[];
        images: ImageGameObject[];
        imageWidgets: ImageWidget[];
        globalFields: GlobalField[];
        globalBroadcasters: GlobalBroadcaster[];
    }

    export type AtlasInfoScalar = ({
        id: number;
        src: string;
        rowCount: number;
        columnCount: number;
        tiles: ({
            x: number;
            y: number;
            atlasIndex: number;
            type: number;
        })[];
    })[];
    
    export interface User {
        id: string;
        nickname: string;
        skinSrc: ImageSrc;
    }

    export enum GameObjectType {
        Floor = 0,
        Wall = 1,
        Effect = 2,
    }

    export interface Collider {
        x: number;
        y: number;
        isBlocked: boolean;
    }

    export enum TileType {
        Floor = 0,
        Effect = 1,
    }

    export interface AtlasTile {
        x: number;
        y: number;
        atlasIndex: number;
        atlas: Atlas;
        type: TileType;
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

    export type PenpalConnectable = WidgetPenpalConnectable | GameObjectPenpalConnectable;

    interface PenpalConnectableBase {
        id: number;
        fieldPortMappings: IframeFieldPortMapping[];
        broadcasterPortMappings: IframeBroadcasterPortMapping[];
        localBroadcasters: LocalBroadcaster[];
        localFields: LocalField[];
    }

    export interface WidgetPenpalConnectable extends PenpalConnectableBase {
        src: IframeSrc;
    }

    export interface GameObjectPenpalConnectable extends PenpalConnectableBase {
        proto_: {
            src: IframeSrc;
            id: number;
            owner: {
                id: string
            }
        } | null;
    }

    export interface IframeGameObject extends GameObject, GameObjectPenpalConnectable {
        proto_: IframeGameObjectProto | null;
    }

    export interface ImageGameObject extends GameObject {
        proto_: ImageGameObjectProto | null;
    }

    export interface ImageGameObjectProto extends GameObjectProto {
        src: ImageSrc;
    }

    enum Anchor {
        TOP_LEFT = 0,
        TOP_MID = 1,
        TOP_RIGHT = 2,
        CENTER_LEFT = 3,
        CENTER_MID = 4,
        CENTER_RIGHT = 5,
        BOTTOM_LEFT = 6,
        BOTTOM_MID = 7,
        BOTTOM_RIGHT = 8,
    }

    interface Widget {
        id: number;
        width: CssOption;
        height: CssOption;

        anchor: Anchor;
        offsetX: CssOption;
        offsetY: CssOption;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IframeWidget extends Widget, WidgetPenpalConnectable {
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
    

    // Type for value from server.
    // Actually server does not send this datas.
    // GQL, Protobuf MIXED
    export type IframeInfo = Server.IframeGameObject & {
        pluginPortMappings: PluginPortMapping[]
    };

    export interface PluginPortMapping {
        id: number;
        portId: string;
        plugin: Plugin;
    }

    export interface Plugin {
        id: number;
        name: string;
    }
}

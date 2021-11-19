import { ApolloClient } from "@apollo/client";
import { Effect, IframeEffect } from "../../core/Map/Objects/Effect";
import { Floor, IframeFloor } from "../../core/Map/Objects/Floor";
import { IframeWall, Wall } from "../../core/Map/Objects/Wall";
import { Direction } from "../../core/types/Base";
import { IframeShape } from "../../core/types/Shape/IframeShape";
import { ImageShape } from "../../core/types/Shape/ImageShape";
import { Shape } from "../../core/types/Shape/Shape";
import { World } from "../../core/World/World";
import { getWorld } from "./gql";
import { physicsLineFactory } from "./physicsLineFactory";
import {
    IframeGameObject as ServerIframeGameObject,
    ImageGameObject as ServerImageGameObject,
    GameObject as ServerGameObject,
    GameObjectType as ServerGameObjectType,
} from "./types";


function serverIframeObjectToGameObject(serverObject: ServerIframeGameObject, apolloClient: ApolloClient<any>) {
    const size = {width: serverObject.width, height: serverObject.height};
    const shape = new IframeShape(size, serverObject.src);

    const object =
        (serverObject.type === ServerGameObjectType.Floor)  ? new IframeFloor(shape, serverObject, apolloClient)  :
        (serverObject.type === ServerGameObjectType.Wall)   ? new IframeWall(shape, serverObject, apolloClient)   :
        (serverObject.type === ServerGameObjectType.Effect) ? new IframeEffect(shape, serverObject, apolloClient) :
        null;
    
    if (object === null) throw new Error("unknown type");
    
    object.setPosition({x: serverObject.x, y: serverObject.y});

    return object;
}

function serverImageObjectToGameObject(serverObject: ServerImageGameObject) {
    const size = {width: serverObject.width, height: serverObject.height};
    const shape = new ImageShape(size, serverObject.src);

    const object =
        (serverObject.type === ServerGameObjectType.Floor)  ? new Floor(shape)  :
        (serverObject.type === ServerGameObjectType.Wall)   ? new Wall(shape)   :
        (serverObject.type === ServerGameObjectType.Effect) ? new Effect(shape) : 
        null;
    
    if (object === null) throw new Error("unknown type");

    object.setPosition({x: serverObject.x, y: serverObject.y});
    
    return object;
}



export async function loadWorld(worldId: string, apolloClient: ApolloClient<any>) {
    const serverWorld = await getWorld(worldId, apolloClient);
    const serverObjects: ServerGameObject[] = [...serverWorld.iframes, ...serverWorld.images];
    
    const width = Math.max(...serverObjects.map(o => o.x + o.width));
    const height = Math.max(...serverObjects.map(o => o.y + o.height));
    
    const world = new World({width, height});
    const worldMap = world.getMap();

    // physics Line setup ======================================================
    const tiles = 
        serverWorld.tiles
            .reduce((acc, tile) => {
                if(tile.movableRight) acc.push({x: tile.x, y: tile.y, direction: Direction.right});
                if(tile.movableBottom) acc.push({x: tile.x, y: tile.y, direction: Direction.down});
                return acc;
            }, [] as {x: number, y: number, direction: Direction}[]);

    const physicsLines = physicsLineFactory(width, height, tiles);
    worldMap.setPhysicsLineMap(physicsLines);

    
    // game objects setup ======================================================
    const gameObjects = [
        ...serverWorld.iframes.map(serverObject => serverIframeObjectToGameObject(serverObject, apolloClient)),
        ...serverWorld.images.map(serverObject => serverImageObjectToGameObject(serverObject))
    ];
    gameObjects.forEach(gameObject => {
        if (gameObject instanceof Floor || gameObject instanceof IframeFloor) {
            worldMap.getFloors().push(gameObject);
        }
        else if (gameObject instanceof Wall || gameObject instanceof IframeWall) {
            worldMap.getWalls().push(gameObject);
        }
        else if (gameObject instanceof Effect || gameObject instanceof IframeEffect) {
            worldMap.getEffects().push(gameObject);
        }
    });

    return world;
}
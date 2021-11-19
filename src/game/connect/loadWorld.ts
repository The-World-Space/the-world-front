import { ApolloClient } from "@apollo/client";
import { Effect } from "../../core/Map/Objects/Effect";
import { Floor } from "../../core/Map/Objects/Floor";
import { Wall } from "../../core/Map/Objects/Wall";
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


function serverObjectToGameObject(serverObject: ServerGameObject, shape: Shape) {
    const size = {width: serverObject.width, height: serverObject.height};

    if (shape === null) throw new Error("unknown shape");

    const object =
        (serverObject.type === ServerGameObjectType.Floor)  ? new Floor(shape)  :
        (serverObject.type === ServerGameObjectType.Wall)   ? new Wall(shape)   :
        (serverObject.type === ServerGameObjectType.Effect) ? new Effect(shape) : 
        null;
    
    if (object === null) throw new Error("unknown type");

    object.setPosition({x: serverObject.x, y: serverObject.y});
    
    return object;
}

function serverIframeObjectToGameObject(serverObject: ServerIframeGameObject) {
    const size = {width: serverObject.width, height: serverObject.height};
    const shape = new IframeShape(size, serverObject.src);

    return serverObjectToGameObject(serverObject, shape);
}

function serverImageObjectToGameObject(serverObject: ServerImageGameObject) {
    const size = {width: serverObject.width, height: serverObject.height};
    const shape = new ImageShape(size, serverObject.src);

    return serverObjectToGameObject(serverObject, shape);
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
        ...serverWorld.iframes.map(serverObject => serverIframeObjectToGameObject(serverObject)),
        ...serverWorld.images.map(serverObject => serverImageObjectToGameObject(serverObject))
    ];
    gameObjects.forEach(gameObject => {
        if (gameObject instanceof Floor) {
            worldMap.getFloors().push(gameObject);
        }
        else if (gameObject instanceof Wall) {
            worldMap.getWalls().push(gameObject);
        }
        else if (gameObject instanceof Effect) {
            worldMap.getEffects().push(gameObject);
        }
    });

    return world;
}
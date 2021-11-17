import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ApolloLink,
    Operation,
    FetchResult,
    Observable,
} from "@apollo/client/core";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    gql
} from "@apollo/client";
import { print } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-ws";
import { Effect } from "../core/Map/Objects/Effect";
import { Floor } from "../core/Map/Objects/Floor";
import { Wall } from "../core/Map/Objects/Wall";
import { WorldMap } from "../core/Map/WorldMap";
import { Renderer } from "../core/Renderer/Renderer";
import { Direction } from "../core/types/Base";
import { ImageShape } from "../core/types/Shape/ImageShape";
import { World } from "../core/World/World";
import { Human } from "../game/character/Human";
import { Controler } from "../game/Controller/Controller";
import { physicsLineFactory } from "../game/physicsLine/physicsLineFactory"
import Context from "../context";
import { JWT_KEY } from "../context/consts";


const worldMap = new WorldMap({ height: 50, width: 50 });
const world = new World({ height: 100, width: 100 });



// Floor

enum FloorTile {
    GRASS = "014",
    RIGHT_BOTTOM_GRASS = "000",
    RIGHT_TOP_GRASS = "026",
    LEFT_BOTTOM_GRASS = "002",
    LEFT_TOP_GRASS = "028",
    BOTTOM_GRASS = "021",
    RIGHT_GRASS = "013",
    LEFT_GRASS = "015",
    TOP_GRASS = "027"
}

{
    const floorMap: FloorTile[][] = [
        [FloorTile.RIGHT_BOTTOM_GRASS, ...new Array(8).fill(FloorTile.BOTTOM_GRASS), FloorTile.LEFT_BOTTOM_GRASS],
        ...new Array(8).fill([FloorTile.RIGHT_GRASS, ...new Array(8).fill(FloorTile.GRASS), FloorTile.LEFT_GRASS]),
        [FloorTile.RIGHT_TOP_GRASS, ...new Array(8).fill(FloorTile.TOP_GRASS), FloorTile.LEFT_TOP_GRASS],
    ]

    const floors = worldMap.getFloors();

    for (let y = 0; y < floorMap.length; y++) {
        const line = floorMap[y];
        for (let x = 0; x < line.length; x++) {
            const tileId = line[x];

            const floor = new Floor(
                new ImageShape({
                    width: 1,
                    height: 1,
                }, `/assets/tile/tile${tileId}.png`),
            );

            floor.setPosition({ x, y });

            floors.push(floor);
        }
    }
}




// Wall
{
    {
        const wall = new Wall(
            new ImageShape({
                width: 2,
                height: 2,
            }, '/assets/wall/tree.png'),
        );
        wall.setPosition({ x: 1, y: 1 });
        worldMap.getWalls().push(wall);
    }

    {
        const wall = new Wall(
            new ImageShape({
                width: 2,
                height: 2,
            }, '/assets/wall/tree.png'),
        );
        wall.setPosition({ x: 6, y: 4 });
        worldMap.getWalls().push(wall);
    }
}


// Effect
{
    const effect = new Effect(
        new ImageShape({
            width: 2,
            height: 2,
        }, '/assets/effect/snow.gif')
    );
    effect.setPosition({ x: 4, y: 4 });
    worldMap.getEffects().push(effect);
}



// Physics
{
    const physicsLineMap = physicsLineFactory(10, 10, [
        { x: 1, y: 1, direction: Direction.up },
        { x: 2, y: 1, direction: Direction.up },
        { x: 1, y: 1, direction: Direction.left },
        { x: 2, y: 1, direction: Direction.right },
        { x: 1, y: 1, direction: Direction.down },
        { x: 2, y: 1, direction: Direction.down },

        { x: 6, y: 4, direction: Direction.up },
        { x: 7, y: 4, direction: Direction.up },
        { x: 6, y: 4, direction: Direction.left },
        { x: 7, y: 4, direction: Direction.right },
        { x: 6, y: 4, direction: Direction.down },
        { x: 7, y: 4, direction: Direction.down },
    ]);
    worldMap.setPhysicsLineMap(physicsLineMap);
}


const character = new Human(
    new ImageShape({
        width: 1,
        height: 2,
    }, 'https://e7.pngegg.com/pngimages/517/871/png-clipart-8-bit-super-mario-illustration-super-mario-bros-new-super-mario-bros-video-game-sprite-angle-super-mario-bros.png'),
    {
        walking: ['top.gif', 'bottom.gif', 'left.gif', 'right.gif'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
        standing: ['tile008.png', 'tile000.png', 'tile012.png', 'tile004.png'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
    }
);
character.setPosition({ x: 0, y: 5 });
worldMap.getWalls().push(character);


world.setMap(worldMap);


const renderer = new Renderer(world);


const controler = new Controler(world.getPhysics(), renderer, document.body, character);


// @ts-ignore
window.debug = {
    world,
    character,
    renderer,
    controler,
};


function getSession() {
    return {
        token: localStorage.getItem(JWT_KEY),
    }
}


class WebSocketLink extends ApolloLink {
    private client: Client;

    constructor(options: ClientOptions) {
        super();
        this.client = createClient(options);
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) => {
            return this.client.subscribe<FetchResult>(
                { ...operation, query: print(operation.query) },
                {
                    next: sink.next.bind(sink),
                    complete: sink.complete.bind(sink),
                    error: (err) => {
                        if (Array.isArray(err))
                            // GraphQLError[]
                            return sink.error(
                                new Error(
                                    err.map(({ message }) => message).join(", ")
                                )
                            );

                        if (err instanceof CloseEvent)
                            return sink.error(
                                new Error(
                                    `Socket closed with event ${err.code} ${
                                        err.reason || ""
                                    }` // reason will be available on clean closes only
                                )
                            );

                        return sink.error(err);
                    },
                }
            );
        });
    }
}

const link = new WebSocketLink({
    url: "ws://computa.lunuy.com:40080/graphql",
    connectionParams: () => {
        const session = getSession();
        if (!session) {
            return {};
        }
        return {
            Authorization: `${session.token}`,
        };
    },
});

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
})


function movePlayer(apolloClient: ApolloClient<any>, x: number, y: number) {
    apolloClient.mutate({
        mutation: gql`
            mutation MoveCharacter($characterMove: CharacterMoveInput!) {
                moveCharacter(characterMove: $characterMove) {
                    x
                    y
                }
            }
        `,
        variables: {
            characterMove: {
                x,
                y
            }
        }
    });
}

controler.afterMove = (_) => {
    movePlayer(apolloClient, character.getPosition().x, character.getPosition().y);
}


function WorldPage() {
    const ref = useRef<HTMLDivElement>(null);

    const context = useContext(Context);

    useEffect(() => {

        ref.current?.appendChild(renderer.getWrapperDom());

    }, [ref]);

    return (
        <ApolloProvider client={apolloClient}>
            <div ref={ref}>

            </div>
        </ApolloProvider>
    );
}

export default WorldPage;
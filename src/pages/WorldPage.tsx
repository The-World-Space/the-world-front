import React, { useEffect, useRef } from "react";
import {
    ApolloClient,
    ApolloProvider,
    gql
} from "@apollo/client";
import { Effect } from "../core/Map/Objects/Effect";
import { Floor } from "../core/Map/Objects/Floor";
import { Wall } from "../core/Map/Objects/Wall";
import { Renderer } from "../core/Renderer/Renderer";
import { Direction } from "../core/types/Base";
import { ImageShape } from "../core/types/Shape/ImageShape";
import { World } from "../core/World/World";
import { Human } from "../game/character/Human";
import { physicsLineFactory } from "../game/connect/physicsLineFactory"
import { NetworkController } from "../game/Controller/NetworkController";
import useUser from "../hooks/useUser";
import { useParams } from "react-router";
import { KeyboardController } from "../game/Controller/KeyboardContoller";
import { IframeShape } from "../core/types/Shape/IframeShape";
import { loadWorld } from "../game/connect/loadWorld";
import { globalApolloClient } from "../game/connect/gql";
import styled from "styled-components";
import IngameInterface from "../components/organisms/IngameInterface";




async function makeTestWorld(world?: World) {
    world = world || new World({ height: 100, width: 30 });
    const worldMap = world.getMap();


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
            [FloorTile.RIGHT_BOTTOM_GRASS, ...new Array(28).fill(FloorTile.BOTTOM_GRASS), FloorTile.LEFT_BOTTOM_GRASS],
            ...new Array(98).fill([FloorTile.RIGHT_GRASS, ...new Array(28).fill(FloorTile.GRASS), FloorTile.LEFT_GRASS]),
            [FloorTile.RIGHT_TOP_GRASS, ...new Array(28).fill(FloorTile.TOP_GRASS), FloorTile.LEFT_TOP_GRASS],
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


    {
        // <temp code>
        const physicsLineList = [];
        const {height, width} = worldMap.getSize()
        for (let i = 0; i < height; i++) {
            physicsLineList.push({x: 0, y: i, direction: Direction.left});
            physicsLineList.push({x: width - 1, y: i, direction: Direction.right});
        }
        for (let i = 0; i < width; i++) {
            physicsLineList.push({x: i, y: 0, direction: Direction.up});
            physicsLineList.push({x: i, y: height - 1, direction: Direction.down});
        } 

        const physicsLineMap = physicsLineFactory(height, height, [
            ...physicsLineList,

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
        // </temp code>
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


    const character = new Human(
        new ImageShape({
            width: 1,
            height: 2,
        }, '/assets/hyeonjong/tile000.png'),
        {
            walking: ['top.gif', 'bottom.gif', 'left.gif', 'right.gif'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
            standing: ['tile008.png', 'tile000.png', 'tile012.png', 'tile004.png'].map(e => `/assets/hyeonjong/${e}`) as [string, string, string, string],
        }
    );
    character.setPosition({ x: 0, y: 5 });




    world.setMap(worldMap);
    world.addCharacter(character);


    const renderer = new Renderer(world);

    // const 


    // @ts-ignore
    globalThis.debug = {
        // @ts-ignore
        ...globalThis.debug,
        world,
        character,
        renderer,
    };



    
    return {
        world,
        renderer,
        apolloClient: globalApolloClient,
        character,
    }
}



function movePlayer(apolloClient: ApolloClient<any>, worldId: string, x: number, y: number) {
    apolloClient.mutate({
        mutation: gql`
            mutation MoveCharacter($characterMove: CharacterMoveInput!, $worldId: String!) {
                moveCharacter(characterMove: $characterMove, worldId: $worldId) {
                    x
                    y
                }
            }
        `,
        variables: {
            characterMove: {
                x,
                y
            },
            worldId
        }
    });
}


async function joinWorld(apolloClient: ApolloClient<any>, x: number, y: number, worldId: string) {
    return apolloClient.mutate({
        mutation: gql`
            mutation JOIN_WORLD($x: Int!, $y: Int!, $worldId: String!) {
                joinWorld(x: $x, y: $y, id: $worldId)
            }
        `,
        variables: {
            x,
            y,
            worldId,
        }
    })
}



const Wrapper = styled.div`
    display: flex;
    height: 100%;
`



function WorldPage() {
    const ref = useRef<HTMLDivElement>(null);
    const user = useUser();
    const { worldId } = useParams<{worldId: string}>();
    let networkController; 
    let controller: KeyboardController;
    let _LoadedWorld;
    
    
    useEffect(() => {
        if (!user) return;
        (async function(){
            const loadedWorld = await loadWorld(worldId, globalApolloClient)
            const { world, renderer, character } = await makeTestWorld(loadedWorld);
            world.getMap().getPhysicsLineMap().push(...new Array(60).fill([]));
    
            ref.current?.appendChild(renderer.getWrapperDom());
            
            renderer.disableWorldTransition();
            renderer.setCenter({ x: 0, y: 5 });
            
            controller = new KeyboardController(world.getPhysics(), renderer, renderer.getWrapperDom(), character);
            renderer.getWrapperDom().tabIndex = 0;
            renderer.getWrapperDom().focus();
            controller.getNameTagger().changeName(character, user.nickname);
            
            networkController = 
                new NetworkController(
                    renderer, 
                    world, 
                    character, 
                    worldId, 
                    user.id, 
                    globalApolloClient);
            
            await joinWorld(globalApolloClient, 0, 5, worldId);

            setTimeout(() => {
                renderer.enableWorldTransition();
                controller.afterMove = (_) => {
                    movePlayer(globalApolloClient, worldId, character.getPosition().x, character.getPosition().y);
                }
            }, 0);
        })();
    }, [ref, user]);

    return (
        <Wrapper>
            <div style={{
                zIndex: 1,
                height: '100%',
                pointerEvents: 'none',
            }}>
                <IngameInterface />
            </div>
            <div ref={ref} style={{
                zIndex: 0,
            }}/>
        </Wrapper>
    );
}

export default WorldPage;
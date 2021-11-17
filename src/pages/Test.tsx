import React, { useEffect, useRef, useState } from "react";
import { AnimationManager } from "../core/AnimationSystem/AnimationManager";
import { State } from "../core/AnimationSystem/State";
import { Character } from "../core/Character/Character";
import { Effect } from "../core/Map/Objects/Effect";
import { Floor } from "../core/Map/Objects/Floor";
import { Wall } from "../core/Map/Objects/Wall";
import { WorldMap } from "../core/Map/WorldMap";
import { Renderer } from "../core/Renderer/Renderer";
import { Direction } from "../core/types/Base";
import { ImageShape } from "../core/types/Shape/ImageShape";
import { World } from "../core/World/World";
import { Controler } from "../game/Controller/Controller";
import { physicsLineFactory } from "../game/physicsLine/physicsLineFactory"


const worldMap = new WorldMap({height: 50, width: 50});
const world = new World({height: 100, width: 100});



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

    for(let y = 0; y < floorMap.length; y++) {
        const line = floorMap[y];
        for(let x = 0; x < line.length; x++) {
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
        wall.setPosition({x: 1, y: 1});
        worldMap.getWalls().push(wall);
    }

    {
        const wall = new Wall(
            new ImageShape({
                width: 2,
                height: 2,
            }, '/assets/wall/tree.png'),
        );
        wall.setPosition({x: 6, y: 4});
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
    effect.setPosition({x: 4, y: 4});
    worldMap.getEffects().push(effect);
}



// Physics
{
    const physicsLineMap = physicsLineFactory(10, 10, [
        { x: 1, y: 4, direction: Direction.up },
        { x: 2, y: 4, direction: Direction.up },
        { x: 6, y: 7, direction: Direction.up },
        { x: 7, y: 7, direction: Direction.up }
    ]);
    worldMap.setPhysicsLineMap(physicsLineMap);
}

const state: State<1> = new State({
    async action() {
        await anime.stop(); 
        return state;
    },
});
const anime = new AnimationManager(1, state);

const character = new Character(
    anime,
    new ImageShape({
        width: 1,
        height: 2,
    }, 'https://e7.pngegg.com/pngimages/517/871/png-clipart-8-bit-super-mario-illustration-super-mario-bros-new-super-mario-bros-video-game-sprite-angle-super-mario-bros.png'),
);
character.setPosition({x: 0, y: 5});
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

function Test() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        ref.current?.appendChild(renderer.getWrapperDom());

    }, [ref]);

    return (
        <div ref={ref}>

        </div>
    );
}

export default Test;
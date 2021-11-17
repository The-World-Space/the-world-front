import React, { useEffect, useRef, useState } from "react";
import { AnimationManager } from "../core/AnimationSystem/AnimationManager";
import { State } from "../core/AnimationSystem/State";
import { Character } from "../core/Character/Character";
import { Effect } from "../core/Map/Objects/Effect";
import { Floor } from "../core/Map/Objects/Floor";
import { Wall } from "../core/Map/Objects/Wall";
import { WorldMap } from "../core/Map/WorldMap";
import { Renderer } from "../core/Renderer/Renderer";
import { ImageShape } from "../core/types/Shape/ImageShape";
import { World } from "../core/World/World";
import { Controler } from "../game/Controller/Controller";


const worldMap = new WorldMap({height: 50, width: 50});
const world = new World({height: 100, width: 100});

const floor = new Floor(
    new ImageShape({
        width: 1,
        height: 1,
    }, '/assets/tile/tile000.png'),
);
worldMap.getFloors().push(floor);

const wall = new Wall(
    new ImageShape({
        width: 2,
        height: 1,
    }, 'https://cdn.pixabay.com/photo/2019/11/27/03/16/white-4655992_960_720.jpg'),
);
wall.setPosition({x: 1, y: 1});
worldMap.getWalls().push(wall);


const effect = new Effect(
    new ImageShape({
        width: 2,
        height: 2,
    }, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Sky.jpg/1280px-Sky.jpg')
);
effect.setPosition({x: 4, y: 4});
worldMap.getEffects().push(effect);


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
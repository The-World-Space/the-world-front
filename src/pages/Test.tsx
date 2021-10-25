import React, { useEffect, useRef, useState } from "react";
import { Effect } from "../core/Map/Objects/Effect";
import { Floor } from "../core/Map/Objects/Floor";
import { Wall } from "../core/Map/Objects/Wall";
import { WorldMap } from "../core/Map/WorldMap";
import { Renderer } from "../core/Renderer/Renderer";
import { ImageShape } from "../core/types/Shape/ImageShape";
import { World } from "../core/World/World";


const worldMap = new WorldMap();
const world = new World();

const floor = new Floor(
    new ImageShape({
        width: 10,
        height: 10,
    }, 'http://imagescdn.gettyimagesbank.com/500/17/736/642/0/652288612.jpg'),
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


world.setMap(worldMap);
    
const renderer = new Renderer(world);

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
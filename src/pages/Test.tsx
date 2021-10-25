import React, { useEffect, useRef, useState } from "react";
import { Floor } from "../core/Map/Objects/Floor";
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
    }, 'https://newtoki15.org/data/file/comic/128728/10112451/154oJRWjLsZ9.jpg'),
);
worldMap.getFloors().push(floor);


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
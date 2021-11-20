import React, { useEffect, useRef } from "react";
import {
    ApolloClient,
    gql
} from "@apollo/client";
import { Floor } from "../core/Map/Objects/Floor";
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
import { loadWorld } from "../game/connect/loadWorld";
import { globalApolloClient } from "../game/connect/gql";
import styled from "styled-components";
import IngameInterface from "../components/organisms/IngameInterface";

const SPAWN_POS_X = 20;
const SPAWN_POS_Y = 15;


async function makeTestWorld(world?: World) {
    world = world || new World({ height: 28, width: 48 });
    const worldMap = world.getMap();


    // Floor

    enum FloorTile1 {
        WALL_UP__________ = 25,
        WALL_DOWN________ = 36,
        WALL_UPCONNER____ = 31,
        WALL_MIDDLECONNER = 27,
        WALL_DOWNCONNER__ = 32,
        FLOOR____________ = 44,
        WINDOW1_UP_______ = 21,
        WINDOW1_DOWN_____ = 23,
        WINDOW2_UP_______ = 22,
        WINDOW2_DOWN_____ = 24,
        EMPTY____________ = 0,
    }

    enum FloorTile2 {
        PARTITION30______ = -30,
        PARTITION31______ = -31,
        PARTITION32______ = -32,
        PARTITION33______ = -33,
        PARTITION34______ = -34,
        PARTITION35______ = -35,
        PARTITION51______ = -51,
        PARTITION53______ = -53,
        PARTITION55______ = -55,
        PARTITION57______ = -57,
        PARTITION61______ = -61,
    }

    {
        const floorMap: (FloorTile1 | FloorTile2)[][] = [
            [FloorTile2.PARTITION34______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION30______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION30______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION30______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION57______, FloorTile2.PARTITION35______],
            [FloorTile2.PARTITION55______, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile2.PARTITION61______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile2.PARTITION61______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile2.PARTITION61______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WINDOW1_UP_______, FloorTile1.WINDOW2_UP_______, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UPCONNER____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UPCONNER____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UPCONNER____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WINDOW1_DOWN_____, FloorTile1.WINDOW2_DOWN_____, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile1.WALL_UP__________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_MIDDLECONNER, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_MIDDLECONNER, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_MIDDLECONNER, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile1.WALL_DOWN________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.WALL_DOWNCONNER__, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.WALL_DOWNCONNER__, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.WALL_DOWNCONNER__, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION55______, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile1.FLOOR____________, FloorTile2.PARTITION53______],
            [FloorTile2.PARTITION32______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION51______, FloorTile2.PARTITION33______],
        ]
        console.log(floorMap.length);
        
        console.log(floorMap[0].length);

        const floors = worldMap.getFloors();

        for (let y = 0; y < floorMap.length; y++) {
            const line = floorMap[y];
            for (let x = 0; x < line.length; x++) {
                const tileId = line[x];

                if (tileId === FloorTile1.EMPTY____________) {
                    continue;
                }
                
                if (0 < tileId) {
                    const floor = new Floor(
                        new ImageShape({
                            width: 1,
                            height: 1,
                        }, `/assets/tileRoom3/${tileId}.png`),
                    );
                    

                    floor.setPosition({ x, y });

                    floors.push(floor);
                } else {
                    const floor = new Floor(
                        new ImageShape({
                            width: 1,
                            height: 1,
                        }, `/assets/tileRoom4/${-tileId}.png`),
                    );

                    floor.setPosition({ x, y });

                    floors.push(floor);
                }
            }
        }
    }


    {
        // <temp code>
        const physicsLineList = [];
        const {height, width} = worldMap.getSize()
        for (let i = 0; i < height; i++) {
            physicsLineList.push({x: 1, y: i, direction: Direction.left});
            physicsLineList.push({x: width - 2, y: i, direction: Direction.right});
        }
        for (let i = 0; i < width; i++) {
            physicsLineList.push({x: i, y: 4, direction: Direction.up});
            physicsLineList.push({x: i, y: height - 2, direction: Direction.down});
        } 

        const physicsLineMap = physicsLineFactory(height, height, [
            ...physicsLineList,
        ]);
        const physmap = worldMap.getPhysicsLineMap();
        for (let y = 0; y < height + 1; y++) {
            for (let x = 0; x < 2 * width + 1; x++) {
                const line = physicsLineMap[y][x];
                if (line) {
                    physmap[y][x] = line;
                }
            }
        }
        // </temp code>
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
    character.setPosition({ x: SPAWN_POS_X, y: SPAWN_POS_Y });

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
    let _renderer: Renderer;
    
    
    useEffect(() => {
        if (!user) return;
        (async function(){
            const loadedWorld = await loadWorld(worldId, globalApolloClient)
            const { world, renderer, character } = await makeTestWorld(loadedWorld);
            world.getMap().getPhysicsLineMap().push(...new Array(60).fill([]));
    
            ref.current?.appendChild(renderer.getWrapperDom());
            _renderer = renderer;
            
            renderer.disableWorldTransition();
            renderer.setCenter({ x: SPAWN_POS_X, y: SPAWN_POS_Y });
            
            controller = new KeyboardController(world.getPhysics(), renderer, renderer.getWrapperDom(), character);
            renderer.getWrapperDom().tabIndex = 0;
            renderer.getWrapperDom().focus();
            controller.getNameTagger().changeName(character, user.nickname);
            
            networkController = 
                new NetworkController(
                    renderer, 
                    world,
                    worldId,
                    user.id,
                    globalApolloClient);
            
            await joinWorld(globalApolloClient, SPAWN_POS_X, SPAWN_POS_Y, worldId);

            setTimeout(() => {
                renderer.enableWorldTransition();
                controller.afterMove = (_) => {
                    movePlayer(globalApolloClient, worldId, character.getPosition().x, character.getPosition().y);
                }
            }, 0);
        })();
        return () => {
            if (controller) controller.remove();
            if (_renderer) _renderer.remove();
        }
    }, [ref, user]);

    return (
        <Wrapper>
            <div style={{
                zIndex: 1,
                height: '100%',
                pointerEvents: 'none',
            }}>
                <IngameInterface apolloClient={globalApolloClient} />
            </div>
            <div ref={ref} style={{
                zIndex: 0,
            }}/>
        </Wrapper>
    );
}

export default WorldPage;
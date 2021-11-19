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

const SPAWN_POS_X = 20;
const SPAWN_POS_Y = 15;


async function makeTestWorld(world?: World) {
    world = world || new World({ height: 26, width: 46 });
    const worldMap = world.getMap();


    // Floor

    enum FloorTile {
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

    {
        const floorMap: FloorTile[][] = [
            [FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.EMPTY____________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.EMPTY____________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.EMPTY____________, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WINDOW1_UP_______, FloorTile.WINDOW2_UP_______, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________],
            [FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UPCONNER____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UPCONNER____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UPCONNER____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WINDOW1_DOWN_____, FloorTile.WINDOW2_DOWN_____, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________, FloorTile.WALL_UP__________],
            [FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_MIDDLECONNER, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_MIDDLECONNER, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_MIDDLECONNER, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________, FloorTile.WALL_DOWN________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.WALL_DOWNCONNER__, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.WALL_DOWNCONNER__, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.WALL_DOWNCONNER__, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
            [FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________, FloorTile.FLOOR____________],
        ]
        console.log(floorMap.length);
        
        console.log(floorMap[0].length);

        const floors = worldMap.getFloors();

        for (let y = 0; y < floorMap.length; y++) {
            const line = floorMap[y];
            for (let x = 0; x < line.length; x++) {
                const tileId = line[x];

                if (tileId === FloorTile.EMPTY____________) {
                    continue;
                }

                const floor = new Floor(
                    new ImageShape({
                        width: 1,
                        height: 1,
                    }, `/assets/tileRoom3/${tileId}.png`),
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
    let _LoadedWorld;
    
    
    useEffect(() => {
        if (!user) return;
        (async function(){
            const loadedWorld = await loadWorld(worldId, globalApolloClient)
            const { world, renderer, character } = await makeTestWorld(loadedWorld);
            world.getMap().getPhysicsLineMap().push(...new Array(60).fill([]));
    
            ref.current?.appendChild(renderer.getWrapperDom());
            
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
                    character, 
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
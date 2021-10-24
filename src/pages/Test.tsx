import React, { useState } from "react";
import Context from '../context';
import { useContext } from 'react';
import useUser from "../hooks/useUser";
import Layers from "../components/Layers";
import State from "../core/AnimationSystem/State";
import AnimationManager from "../core/AnimationSystem/AnimationManager";
import BitCanvas from "../components/BitCanvas";




enum WalkingAnime {
    stop,
    walk,
}

const WALKING_DELAY = 400;

const standing: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('stading')

        switch (manager.situration) {
            case WalkingAnime.walk:
                return walking1;
            case WalkingAnime.stop:
                await manager.stop();
                return standing;
        }
    }
})

const walking1: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('waling 1')

        switch (manager.situration) {
            case WalkingAnime.walk:
                await manager.sleep(WALKING_DELAY);
                return walking2;

            case WalkingAnime.stop:
                return standing;
        }
    }
})

const walking2: State<WalkingAnime> = new State({
    async action(manager) {
        console.log('walking 2')

        switch (manager.situration) {
            case WalkingAnime.walk:
                await manager.sleep(WALKING_DELAY);
                return walking1;

            case WalkingAnime.stop:
                return standing;
        }
    }
})

const walkAniManger = new AnimationManager(WalkingAnime.stop, standing);
walkAniManger.init();

function Test() {

    // const { jwt, setJwt } = useContext(Context);
    // const user = useUser();
    // const [token, setToken] = useState('');

    // function onSave(){
    //     setJwt(token);
    // }

    // @ts-ignore
    globalThis.debug = {
        walkAniManger,
    }


    return (
        <div className="App">
            <BitCanvas />
            <button onClick={() => {walkAniManger.setSituration(WalkingAnime.walk, true)}}>walk</button>
            <button onClick={() => {walkAniManger.setSituration(WalkingAnime.stop, true)}}>stop</button>
        </div>
    );
}

export default Test;
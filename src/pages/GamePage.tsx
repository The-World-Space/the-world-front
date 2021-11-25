import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import THREE, { Object3D } from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Game from '../game/Game';

function GamePage() {
    let game: Game | null = null;

    useEffect( () => { //on mount component
        window.addEventListener('resize', onWindowResize);
    }, [] );
    useEffect( () => () => { //on unmount component
        window.removeEventListener('resize', onWindowResize);
        game?.dispose();
    }, [] );

    function onWindowResize() {
        game?.resizeFramebuffer(window.screen.width, window.screen.height);
    }

    return (
        <div style = {{height: '100%', width: '100%'}} ref={ref => {
            if (ref !== null) {
                game = new Game(ref, window.screen.width, window.screen.height);
                game.run();
            }
        }}/>
    );
}

export default GamePage;

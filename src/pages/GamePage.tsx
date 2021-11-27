import { useEffect } from 'react';
import { TheWorldBootstrapper } from '../game/TheWorldBootstrapper';
import { Game } from '../game/engine/Game';

function GamePage() {
    let game: Game | null = null;
    let div: HTMLDivElement | null = null;

    useEffect( () => { //on mount component
        window.addEventListener('resize', onWindowResize);
    });
    useEffect( () => () => { //on unmount component
        window.removeEventListener('resize', onWindowResize);
        game?.dispose();
    });

    function onWindowResize() {
        if (div) game?.resizeFramebuffer(div.offsetWidth, div.offsetHeight);
    }

    return (
        <div style = {{height: '100%', width: '100%'}} ref={ref => {
            div = ref;
            if (ref !== null) {
                
                game = new Game(ref, ref.offsetWidth, ref.offsetHeight);
                game.run(new TheWorldBootstrapper());
            }
        }}/>
    );
}

export default GamePage;

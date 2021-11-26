import { useEffect } from 'react';
import { Game } from '../game/Game';

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

import { useEffect } from 'react';
import { NetworkBootstrapper, NetworkInfoObject } from '../game/NetworkBootstrapper';
import { Game } from '../game/engine/Game';
import { useAsync } from 'react-use';
import { getWorld, globalApolloClient } from '../game/connect/gql';

function NetworkGamePage() {
    let game: Game | null = null;
    let div: HTMLDivElement | null = null;
    let {error, loading, value: world0} = useAsync(() => getWorld('0', globalApolloClient));
    
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
            if (ref !== null && !loading && world0) {
                
                game = new Game(ref, ref.offsetWidth, ref.offsetHeight);
                game.run(NetworkBootstrapper, new NetworkInfoObject(world0, globalApolloClient));
                game.inputHandler.startHandleEvents();
            }
        }}/>
    );
}

export default NetworkGamePage;

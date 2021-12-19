import { useEffect } from 'react';
import { NetworkBootstrapper, NetworkInfoObject } from '../game/NetworkBootstrapper';
import { Game } from '../game/engine/Game';
import { useAsync } from 'react-use';
import { getWorld, globalApolloClient, joinWorld } from '../game/connect/gql';
import { Vector2 } from 'three';
import useUser from '../hooks/useUser';
import IngameInterface from "../components/organisms/IngameInterface";
import { useParams } from 'react-router-dom';

function NetworkGamePage() {
    let game: Game | null = null;
    let div: HTMLDivElement | null = null;
    const { worldId } = useParams<{worldId: string}>();
    let { loading: world_loading, value: world0 } = useAsync(() => getWorld(worldId, globalApolloClient));
    let user = useUser();
    
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
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
        }}>
            <div style={{
                zIndex: 1,
                height: '100%',
                pointerEvents: 'none',
            }}>
                <IngameInterface apolloClient={globalApolloClient} worldId={worldId} />
            </div>
            <div style = {{height: '100%', width: 'calc(100% - 130px)'}} ref={ref => {
                div = ref;
                if (ref !== null && !world_loading && world0 && user) {
                    
                    game = new Game(ref, ref.offsetWidth, ref.offsetHeight);
                    game.run(NetworkBootstrapper, new NetworkInfoObject(world0, user, globalApolloClient));
                    joinWorld(worldId, new Vector2(0, 0), globalApolloClient).then(() => {
                        game!.inputHandler.startHandleEvents();
                    })
                }
            }}/>
        </div>
    );
}

export default NetworkGamePage;

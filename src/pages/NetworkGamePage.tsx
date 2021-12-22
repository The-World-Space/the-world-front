import { useEffect } from 'react';
import { TheWorldBootstrapper, NetworkInfoObject } from '../game/TheWorldBootstrapper';
import { Game } from '../game/engine/Game';
import { useAsync } from 'react-use';
import { getWorld, globalApolloClient, joinWorld } from '../game/connect/gql';
import { Vector2 } from 'three';
import useUser from '../hooks/useUser';
import IngameInterface from "../components/organisms/IngameInterface";
import { useParams } from 'react-router-dom';
import { NetworkManager } from '../game/script/NetworkManager';
import { PenpalNetworkWrapper } from '../game/penpal/PenpalNetworkWrapper';

function NetworkGamePage() {
    let game: Game | null = null;
    let div: HTMLDivElement | null = null;
    let widgetWrapper: HTMLDivElement | null = null
    let networkManager: NetworkManager | null = null;
    let penpalNetworkWrapper: PenpalNetworkWrapper | null = null;
    const { worldId } = useParams<{worldId: string}>();
    let { loading: world_loading, value: world } = useAsync(() => getWorld(worldId, globalApolloClient));
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
            <div style = {{height: '100%', width: 'calc(100% - 130px)', zIndex: 0}}>
                <div style = {{height: '0%', width: '0%', zIndex: 1, position: 'absolute', pointerEvents: 'auto'}} ref={ref => {
                    if (ref) {
                        widgetWrapper = ref;
                    }
                }}>
                    
                </div>
                <div style = {{height: '100%', width: 'calc(100% - 130px)', zIndex: 0, position: 'absolute'}} ref={ref => {
                    div = ref;
                    if (ref !== null && widgetWrapper && !world_loading && world && user) {

                        game = new Game(ref, ref.offsetWidth, ref.offsetHeight);
                        networkManager = new NetworkManager(world.id, user.id, globalApolloClient);
                        penpalNetworkWrapper = new PenpalNetworkWrapper(world.id, globalApolloClient);

                        game.run(
                            TheWorldBootstrapper, 
                            new NetworkInfoObject(world, user, globalApolloClient, networkManager, penpalNetworkWrapper));
                        
                        joinWorld(worldId, new Vector2(0, 0), globalApolloClient).then(() => {
                            game!.inputHandler.startHandleEvents();
                        });
                    }
                }}/>
            </div>
        </div>
    );
}

export default NetworkGamePage;

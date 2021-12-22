import { useEffect, useRef } from 'react';
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
import { WidgetManager } from '../game/script/WidgetManager';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

const IngameInterfaceContainer = styled.div`
    z-index: 1;
    height: 100%;
    pointer-events: none;
`;

const GameContainer = styled.div`
    height: '100%';
    width: 'calc(100% - 130px)';
    z-index: 0;
`;

const WidgetContainer = styled.div`
    height: 100%;
    width: 'calc(100% - 130px)';
    z-index: 1;
    position: absolute;
    pointer-events: none;
    right: 0px;
`;

const WidgetWrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    pointer-events: none;
`;

const GameView = styled.div`
    height: 100%;
    width: calc(100% - 130px);
    z-index: 0;
    position: absolute;
`;

function NetworkGamePage() {
    const div = useRef<HTMLDivElement>(null);
    const widgetWrapperdiv = useRef<HTMLDivElement>(null);
    const { worldId } = useParams<{worldId: string}>();
    const { loading: world_loading, value: world } = useAsync(() => getWorld(worldId, globalApolloClient));
    const user = useUser();

    useEffect(() => { //on mount component
        if (world_loading || !world || !user) return; 
        if (!div.current) throw new Error("div is null");//
        if (!widgetWrapperdiv.current) throw new Error("widgetWrapperdiv is null");
        console.log("test");
        const game = new Game(div.current, div.current.offsetWidth, div.current.offsetHeight);
        const networkManager = new NetworkManager(world.id, user.id, globalApolloClient);
        const penpalNetworkWrapper = new PenpalNetworkWrapper(world.id, globalApolloClient);
        new WidgetManager(penpalNetworkWrapper, world, widgetWrapperdiv.current, []);
        game.run(TheWorldBootstrapper, new NetworkInfoObject(world, user, globalApolloClient, networkManager, penpalNetworkWrapper));
        joinWorld(worldId, new Vector2(0, 0), globalApolloClient).then(() => {
            game.inputHandler.startHandleEvents();
        });

        function onWindowResize() {
            if (div.current) game?.resizeFramebuffer(div.current.offsetWidth, div.current.offsetHeight);
        }

        window.addEventListener("resize", onWindowResize);
        return () => { //on unmount component
            window.removeEventListener("resize", onWindowResize);
            game?.dispose();
        };
    }, [worldId, world, user, world_loading]);

    return (
        <Container>
            <IngameInterfaceContainer>
                <IngameInterface apolloClient={globalApolloClient} worldId={worldId} />
            </IngameInterfaceContainer>
            <GameContainer>
                <WidgetContainer>
                    <WidgetWrapper ref={widgetWrapperdiv}/> 
                </WidgetContainer>
                <GameView ref={div}/>
            </GameContainer>
        </Container>
    );
}

export default NetworkGamePage;

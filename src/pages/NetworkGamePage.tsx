import { useContext, useEffect, useRef } from "react";
import { TheWorldBootstrapper, NetworkInfoObject } from "../game/TheWorldBootstrapper";
import { Game } from "../game/engine/Game";
import { useAsync } from "react-use";
import { getWorld, globalApolloClient, joinWorld } from "../game/connect/gql";
import { Vector2 } from "three";
import useUser from "../hooks/useUser";
import IngameInterface from "../components/organisms/IngameInterface";
import { useParams } from "react-router-dom";
import { Networker } from "../game/script/Networker";
import { PenpalNetworker } from "../game/penpal/PenpalNetworker";
import { WidgetManager } from "../game/script/WidgetManager";
import styled from "styled-components";
import { GameProvider } from "../context/Provider";
import { WorldEditorContext } from "../context/contexts";

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
    height: "100%";
    width: "calc(100% - 130px)";
    z-index: 0;
`;

const WidgetContainer = styled.div`
    height: 100%;
    width: "calc(100% - 130px)";
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

function NetworkGamePage(): JSX.Element {
    const div = useRef<HTMLDivElement>(null);
    const widgetWrapperdiv = useRef<HTMLDivElement>(null);
    const { worldId } = useParams<{worldId: string}>();
    const { value: world, error } = useAsync(() => getWorld(worldId, globalApolloClient));
    const { setGame, worldEditorConnector } = useContext(WorldEditorContext);
    const user = useUser();
    
    useEffect(() => { //on component mounted
        if (error) throw error;
        if (!world || !user) return; 
        if (!div.current) throw new Error("div is null");
        if (!widgetWrapperdiv.current) throw new Error("widgetWrapperdiv is null");
        const game = new Game(div.current);
        const networkManager = new Networker(world.id, user.id, globalApolloClient);
        const penpalNetworkWrapper = new PenpalNetworker(world.id, globalApolloClient);
        const widgetManager = new WidgetManager(penpalNetworkWrapper, /*world,*/ widgetWrapperdiv.current, []);
        game.run(TheWorldBootstrapper, new NetworkInfoObject(world, user, globalApolloClient, networkManager, penpalNetworkWrapper, worldEditorConnector));
        setGame(game);
        joinWorld(worldId, new Vector2(0, 0), globalApolloClient).then(() => {
            game.inputHandler.startHandleEvents();
        });
        
        return () => { //on component unmount
            game.dispose();
            widgetManager.dispose();
        };
    }, [worldId, world, user, error, setGame, worldEditorConnector]);

    return (
        <GameProvider>
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
        </GameProvider>
    );
}

export default NetworkGamePage;

import { useContext, useEffect, useRef } from "react";
import { TheWorldBootstrapper, NetworkInfoObject } from "../game/TheWorldBootstrapper";
import { Game } from "../game/engine/Game";
import { useAsync } from "react-use";
import { getWorld, globalApolloClient, joinWorld } from "../game/connect/gql";
import { Vector2 } from "three";
import useUser from "../hooks/useUser";
import IngameInterface from "../components/organisms/IngameInterface";
import { useHistory, useParams } from "react-router-dom";
import { PlayerNetworker } from "../game/script/networker/PlayerNetworker";
import { PenpalNetworker } from "../game/penpal/PenpalNetworker";
import { WidgetManager } from "../game/script/WidgetManager";
import styled from "styled-components";
import { GameProvider } from "../context/Provider";
import { WorldEditorContext } from "../context/contexts";
import { ReactComponent as TWLogo } from "../components/atoms/tw logo 1.svg";
import { gql } from "@apollo/client";
import { GameStateKind } from "../game/engine/GameState";

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

const Loading = styled.div`
    height: 100%;
    width: calc(100% - 130px);
    z-index: 0;

    position: absolute;
    display: flex;
    
    align-items: center;
    justify-content: center;
`;


const LodingLogo = styled(TWLogo)`
    transform-origin: center center;

    width: 100px;
    height: 60px;

    animation-duration: 3s;
    animation-name: spin;
    animation-iteration-count: infinite;
    animation-timing-function: linear;


    @keyframes spin {

        0% {
            transform: rotateY(0);
        }

        50% {
            transform: rotateY(3.142rad);
        }

        100% {
            transform: rotateY(2*3.142rad);
        }

    }
`;


const KICKED = gql`
    subscription kicked($worldId: String!) {
        kicked(worldId: $worldId)
    }
`;


function NetworkGamePage_(): JSX.Element {
    const history = useHistory();
    const div = useRef<HTMLDivElement>(null);
    const widgetWrapperdiv = useRef<HTMLDivElement>(null);
    const { worldId } = useParams<{worldId: string}>();
    const { value: world, error, loading } = useAsync(() => getWorld(worldId, globalApolloClient), [worldId]);
    const { setGame, worldEditorConnector, setPlayerNetworker, setWorld } = useContext(WorldEditorContext);
    const user = useUser();

    useEffect(() => { //on component mounted
        if (error) throw error;
        if (!world || !user) return; 
        if (!worldEditorConnector) return;
        if (!div.current) throw new Error("div is null");
        if (!widgetWrapperdiv.current) throw new Error("widgetWrapperdiv is null");
        setWorld(world);
        const game = new Game(div.current);
        const playerNetworker = new PlayerNetworker(world.id, user.id, globalApolloClient);
        const penpalNetworkWrapper = new PenpalNetworker(world.id, globalApolloClient);
        const widgetManager = new WidgetManager(penpalNetworkWrapper, /*world,*/ widgetWrapperdiv.current, []);
        setPlayerNetworker(playerNetworker);
        game.run(TheWorldBootstrapper, new NetworkInfoObject(world, user, globalApolloClient, playerNetworker, penpalNetworkWrapper, worldEditorConnector));
        setGame(game);
        joinWorld(worldId, new Vector2(0, 0), globalApolloClient).then(() => {
            if (game.currentGameState !== GameStateKind.Finalized)
                game.inputHandler.startHandleEvents();
        });

        globalApolloClient.subscribe({
            query: KICKED,
            variables: {
                worldId: world.id
            }
        }).subscribe(() => {
            alert("You have been kicked from the world");
            history.push("/");
        });
        
        return () => { //on component unmount
            game.dispose();
            widgetManager.dispose();
            location.reload();
        };
    }, [worldId, world, user, error, setGame, worldEditorConnector, setPlayerNetworker, setWorld, history]);

    return (
        <Container>
            <IngameInterfaceContainer>
                <IngameInterface apolloClient={globalApolloClient} worldId={worldId} />
            </IngameInterfaceContainer>
            <GameContainer>
                <WidgetContainer>
                    <WidgetWrapper ref={widgetWrapperdiv}/> 
                </WidgetContainer>
                {
                    loading && <Loading>
                        <LodingLogo />
                    </Loading>
                }
                <GameView ref={div}/>
            </GameContainer>
        </Container>
    );
}

function NetworkGamePage(): JSX.Element {
    return (
        <GameProvider>
            <NetworkGamePage_ />
        </GameProvider>
    );
}

export default NetworkGamePage;

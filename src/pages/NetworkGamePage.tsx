import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { TheWorldBootstrapper, NetworkInfoObject } from "../game/TheWorldBootstrapper";
import { Game, GameStateKind } from "the-world-engine";
import { useAsync } from "react-use";
import { getWorld, getWSApolloClient, getWSLink } from "../game/connect/gql";
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
import { ApolloClient, ApolloLink, NormalizedCacheObject } from "@apollo/client";
import { getProtoWebSocket, joinWorld, login } from "../game/connect/proto";
import { ProtoWebSocket } from "../proto/ProtoWebSocket";
import * as pb from "../proto/the_world";

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

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const WidgetContainer = styled.div`
    height: 100%;
    width: "calc(100% - 130px)";
    z-index: 1;
    position: absolute;
    pointer-events: none;
    right: 0px;

    @media (max-width: 768px) {
        width: 100%;
    }
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

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Loading = styled.div`
    height: 100%;
    width: calc(100% - 130px);
    z-index: 0;

    position: absolute;
    display: flex;
    
    align-items: center;
    justify-content: center;
    
    @media (max-width: 768px) {
        width: 100%;
    }
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

function NetworkGamePage_(): JSX.Element {
    const globalApolloClient = useGameWSApolloClient();
    const globalProtoWebSocket = useGameProtoWebSocket();
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
        const playerNetworker = new PlayerNetworker(user.id, globalProtoWebSocket);
        const penpalNetworkWrapper = new PenpalNetworker(globalApolloClient, globalProtoWebSocket);
        const widgetManager = new WidgetManager(penpalNetworkWrapper, /*world,*/ widgetWrapperdiv.current, []);
        setPlayerNetworker(playerNetworker);
        game.run(TheWorldBootstrapper, new NetworkInfoObject(world, user, globalApolloClient, playerNetworker, penpalNetworkWrapper, worldEditorConnector));
        setGame(game);

        // Initialize protoClient
        login(globalProtoWebSocket.webSocket);
        joinWorld(globalProtoWebSocket, worldId, 0, 0);

        if (game.currentGameState !== GameStateKind.Finalized)
            game.inputHandler.startHandleEvents();

        globalProtoWebSocket.on("message", serverEvent => {
            if(serverEvent.event === "kicked") {
                alert("You have been kicked from the world");
                history.push("/");
            }
        });
        
        return () => { //on component unmount
            game.dispose();
            widgetManager.dispose();
            location.reload();
        };
    }, [
        worldId,
        world, 
        user, 
        error, 
        setGame, 
        worldEditorConnector, 
        setPlayerNetworker, 
        setWorld, 
        history, 
        globalApolloClient,
        globalProtoWebSocket
    ]);

    return (
        <Container>
            <IngameInterfaceContainer>
                <IngameInterface worldId={worldId} protoWs={globalProtoWebSocket}/>
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
        <GameWSApolloClientProvider>
            <GameProtoWebSocketProvider>
                <GameProvider>
                    <NetworkGamePage_ />
                </GameProvider>
            </GameProtoWebSocketProvider>
        </GameWSApolloClientProvider>
    );
}

export default NetworkGamePage;

interface GameWSApolloClientContextType {
    wsLink: ApolloLink;
    apolloClient: ApolloClient<NormalizedCacheObject>;
}

const GameWSApolloClientContext = createContext<GameWSApolloClientContextType>({
    wsLink: {} as ApolloLink,
    apolloClient: {} as ApolloClient<NormalizedCacheObject>,
});

function GameWSApolloClientProvider({ children }: { children: JSX.Element}): JSX.Element {
    const [wsLink, apolloClient] = useMemo(() => {
        const _wslink = getWSLink();
        const _client = getWSApolloClient(_wslink);

        return [_wslink, _client];
    }, []);

    const state = {
        wsLink,
        apolloClient
    };

    useEffect(() => () => {
        wsLink.client.dispose();
    });

    return (
        <GameWSApolloClientContext.Provider value={state}>
            {children}
        </GameWSApolloClientContext.Provider>
    );
}

export function useGameWSApolloClient(): ApolloClient<NormalizedCacheObject> {
    return useContext(GameWSApolloClientContext).apolloClient;
}

export function useGameWSLink(): ApolloLink {
    return useContext(GameWSApolloClientContext).wsLink;
}

const GameProtoWebSocketContext = createContext<ProtoWebSocket<pb.ServerEvent>>({} as ProtoWebSocket<pb.ServerEvent>);
function GameProtoWebSocketProvider({ children }: { children: JSX.Element}): JSX.Element {
    const protoWebSocket = useMemo(() => {
        const protoWebSocket = getProtoWebSocket();

        return protoWebSocket;
    }, []);

    useEffect(() => () => {
        protoWebSocket.close();
    });

    return (
        <GameProtoWebSocketContext.Provider value={protoWebSocket}>
            {children}
        </GameProtoWebSocketContext.Provider>
    );
}

export function useGameProtoWebSocket(): ProtoWebSocket<pb.ServerEvent> {
    return useContext(GameProtoWebSocketContext);
}

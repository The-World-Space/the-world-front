import { gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Game } from "the-world-engine";

import { Server } from "../game/connect/types";
import { PlayerNetworker } from "../game/script/networker/PlayerNetworker";
import { ObjEditorConnector } from "../game/script/ObjEditorConnector";
import { WorldEditorConnector } from "../game/script/WorldEditorConnector";
import { useRawState } from "../hooks/StickyState";
import useUser from "../hooks/useUser";
import { useGameWSApolloClient } from "../pages/NetworkGamePage";
import { JWT_KEY } from "./consts";
import { AuthContext, ObjEditorContext, WorldEditorContext } from "./contexts";

export const Provider: React.FC = ({ children }) => {
    return (
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
    );
};

const AuthContextProvider: React.FC = ({ children }) => {
    const [jwt, setJwt] = useRawState("", JWT_KEY);
    
    const state = {
        jwt,
        logged: !!jwt,
        setJwt
    };

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
};

export const GameProvider: React.FC = ({ children }) => {
    return (
        <ObjEditorContextProvider>
            <WorldEditorContextProvider>
                {children}
            </WorldEditorContextProvider>
        </ObjEditorContextProvider>
    );
};

const ObjEditorContextProvider: React.FC = ({ children }) => {
    const [game, setGame] = useState<Game | null>(null);
    const [objEditorConnector] = useState(new ObjEditorConnector());
    
    const state = {
        game,
        setGame,
        objEditorConnector
    };

    return (
        <ObjEditorContext.Provider value={state}>
            {children}
        </ObjEditorContext.Provider>
    );
};

const WORLD_ADMIN_LIST = gql`
    subscription worldAdminList($worldId: String!) {
        worldAdminList(worldId: $worldId) {
            id
            nickname
            skinSrc
        }
    }
`;

const WorldEditorContextProvider: React.FC = ({ children }) => {
    const globalApolloClient = useGameWSApolloClient();
    const user = useUser();
    const [game, setGame] = useState<Game | null>(null);
    const [playerNetworker, setPlayerNetworker] = useState<PlayerNetworker | null>(null);
    const [playerList, setPlayerList] = useState<Server.User[]>([]);
    const [adminPlayerList, setAdminPlayerList] = useState<Server.User[]>([]);
    const [world, setWorld] = useState<Server.World | null>(null);
    const [amIadmin, setAmIadmin] = useState(false);
    const [worldEditorConnector] = useState(new WorldEditorConnector());

    const state = {
        game,
        setGame,
        playerNetworker,
        setPlayerNetworker,
        playerList,
        adminPlayerList,
        amIadmin,
        world,
        setWorld,
        worldEditorConnector
    };

    useEffect(() => {
        if (!world) return;
        if (!user) return;

        globalApolloClient.subscribe({
            query: WORLD_ADMIN_LIST,
            variables: {
                worldId: world.id
            }
        }).subscribe(res => {
            if (!res.data.worldAdminList) throw new Error("worldAdminList is null");
            setAdminPlayerList(res.data.worldAdminList);
        });

        setAdminPlayerList(world.admins);
    }, [world, user, globalApolloClient]);

    useEffect(() => {
        if (adminPlayerList.find(admin => admin.id === user?.id)) 
            setAmIadmin(true);
        else 
            setAmIadmin(false);
    }, [adminPlayerList, user]);

    useEffect(() => {
        const joinListener = (user: Server.User): void => {
            setPlayerList(playerList => playerList.concat(user));
        };
        const leaveListener = (id: Server.User["id"]): void => {
            setPlayerList(playerList => playerList.filter(user => user.id !== id));
        };
        playerNetworker?.dee.on("join", joinListener);
        playerNetworker?.dee.on("leave", leaveListener);

        return () => {
            playerNetworker?.dee.removeListener("join", joinListener);
            playerNetworker?.dee.removeListener("leave", leaveListener);
            setPlayerList([]);
        };
    }, [playerNetworker?.dee]);


    return (
        <WorldEditorContext.Provider value={state}>
            {children}
        </WorldEditorContext.Provider>
    );
};

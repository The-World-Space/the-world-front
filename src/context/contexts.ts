import { createContext } from "react";
import { Game } from "the-world-engine";

import { Server } from "../game/connect/types";
import { PlayerNetworker } from "../game/script/networker/PlayerNetworker";
import { ObjEditorConnector } from "../game/script/ObjEditorConnector";
import { WorldEditorConnector } from "../game/script/WorldEditorConnector";

interface AuthContextType {
    jwt: string;
    logged: boolean;
    setJwt: (jwt: string) => void,
}

export const AuthContext = createContext<AuthContextType>({
    jwt: "",
    logged: false,
    setJwt: _=>_
});

interface ObjEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    objEditorConnector: ObjEditorConnector;
}

export const ObjEditorContext = createContext<ObjEditorContextType>({
    game: null,
    setGame: _ => _,
    objEditorConnector: {} as ObjEditorConnector
});

interface WorldEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    playerNetworker: null | PlayerNetworker;
    setPlayerNetworker: (networkPlayerManager: null | PlayerNetworker) => void;
    playerList: Server.User[];
    adminPlayerList: Server.User[];
    world: Server.World | null;
    amIadmin: boolean;
    setWorld: (world: Server.World | null) => void;
    worldEditorConnector: WorldEditorConnector;
}

export const WorldEditorContext = createContext<WorldEditorContextType>({
    game: null,
    setGame: _ => _,
    playerNetworker: null,
    setPlayerNetworker: _ => _,
    playerList: [],
    adminPlayerList: [],
    world: null,
    setWorld: _ => _,
    amIadmin: false,
    worldEditorConnector: {} as WorldEditorConnector
});

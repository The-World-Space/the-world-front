import { createContext } from "react";
import { Server } from "../game/connect/types";
import { Game } from "../game/engine/Game";
import { PlayerNetworker } from "../game/script/networker/PlayerNetworker";
import { ObjEditorConnector } from "../game/script/ObjEditorConnector";
import { WorldEditorConnector } from "../game/script/WorldEditorConnector";

// 쉬운 타이핑 위한 함수.
// function setStateOf<T>(object: T) {
//     return (() => { }) as React.Dispatch<React.SetStateAction<T>>;
// }

interface AuthContextType {
    jwt: string;
    logged: boolean;
    setJwt: (jwt: string) => void,
}
export const AuthContext = createContext<AuthContextType>({
    jwt: "",
    logged: false,
    setJwt: _=>_,
});


interface ObjEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    objEditorConnector: ObjEditorConnector;
}
export const ObjEditorContext = createContext<ObjEditorContextType>({
    game: null,
    setGame: _ => _,
    objEditorConnector: {} as ObjEditorConnector,
});


interface WorldEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    playerNetworker: null | PlayerNetworker;
    setPlayerNetworker: (networkPlayerManager: null | PlayerNetworker) => void;
    playerList: Server.User[];
    setPlayerList: (players: Server.User[]) => void;
    world: Server.World | null;
    setWorld: (world: Server.World | null) => void;
    worldEditorConnector: WorldEditorConnector;
}
export const WorldEditorContext = createContext<WorldEditorContextType>({
    game: null,
    setGame: _ => _,
    playerNetworker: null,
    setPlayerNetworker: _ => _,
    playerList: [],
    setPlayerList: _ => _,
    world: null,
    setWorld: _ => _,
    worldEditorConnector: {} as WorldEditorConnector,
});
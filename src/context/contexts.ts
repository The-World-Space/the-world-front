import { createContext } from "react";
import { Game } from "../game/engine/Game";
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
    worldEditorConnector: WorldEditorConnector;
}
export const WorldEditorContext = createContext<WorldEditorContextType>({
    game: null,
    setGame: _ => _,
    worldEditorConnector: {} as ObjEditorConnector,
});
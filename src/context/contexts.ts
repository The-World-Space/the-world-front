import /*React,*/ { createContext } from "react";
import { Game } from "../game/engine/Game";
import { ObjEditorConnector } from "../game/script/ObjEditorConnector";
import { WorldEditorConnector } from "../game/script/WorldEditorConnector";

// 쉬운 타이핑 위한 함수.
// function setStateOf<T>(object: T) {
//     return (() => { }) as React.Dispatch<React.SetStateAction<T>>;
// }

export const AuthContext = createContext({
    jwt: "",
    logged: false,
    setJwt: (_value:string)=>{},
});


interface ObjEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    objEditorConnector: ObjEditorConnector;
}
export const ObjEditorContext = createContext<ObjEditorContextType>({
    game: null,
    setGame: _ => {},
    objEditorConnector: {} as ObjEditorConnector,
})


interface WorldEditorContextType {
    game: null | Game;
    setGame: (game: null | Game) => void;
    worldEditorConnector: WorldEditorConnector;
}
export const WorldEditorContext = createContext<WorldEditorContextType>({
    game: null,
    setGame: _ => {},
    worldEditorConnector: {} as ObjEditorConnector,
});
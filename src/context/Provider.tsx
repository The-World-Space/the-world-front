import React, { useState } from "react";
import { AuthContext, ObjEditorContext, WorldEditorContext } from "./contexts";
import { useRawState } from "../hooks/StickyState";
import { JWT_KEY } from "./consts";
import { Game } from "../game/engine/Game";
import { ObjEditorConnector } from "../game/script/ObjEditorConnector";
import { WorldEditorConnector } from "../game/script/WorldEditorConnector";

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
        setJwt,
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
        objEditorConnector,
    };

    return (
        <ObjEditorContext.Provider value={state}>
            {children}
        </ObjEditorContext.Provider>
    );
};

const WorldEditorContextProvider: React.FC = ({ children }) => {
    const [game, setGame] = useState<Game | null>(null);
    const [worldEditorConnector] = useState(new WorldEditorConnector());

    const state = {
        game,
        setGame,
        worldEditorConnector
    };

    return (
        <WorldEditorContext.Provider value={state}>
            {children}
        </WorldEditorContext.Provider>
    );
};
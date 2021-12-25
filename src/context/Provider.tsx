import React, { useState } from "react";
import { AuthContext, ObjEditorContext } from "./contexts";
import { useRawState } from "../hooks/StickyState";
import { JWT_KEY } from "./consts";
import { Game } from "../game/engine/Game";

export const Provider: React.FC = ({ children }) => {
    return (
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
    );
};


const AuthContextProvider: React.FC = ({ children }) => {
    const [jwt, setJwt] = useRawState('', JWT_KEY);
    
    const state = {
        jwt,
        logged: !!jwt,
        setJwt,
    }

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
};


export const GameProvider: React.FC = ({ children }) => {
    return (
        <ObjEditorContextProvider>
            {children}
        </ObjEditorContextProvider>
    )
}

const ObjEditorContextProvider: React.FC = ({ children }) => {
    const [game, setGame] = useState<Game | null>(null);

    const state = {
        game,
        setGame,
    }

    return (
        <ObjEditorContext.Provider value={state}>
            {children}
        </ObjEditorContext.Provider>
    );
};
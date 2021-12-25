import React from "react";
import { AuthContext } from "./contexts";
import { useRawState } from "../hooks/StickyState";
import { JWT_KEY } from "./consts";

const Provider: React.FC = ({ children }) => {
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


export default Provider;
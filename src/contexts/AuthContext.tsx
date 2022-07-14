import { createContext } from "react";
import { JWT_LOCAL_STORAGE_KEY } from "../constants/localStorage";
import { useLocalStorageRawState } from "../hooks/LocalStorageState";
import React from 'react';


interface AuthContextState {
    jwt: string | null;
    setJwt: (jwt: string) => void,
}
export const AuthContext = createContext<AuthContextState>({
    jwt: null,
    setJwt: _=>_,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [jwt, setJwt] = useLocalStorageRawState("", JWT_LOCAL_STORAGE_KEY);
    
    const state = {
        jwt,
        setJwt,
    };

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
};
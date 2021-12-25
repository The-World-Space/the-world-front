import /*React,*/ { createContext } from "react";

// 쉬운 타이핑 위한 함수.
// function setStateOf<T>(object: T) {
//     return (() => { }) as React.Dispatch<React.SetStateAction<T>>;
// }

export const AuthContext = createContext({
    jwt: '',
    logged: false,
    setJwt: (_value:string)=>{},
});

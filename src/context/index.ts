import React, { createContext } from "react";

// 쉬운 타이핑 위한 함수.
function setStateOf<T>(object: T) {
    return (() => { }) as React.Dispatch<React.SetStateAction<T>>;
}

const Context = createContext({
    jwt: '',
    logged: false,
    setJwt: (value:string)=>{},
});

export default Context;
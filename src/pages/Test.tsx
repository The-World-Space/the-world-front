import React, { useState } from "react";
import { AuthContext } from "../context/contexts";
import { useContext } from "react";
import useUser from "../hooks/useUser";

function Test() {

    const { jwt, setJwt } = useContext(AuthContext);
    const user = useUser();
    const [token, setToken] = useState("");

    function onSave(){
        setJwt(token);
    }

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <h1>USERINFO</h1>
                    <div>
                        <p>token: {jwt}</p>
                        <input type="text" onChange={e => setToken(e.target.value)} />
                    </div>
                    {
                        jwt &&
                        <>
                            <div>
                                <p>id: {user?.id}</p>
                            </div>
                            <div>
                                <p>nickname: {user?.nickname}</p>
                            </div>
                            <div>
                                <button onClick={onSave}>save</button>
                            </div>
                        </>
                    }
                </div>
            </header>
        </div>
    );
}

export default Test;
import { useCallback, useState } from "react";
import { useContext } from "react";

import { AuthContext } from "../context/contexts";
import useUser from "../hooks/useUser";

function Test(): JSX.Element {

    const { jwt, setJwt } = useContext(AuthContext);
    const user = useUser();
    const [token, setToken] = useState("");

    const onSave = useCallback(() => {
        setJwt(token);
    }, [token, setJwt]);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <h1>USERINFO</h1>
                    <div>
                        <p>token: {jwt}</p>
                        <input type="text" onChange={(e): void => setToken(e.target.value)} />
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

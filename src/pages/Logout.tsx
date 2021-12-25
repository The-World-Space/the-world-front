import { useEffect } from "react";
import {
    useHistory
} from "react-router-dom";
import { AuthContext } from "../context/contexts";
import { useContext } from "react";

function Logout(): JSX.Element {
    const history = useHistory();
    const { setJwt } = useContext(AuthContext);

    useEffect(() => {
        setJwt("");
        history.push("/");
    });

    return (
        <>
        </>
    );
}

export default Logout;
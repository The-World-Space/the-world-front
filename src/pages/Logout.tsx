import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/contexts";

function Logout(): JSX.Element {
    const apolloClient = useApolloClient();
    const history = useHistory();
    const { setJwt } = useContext(AuthContext);

    useEffect(() => {
        setJwt("");
        apolloClient.resetStore()
            .then(() => {
                history.push("/");
            });
    });

    return (
        <>
        </>
    );
}

export default Logout;

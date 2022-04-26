import { useEffect } from "react";
import {
    useNavigate
} from "react-router-dom";
import { AuthContext } from "../context/contexts";
import { useContext } from "react";
import { useApolloClient } from "@apollo/client";

function Logout(): JSX.Element {
    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const { setJwt } = useContext(AuthContext);

    useEffect(() => {
        setJwt("");
        apolloClient.resetStore()
            .then(() => {
                navigate("/");
            });
    });

    return (
        <>
        </>
    );
}

export default Logout;
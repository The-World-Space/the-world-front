import React from "react";
import { useEffect } from "react";
import {
    useHistory
} from 'react-router-dom';
import { AuthContext } from '../context/contexts';
import { useContext } from 'react';

function Logout() {
    const history = useHistory();
    const { setJwt } = useContext(AuthContext);

    useEffect(() => {
        setJwt('');
        history.push('/');
    });

    return (
        <>
        </>
    );
}

export default Logout;
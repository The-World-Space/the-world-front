import React from "react";
import { useEffect } from "react";
import {
    useHistory
} from 'react-router-dom';
import Context from '../context';
import { useContext } from 'react';

function Logout() {
    const history = useHistory();
    const { setJwt } = useContext(Context);

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
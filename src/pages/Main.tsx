import React from "react";
import Context from "../context";
import {
    Link
} from 'react-router-dom';
import { useContext } from "react";


function Main() {
    const { logged } = useContext(Context);

    return (
        <>
            <p>
                <Link to="/login">Login</Link>
            </p>
            <p>
                <Link to="/register">Register</Link>
            </p>
            {logged &&
            <>
                <p>
                    <Link to="/logout">Logout</Link>
                </p>
                <p>
                    <Link to="/todo">Todo</Link>
                </p>
            </>
            }
            <p>
                <Link to="/thelab">TheLab</Link>
            </p>
        </>
    );
}

export default Main;
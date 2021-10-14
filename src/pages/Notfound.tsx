import React from "react";
import {
    Link
} from 'react-router-dom'

function Notfound(){
    return (
        <>
            <p>404 not found</p>
            <Link to="/">to main</Link>    
        </>
    );
}

export default Notfound;
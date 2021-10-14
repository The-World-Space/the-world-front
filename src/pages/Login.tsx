import React, { useState, useContext } from "react";
import {
    useHistory
} from 'react-router-dom';
import Context from '../context';
import { gql, useApolloClient } from '@apollo/client';

const LOGIN_QUERY = gql`
    query Login($id:String!, $pw:String!){
        login(id:$id, password:$pw)
    }
`;

function Login() {
    const history = useHistory();

    const { setJwt } = useContext(Context);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const client = useApolloClient();
    
    async function onSubmit() {
        const res = await client.query({
            query: LOGIN_QUERY,
            variables:{
                id,
                pw
            }
        });

        const data = res.data;

        if(data.login){
            setJwt(data.login);
            history.push('/');
        }
        else{
            console.error('account not founded');
        }
    }

    return (
        <>
            <div>
                <label>
                    id:
                    <input onChange={e => setId(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    pw: <input onChange={e => setPw(e.target.value)} type="password" />
                </label>
            </div>
            <div>
                <button onClick={() => onSubmit()}>submit</button>
            </div>
        </>
    );
}

export default Login;

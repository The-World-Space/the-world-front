import React, { useState } from "react";
import {
    useHistory
} from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';

const REGISTER = gql`
    mutation REGISTER($id:String!, $pw:String!, $nickname:String!){
        register(id:$id, password:$pw, nickname:$nickname){
            id
            nickname
        }
    }
`;

function Register(){

    const history = useHistory();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [nickname, setNickname] = useState('');
    const client = useApolloClient();

    async function onSubmit() {
        if(pw !== confirmPw){
            alert("비밀번호가 서로 같지 않습니다!");
            return;
        }
        
        const res = await client.mutate({
            mutation: REGISTER,
            variables:{
                id,
                pw,
                nickname,
            }
        });
        const data = res.data;

        if(data.register){
            history.push('/login');
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
                    nickname:
                    <input onChange={e => setNickname(e.target.value)} />
                </label>
            </div>
            {(pw !== confirmPw && confirmPw !== '') && 
                <p>'페스워드가 서로 같지 않습니다!'</p>
            }
            <div>
                <label>
                    pw: <input onChange={e => setPw(e.target.value)} type="password" />
                </label>
            </div>
            <div>
                <label>
                    confirm: <input onChange={e => setConfirmPw(e.target.value)} type="password" />
                </label>
            </div>
            <div>
                <button onClick={() => onSubmit()}>submit</button>
            </div>
        </>
    )
}

export default Register;
import React, { useState, useContext } from "react";
import {
    useHistory
} from 'react-router-dom';
import Context from '../context';
import { gql, useApolloClient } from '@apollo/client';
import twLogo1 from '../components/atoms/tw logo 1.svg';
import NavTemplate from "../components/templates/NavTemplate";
import styled from "styled-components";
import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORM_FONT_WEIGHT } from './GlobalEnviroment';

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
`;

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
            variables: {
                id,
                pw
            }
        });

        const data = res.data;

        if (data.login) {
            setJwt(data.login);
            history.push('/');
        }
        else {
            console.error('account not founded');
        }
    }

    return (
        <NavTemplate>
            <ContentDiv>
                <div>
                    <img src={twLogo1} style={{
                        width: '350px',
                    }}/>
                </div>
                <div style={{
                    marginTop: '40px',
                    fontFamily: FORM_FONT_FAMILY,
                    fontStyle: FORM_FONT_STYLE,
                    fontWeight: FORM_FONT_WEIGHT,
                    fontSize: '32px',
                }}>
                    Login
                </div>
                <div style={{
                        borderBottom: '1px solid',
                        background: '#797979',
                        opacity: '0.6',
                        width: '300px',
                        margin: '6% 0% 6% 0%',
                    }}/>
                <div>
                    <BlackInput onChange={e => setId(e.target.value)} placeholder="ID" />
                </div>
                <div>
                    <BlackInput onChange={e => setPw(e.target.value)} type="password" placeholder="Password" />
                </div>
                <div>
                    <BlackSubmitButton onClick={() => onSubmit()}>Login</BlackSubmitButton>
                </div>
                <div style={{
                        borderBottom: '1px solid',
                        background: '#797979',
                        opacity: '0.6',
                        width: '300px',
                        margin: '8% 0% 0% 0%',
                    }}/>
                <div>
                    <BlackSubmitButton onClick={() => history.push('/register')}>Register</BlackSubmitButton>
                </div>
            </ContentDiv>
        </NavTemplate>
    );
}

export default Login;

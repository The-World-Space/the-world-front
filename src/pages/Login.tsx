import React, { useState, useContext } from "react";
import {
    useHistory,
    Link
} from 'react-router-dom';
import Context from '../context';
import { gql, useApolloClient } from '@apollo/client';
import twLogo1 from '../components/atoms/tw logo 1.svg';
import NavTemplate from "../components/templates/NavTemplate";
import styled from "styled-components";
import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORMTITLE_FONT_WEIGHT } from './GlobalEnviroment';
import HorizontalDivider from "../components/atoms/HorizontalDivider";

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
        try {
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
        } catch (e) {
            alert(e);
        }
    }

    return (
        <NavTemplate>
            <ContentDiv>
                <div>
                    <Link to="/">
                        <img src={twLogo1} alt={'logo img'} style={{
                            width: '350px',
                        }}/>
                    </Link>
                </div>
                <div style={{
                    marginTop: '40px',
                    fontFamily: FORM_FONT_FAMILY,
                    fontStyle: FORM_FONT_STYLE,
                    fontWeight: FORMTITLE_FONT_WEIGHT,
                    fontSize: '32px',
                }}> Login </div>
                <HorizontalDivider style={{ margin: '6% 0% 6% 0%' }} />
                <div> <BlackInput onChange={e => setId(e.target.value)} placeholder="ID" /> </div>
                <div> <BlackInput onChange={e => setPw(e.target.value)} type="password" placeholder="Password" /> </div>
                <div> <BlackSubmitButton onClick={() => onSubmit()}>Login</BlackSubmitButton> </div>
                <HorizontalDivider style={{ margin: '8% 0% 0% 0%' }} />
                <div> <BlackSubmitButton onClick={() => history.push('/register')}>Register</BlackSubmitButton> </div>
            </ContentDiv>
        </NavTemplate>
    );
}

export default Login;

import React, { useState } from "react";
import {
    useHistory,
    Link
} from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import NavTemplate from "../components/templates/NavTemplate";
import HorizontalDivider from "../components/atoms/HorizontalDivider";
import twLogo1 from '../components/atoms/tw logo 1.svg';
import styled from "styled-components";
import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORMTITLE_FONT_WEIGHT } from './GlobalEnviroment';

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
`;

const REGISTER = gql`
    mutation REGISTER($id:String!, $pw:String!, $nickname:String!){
        register(user: {id:$id, password:$pw, nickname:$nickname}){
            id
            nickname
        }
    }
`;

function Register() {

    const history = useHistory();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [nickname, setNickname] = useState('');
    const client = useApolloClient();

    async function onSubmit() {
        if (pw !== confirmPw) {
            alert("비밀번호가 서로 같지 않습니다!");
            return;
        }

        try {
            const res = await client.mutate({
                mutation: REGISTER,
                variables: {
                    id,
                    pw,
                    nickname,
                }
            });
            const data = res.data;

            if (data.register) {
                history.push('/login');
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
                }}> Register </div>
                <HorizontalDivider />
                <div> <BlackInput onChange={e => setNickname(e.target.value)} placeholder="Nickname" /> </div>
                <div> <BlackInput onChange={e => setId(e.target.value)} placeholder="ID" /> </div>
                <div> <BlackInput onChange={e => setPw(e.target.value)} type="password" placeholder="Password" /> </div>
                <div> <BlackInput onChange={e => setConfirmPw(e.target.value)} type="password" placeholder="Password Conform" /> </div>
                {(pw !== confirmPw && confirmPw !== '') &&
                    <p style={{color: 'red'}}>'패스워드가 서로 같지 않습니다!'</p>
                }
                <div> <BlackSubmitButton onClick={() => onSubmit()}>submit</BlackSubmitButton> </div>
                
            </ContentDiv>
        </NavTemplate>
    )
}

export default Register;
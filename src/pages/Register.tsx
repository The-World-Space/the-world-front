import { gql, useApolloClient } from "@apollo/client";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import HorizontalDivider from "../components/atoms/HorizontalDivider";
import twLogo1 from "../components/atoms/tw logo 1.svg";
import NavTemplate from "../components/templates/NavTemplate";
import { FORM_FONT_FAMILY, FORM_FONT_STYLE, FORMTITLE_FONT_WEIGHT } from "../GlobalEnviroment";

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex: 1;
`;

const REGISTER = gql`
    mutation REGISTER($id:String!, $pw:String!, $nickname:String!){
        register(user: {id:$id, password:$pw, nickname:$nickname}){
            id
            nickname
        }
    }
`;

function Register(): JSX.Element {

    const history = useHistory();

    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [nickname, setNickname] = useState("");
    const client = useApolloClient();

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === "Enter") {
            onSubmit();
        }
    }

    async function onSubmit(): Promise<void> {
        if (pw !== confirmPw) {
            alert("passwords are not same");
            return;
        }

        try {
            const res = await client.mutate({
                mutation: REGISTER,
                variables: {
                    id,
                    pw,
                    nickname
                }
            });
            const data = res.data;

            if (data.register) {
                history.push("/login");
            } else {
                console.error("account not founded");
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
                        <img src={twLogo1} alt={"logo img"} style={{
                            width: "350px"
                        }}/>
                    </Link>
                </div>
                <div style={{
                    marginTop: "40px",
                    fontFamily: FORM_FONT_FAMILY,
                    fontStyle: FORM_FONT_STYLE,
                    fontWeight: FORMTITLE_FONT_WEIGHT,
                    fontSize: "32px"
                }}> Register </div>
                <HorizontalDivider />
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setNickname(e.target.value)} placeholder="Nickname" /> </div>
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setId(e.target.value)} placeholder="ID" /> </div>
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setPw(e.target.value)} type="password" placeholder="Password" /> </div>
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setConfirmPw(e.target.value)} type="password" placeholder="Password Conform" /> </div>
                {(pw !== confirmPw && confirmPw !== "") &&
                    <p style={{color: "red"}}>&quot;Password and Password Conform are not same&quot;</p>
                }
                <div> <BlackSubmitButton onClick={(): Promise<void> => onSubmit()}>submit</BlackSubmitButton> </div>
                
            </ContentDiv>
        </NavTemplate>
    );
}

export default Register;

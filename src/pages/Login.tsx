import { gql, useApolloClient } from "@apollo/client";
import React, { useCallback, useContext, useState } from "react";
import {
    Link,
    useHistory} from "react-router-dom";
import styled from "styled-components";

import BlackInput from "../components/atoms/BlackInput";
import BlackSubmitButton from "../components/atoms/BlackSubmitButton";
import HorizontalDivider from "../components/atoms/HorizontalDivider";
import twLogo1 from "../components/atoms/tw logo 1.svg";
import NavTemplate from "../components/templates/NavTemplate";
import { AuthContext } from "../context/contexts";
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

const LOGIN_QUERY = gql`
    query Login($id:String!, $pw:String!){
        login(id:$id, password:$pw)
    }
`;

function Login(): JSX.Element {
    const history = useHistory();

    const { setJwt } = useContext(AuthContext);

    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const client = useApolloClient();

    const onSubmit = useCallback(async (): Promise<void> => {
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
                history.push("/");
            } else {
                console.error("account not founded");
            }
        } catch (e) {
            alert(e);
        }
    }, [client, history, id, pw, setJwt]);

    const onKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            onSubmit();
        }
    }, [onSubmit]);

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
                }}> Login </div>
                <HorizontalDivider style={{ margin: "6% 0% 6% 0%" }} />
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setId(e.target.value)} placeholder="ID" /> </div>
                <div> <BlackInput onKeyPress={onKeyPress} onChange={(e): void => setPw(e.target.value)} type="password" placeholder="Password" /> </div>
                <div> <BlackSubmitButton onClick={(): Promise<void> => onSubmit()}>Login</BlackSubmitButton> </div>
                <HorizontalDivider style={{ margin: "8% 0% 0% 0%" }} />
                <div> <BlackSubmitButton onClick={(): void => history.push("/register")}>Register</BlackSubmitButton> </div>
            </ContentDiv>
        </NavTemplate>
    );
}

export default Login;

import React from "react";
import Context from "../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext } from "react";
import styled from "styled-components";
import twLogo2 from '../components/atoms/tw logo 2.svg';
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_SIZE, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT } from "./GlobalEnviroment";



const TopDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-right: 10%;
    padding-left: 10%;
    padding-top: 2%;
    padding-bottom: 2%;
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const RowButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const MainButton = styled.button`
    padding: 10px;
    border: none;
    background: #A69B97;
    border-radius: 22.5px;
    margin-right: 10px;
    margin-left: 10px;
    font-family: ${MENU_BUTTON_FONT_FAMILY};
    font-style: ${MENU_BUTTON_FONT_STYLE};
    font-weight: ${MENU_BUTTON_FONT_WEIGHT};
    font-size: ${MENU_BUTTON_FONT_SIZE};
    color: #FFFFFB;
    &:hover {
        background-color: #857b78;
    }
`;


function Main() {
    const { logged } = useContext(Context);
    const history = useHistory();

    return (
        <>
            <TopDiv>
                <Link to="/">
                    <img src={twLogo2} /> 
                </Link>
                <RowButtonDiv>
                    { logged 
                        ? <Link to="/logout">Logout</Link>
                        : <>
                            <MainButton onClick={() => history.push('/login')}>Login</MainButton>
                            <MainButton onClick={() => history.push('/register')}>Register</MainButton>
                        </>}
                </RowButtonDiv>
            </TopDiv>
                
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
            <p>
                <Link to="/world/0">world/0</Link>
            </p>
        </>
    );
}

export default Main;
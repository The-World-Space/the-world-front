import React from "react";
import Context from "../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext } from "react";
import styled from "styled-components";
import twLogo1 from '../components/atoms/tw logo 1.svg';
import twLogo2 from '../components/atoms/tw logo 2.svg';
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_SIZE, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT } from "./GlobalEnviroment";


const TopDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 2% 10% 2% 10%;
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const RowButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const MainButton = styled.button`
    border-radius: 22.5px;
    margin-right: 10px;
    margin-left: 10px;
    padding: 8% 12% 8% 12%;
    font-family: ${MENU_BUTTON_FONT_FAMILY};
    font-style: ${MENU_BUTTON_FONT_STYLE};
    font-weight: ${MENU_BUTTON_FONT_WEIGHT};
    font-size: ${MENU_BUTTON_FONT_SIZE};
    border: none;
    background: #A69B97;
    color: #FFFFFB;
    &:hover {
        background-color: #857b78;
    }
`;

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #FFFFFB;
`;

const ContentDetailDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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
                        ? <MainButton onClick={() => history.push('/logout')}>Logout</MainButton>
                        : <>
                            <MainButton onClick={() => history.push('/login')}>Login</MainButton>
                            <MainButton onClick={() => history.push('/register')}>Register</MainButton>
                        </>}
                </RowButtonDiv>
            </TopDiv>
            <ContentDiv>
                <div>
                    <img src={twLogo1} />
                </div>
                <ContentDetailDiv>
                    사용자 지정 기능 확장이 가능한 2D 메타버스 서비스입니다. 탑다운 뷰로, 사용자는 원하는 사용자 지정 서비스를 바닥이나 건물로서 배치할 수 있습니다. 사용자 지정 서비스를 만드는 경우, 바닥이나 건물과의 상호작용을 원하는 대로 처리할 수 있습니다.
                    <div style={{
                        borderLeft: '1px solid #000000C0',
                        height: '100px',
                        margin: '0% 2% 0% 2%',
                    }}/>
                    <img src={`${process.env.PUBLIC_URL}/assets/takahiro.jpg`} />
                </ContentDetailDiv>
                <p>
                    <Link to="/thelab">TheLab</Link>
                </p>
                <p>
                    <Link to="/world/0">world/0</Link>
                </p>
            </ContentDiv>
        </>
    );
}

export default Main;
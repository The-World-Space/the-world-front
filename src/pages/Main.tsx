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

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

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

const AllignCenterDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
`;

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 75%;
    height: 100%;
    box-sizing: border-box;
    padding: 6% 0% 0% 0%;
`;

const ContentDetailDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Circle1 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 606px;
    height: 606px;
    left: -202px;
    top: -52px;
    background: #F5EEEB;
    filter: blur(15px);
    z-index: -1;
`;

const Circle2 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 547px;
    height: 547px;
    right: -46px;
    top: -52px;
    background: #ECE4E1;
    filter: blur(15px);
    z-index: -1;
`;

const Circle3 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 596px;
    height: 596px;
    margin-right: 75px;
    background: #DFD6D3;
    filter: blur(15px);
    z-index: -1;
`;

const Circle4 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 533px;
    height: 533px;
    left: -37px;
    bottom: -207px;
    background: #D6C9C4;
    filter: blur(15px);
    z-index: -1;
`;

const Circle5 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 326px;
    height: 326px;
    bottom: -209px;
    margin-right: 75px;
    background: #B3A7A3;
    filter: blur(15px);
    z-index: -1;
`;

const Circle6 = styled.div`
    border-radius: 50%;
    position: fixed;
    width: 566px;
    height: 566px;
    left: 923px;
    bottom: -207px;
    background: #BEB5B2;
    filter: blur(15px);
    z-index: -1;
`;

//const Circle7 = styled.div`


function Main() {
    const { logged } = useContext(Context);
    const history = useHistory();

    return (
        <MainDiv>
            <Circle1/>
            <Circle2/>
            <Circle3/>
            <Circle4/>
            <Circle5/>
            <Circle6/>
            <TopDiv>
                <Link to="/">
                    <img src={twLogo2} /> 
                </Link>
                
                <p>
                    <Link to="/thelab">TheLab</Link>
                </p>
                <p>
                    <Link to="/world/0">world/0</Link>
                </p>
                <RowButtonDiv>
                    { logged 
                        ? <MainButton onClick={() => history.push('/logout')}>Logout</MainButton>
                        : <>
                            <MainButton onClick={() => history.push('/login')}>Login</MainButton>
                            <MainButton onClick={() => history.push('/register')}>Register</MainButton>
                        </>}
                </RowButtonDiv>
            </TopDiv>
            <AllignCenterDiv>
                <ContentDiv>
                    <div>
                        <img src={twLogo1} />
                    </div>
                    <ContentDetailDiv>
                        사용자 지정 기능 확장이 가능한 2D 메타버스 서비스입니다.<br/> 탑다운 뷰로, 사용자는 원하는 사용자 지정 서비스를 바닥이나 건물로서 배치할 수 있습니다.<br/> 사용자 지정 서비스를 만드는 경우, 바닥이나 건물과의 상호작용을 원하는 대로 처리할 수 있습니다.
                        <div style={{
                            borderLeft: '1px solid #000000C0',
                            height: '110px',
                            margin: '0% 2% 0% 2%',
                        }}/>
                        <img src={`${process.env.PUBLIC_URL}/assets/takahiro.jpg`} 
                        style={{
                            borderLeft: '1px solid #000000C0',
                            height: '50%',
                            margin: '0% 2% 0% 2%',
                        }}/>
                    </ContentDetailDiv>
                </ContentDiv>
            </AllignCenterDiv>
        </MainDiv>
    );
}

export default Main;
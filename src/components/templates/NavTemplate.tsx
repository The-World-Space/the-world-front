import React from "react";
import Context from "../../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext } from "react";
import styled from "styled-components";
import twLogo1 from '../atoms/tw logo 1.svg';
import Background from "../molecules/Background";
import NavigationBar from "../organisms/NavigationBar";

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
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
    width: 85%;
    height: 100%;
    box-sizing: border-box;
    padding: 6% 0% 0% 0%;
`;

const ContentDetailDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 200px;
`;

//props that contain children
function NavTemplate(props: { children?: React.ReactNode }) {
    const { logged } = useContext(Context);
    const history = useHistory();

    return (
        <MainDiv>
            <Background/>
            <NavigationBar/>
            <AllignCenterDiv>
                {props.children}
            </AllignCenterDiv>
        </MainDiv>
    );
}

export default NavTemplate;

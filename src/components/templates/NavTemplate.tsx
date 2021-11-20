import React from "react";
import styled from "styled-components";
import Background from "../atoms/Background";
import NavigationBar from "../organisms/NavigationBar";

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
`;

const AllignCenterDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    flex: 1;
`;

interface NavTemplateProps {
    children: React.ReactNode;
    showNavContent: boolean;
}

function NavTemplate(props: NavTemplateProps) {
    return (
        <MainDiv>
            <Background/>
            <NavigationBar showNavContent={props.showNavContent}/>
            <AllignCenterDiv>
                {props.children}
            </AllignCenterDiv>
        </MainDiv>
    );
}

NavTemplate.defaultProps = {
    showNavContent: false,
};

export default NavTemplate;

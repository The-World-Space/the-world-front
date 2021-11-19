import Context from "../../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext } from "react";
import styled from "styled-components";
import twLogo2Black from '../atoms/tw logo 2 black.svg';
import VariableBtnIcon from '../atoms/VariableBtnIcon.svg';
import ChannelBtnIcon from '../atoms/ChannelBtnIcon.svg';
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_SIZE, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT } from "../../pages/GlobalEnviroment";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const SidebarDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
    width: 130px;
    height: 100%;
    background: #A69B97;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const LogoImage = styled.img`
    margin-top: 30px;
`;

const BarDivider = styled.div`
    border-bottom: 2px solid;
    background: #8D837F;
    opacity: 0.6;
    width: 30px;
    margin: 25px 0px 25px 0px;
`;

const MenuButtonImage = styled.img`
    margin: 0px 0px 10px 0px;
`;

const CountIndicatorDiv = styled.div`
    margin-top: auto;
    margin-bottom: 26px;
    border-radius: 50%;
    width: 59px;
    height: 59px;
    background: #FFFFFB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${MENU_BUTTON_FONT_FAMILY};
    font-size: 14px;
    font-style: ${MENU_BUTTON_FONT_STYLE};
    font-weight: ${MENU_BUTTON_FONT_WEIGHT};
`;

const ExpandBarDiv = styled.div`
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    width: 350px;
    height: 100%;
`;

function IngameInterface() {
    return (
        <OuterDiv>
            <SidebarDiv>
                <LogoImage src={twLogo2Black} />
                <BarDivider/>
                <MenuButtonImage src={VariableBtnIcon} />
                <MenuButtonImage src={ChannelBtnIcon} />
                <CountIndicatorDiv>5/10</CountIndicatorDiv>
            </SidebarDiv>
            <ExpandBarDiv/>
        </OuterDiv>
    );
}

export default IngameInterface;

import Context from "../../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext, useState } from "react";
import styled from "styled-components";
import twLogo2Black from '../atoms/tw logo 2 black.svg';
import VariableBtnIcon from '../atoms/VariableBtnIcon.svg';
import ChannelBtnIcon from '../atoms/ChannelBtnIcon.svg';
import ArrowIcon from '../atoms/ArrowIcon.svg';
import TrashcanIcon from '../atoms/TrashcanIcon.svg';
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT } from "../../pages/GlobalEnviroment";

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
    z-index: 1;
`;

const LogoImage = styled.img`
    margin-top: 30px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
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
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
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
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const ExpandBarDiv = styled.div`
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    width: 350px;
    height: 100%;
    position: relative;
    right: 0px;
    transition: right 0.5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ListContainer = styled.ol`
    display: flex;
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
`;

const ListItem = styled.li`
    background: #A69B97;
    border-radius: 23px;
    display: flex;
    width: 90%;
    height: 60px;
    margin-top: 20px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const ListItemInner = styled.div`
    background: #FFFFFE;
    border-radius: 23px;
    display: flex;
    width: 100%;
    height: 100%;
    margin: 7px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const ExpandButton = styled.button`
    background: url(${ArrowIcon}) no-repeat;
    border: none;
    width: 44px;
    height: 44px;
    bottom: 18px;
    left: 150px;
    position: absolute;
    transition: transform 0.5s;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
`;

const TrashCanButton = styled.button`
    background: url(${TrashcanIcon}) no-repeat;
    border: none;
    width: 47px;
    height: 47px;
    margin-left: auto;
    margin-right: 18px;
    margin-bottom: 18px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
`;

function IngameInterface() {
    const [barOpened, setBarOpened] = useState(false);

    function expandBarToggle() {
        setBarOpened((lastState) => !lastState);
    }

    return (
        <OuterDiv>
            <SidebarDiv>
                <Link to="/">
                    <LogoImage src={twLogo2Black} />
                </Link>
                <BarDivider/>
                <MenuButtonImage src={VariableBtnIcon} />
                <MenuButtonImage src={ChannelBtnIcon} />
                <CountIndicatorDiv>5/10</CountIndicatorDiv>
            </SidebarDiv>
            <ExpandBarDiv style={barOpened ? {} : {right: '350px'}}>
                <ListContainer>
                    <ListItem>
                        <ListItemInner/>
                    </ListItem>
                    <ListItem>
                        <ListItemInner/>
                    </ListItem>
                </ListContainer>
                <TrashCanButton/>
            </ExpandBarDiv>
            <ExpandButton onClick={() => expandBarToggle()} 
            style={barOpened ? {} : {transform: 'rotate(180deg)'}}/>
        </OuterDiv>
    );
}

export default IngameInterface;

import { useContext } from "react";
import {
    Link, useHistory
} from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../context/contexts";
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_SIZE, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT } from "../../GlobalEnviroment";
import twLogo2 from "../atoms/tw logo 2.svg";

const NaviDiv = styled.div`
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
    justify-content: flex-end;
    align-items: center;
    width: 100%;
`;

const MainButton = styled.button`
    border-radius: 22.5px;
    margin-right: 10px;
    margin-left: 10px;
    padding: 10px 18px 10px 18px;
    font-family: ${MENU_BUTTON_FONT_FAMILY};
    font-style: ${MENU_BUTTON_FONT_STYLE};
    font-weight: ${MENU_BUTTON_FONT_WEIGHT};
    font-size: ${MENU_BUTTON_FONT_SIZE};
    border: none;
    background: #FFFFFE;
    &:hover {
        background-color: #e7e7e5;
    }
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

interface NavigationBarProps {
    showNavContent: boolean;
}

function NavigationBar(props: NavigationBarProps): JSX.Element {
    const { logged } = useContext(AuthContext);
    const history = useHistory();

    return (
        <NaviDiv>
            <Link to="/">
                <img src={twLogo2} alt={"logo img"}/> 
            </Link>
            {props.showNavContent &&
                <RowButtonDiv>
                    { logged 
                        ? <>
                            <MainButton onClick={(): void => history.push("/user")}>user info</MainButton>
                            {/* <MainButton onClick={(): void => history.push("/world/0")}>world/0</MainButton> */}
                            { localStorage.getItem("forceBlockLogout")
                                ? <></>
                                : <MainButton onClick={(): void => history.push("/logout")}>Logout</MainButton> }
                        </>
                        : <>
                            <MainButton onClick={(): void => history.push("/login")}>Login</MainButton>
                            <MainButton onClick={(): void => history.push("/register")}>Register</MainButton>
                        </>}
                </RowButtonDiv>
            }
        </NaviDiv>
    );
}

NavigationBar.defaultProps = {
    showNavContent: false
};

export default NavigationBar;

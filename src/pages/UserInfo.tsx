import styled from "styled-components";
import NavTemplate from "../components/templates/NavTemplate";
import { FORM_FONT_FAMILY } from "./GlobalEnviroment";

const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    margin-top: 60px;
`;

function UserInfo(): JSX.Element {
    return (
        <NavTemplate showNavContent={true}>
            <ContentDiv>
                <div style={{ width: "80%", fontSize: "32px", fontFamily: FORM_FONT_FAMILY }}>
                    User Infomation
                </div>
                <div style={{ borderBottom: "2px solid #000000C0", width: "100%", margin: "20px 0px" }} />
                <div style={{
                    height: "350px",
                    width: "80%",
                    margin: "0% 2% 0% 2%",
                    borderRadius: "35px",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div style={{
                        borderLeft: "1px solid #000000C0",
                        height: "100%",
                        margin: "0% 2% 0% 2%",
                    }}/>
                </div>
            </ContentDiv>
        </NavTemplate>
    );
}

export default UserInfo;

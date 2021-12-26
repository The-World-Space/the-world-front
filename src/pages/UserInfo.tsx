import styled from "styled-components";
import NavTemplate from "../components/templates/NavTemplate";
import { FORM_FONT_FAMILY } from "./GlobalEnviroment";
import accountIcon from "../components/atoms/AccountIcon.svg";
import skinUploadIcon from "../components/atoms/SkinUploadButtonIcon.svg";

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

const UserInfoamtionTextDiv = styled.div`
    width: 80%;
    font-size: 32px;
    font-family: ${FORM_FONT_FAMILY};
`;

const SeparatorDiv = styled.div`
    border-bottom: 2px solid #000000C0;
    width: 100%;
    margin: 20px 0px;
`;

const UserInfoCardDiv = styled.div`
    height: 350px;
    width: 100%;
    max-width: 1100px;
    margin: 0% 2% 0% 2%;
    border-radius: 35px;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`;

const CardLeftDiv = styled.div`
    width: 35%;
    height: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const CardSeparatorDiv = styled.div`
    border-left: 1px solid #000000C0;
    height: 100%;
    margin: 0% -8% 0% -8%;
`;

const CardRightDiv = styled.div`
    width: 35%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-family: ${FORM_FONT_FAMILY}
`;

const AccountIconImg = styled.img`
    height: 60%;
    margin-right: 50px;
`;

const UserIdTextDiv = styled.div`
    font-size: 24px;
    font-family: ${FORM_FONT_FAMILY};
    margin-bottom: 15px;
`;

const ChangePasswordButton = styled.button`
    border: none;
    border-radius: 63px;
    background-color: #DD7A7A;
    color: white;
    padding: 5px 15px;
    font-size: 16px;
    font-family: ${FORM_FONT_FAMILY};

    &:active {
        background-color: #b65e5e;
    }
`;

const SkinDiv = styled.div`
    position: relative;
    width: 60%;
    height: 90%;
    background-color: #C4C4C4;
    border-radius: 40px;
    overflow: hidden;
`;

const SkinImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const SkinDiv2 = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: #000000;
    opacity: 0;

    transition: opacity 0.5s;

    &:hover {
        opacity: 0.5;
    }
`;

const SkinUploadButton = styled.button`
    border: none;
    position: absolute;
    background: url(${skinUploadIcon});
    width: 44px;
    height: 44px;
`;

function UserInfo(): JSX.Element {
    return (
        <NavTemplate showNavContent={true}>
            <ContentDiv>
                <UserInfoamtionTextDiv>
                    User Infomation
                </UserInfoamtionTextDiv>
                <SeparatorDiv/>
                <UserInfoCardDiv>
                    <CardLeftDiv>
                        <AccountIconImg src={accountIcon} alt={"account icon"}/>
                        <div>
                            <UserIdTextDiv>
                                ID: user1
                            </UserIdTextDiv>
                            <ChangePasswordButton>
                                Change Password
                            </ChangePasswordButton>
                        </div>
                    </CardLeftDiv>
                    <CardSeparatorDiv/>
                    <CardRightDiv>
                        <SkinDiv>
                            <SkinImg src={"assets/tilemap/3_tile.png"} alt={"account icon"}/>
                            <SkinDiv2>
                                <SkinUploadButton/>
                            </SkinDiv2>
                        </SkinDiv>
                        Current skin
                    </CardRightDiv>
                </UserInfoCardDiv>
            </ContentDiv>
        </NavTemplate>
    );
}

export default UserInfo;

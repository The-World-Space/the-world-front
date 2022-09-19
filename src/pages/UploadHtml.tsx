import { gql, useMutation } from "@apollo/client";
import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import skinUploadIcon from "../components/atoms/SkinUploadButtonIcon.svg";
import NavTemplate from "../components/templates/NavTemplate";
import { globalFileApolloClient } from "../game/connect/files";
import { FORM_FONT_FAMILY } from "../GlobalEnviroment";

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

const CardRightDiv = styled.div`
    width: 35%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-family: ${FORM_FONT_FAMILY};
`;

// const ChangePasswordButton = styled.button`
//     border: none;
//     border-radius: 63px;
//     background-color: #DD7A7A;
//     color: white;
//     padding: 5px 15px;
//     font-size: 16px;
//     font-family: ${FORM_FONT_FAMILY};

//     &:active {
//         background-color: #b65e5e;
//     }
// `;

const SkinDiv = styled.div`
    position: relative;
    width: 60%;
    height: 90%;
    background-color: #C4C4C4;
    border-radius: 40px;
    overflow: hidden;
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

    background-color: #00000050;
    opacity: 1;

    transition: opacity 0.5s;

    :hover {
        cursor: pointer;
    }
`;

const SkinUploadButton = styled.button`
    border: none;
    position: absolute;
    background: url(${skinUploadIcon});
    width: 44px;
    height: 44px;

    :hover {
        cursor: pointer;
    }
`;

const UPLOAD_HTML = gql`
    mutation uploadIframeAssetText($text: String!) {
        uploadIframeAssetText(iframe: $text) {
            filename
        }
    }
`;

function UploadHtml(): JSX.Element {
    const [uploadHtml] = useMutation(UPLOAD_HTML, {
        client: globalFileApolloClient
    });
    const inputFile = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState("");

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.validity.valid || !e.target.files || e.target.files.length < 1) return;
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onload = async (): Promise<void> => {
            const text = reader.result as string;
            const res = await uploadHtml({
                variables: {
                    text
                }
            });
            const filename = res.data.uploadIframeAssetText.filename as string;
            const fileUrl = `https://asset.the-world.space/iframe/${filename}`;
            setUrl(fileUrl);
        };
        reader.readAsText(file);
    }, [uploadHtml]);

    const onSkinUploadButtonClick = useCallback(() => {
        inputFile.current?.click();
    }, []);

    return (
        <NavTemplate showNavContent={true}>
            <ContentDiv>
                <UserInfoamtionTextDiv>
                    HTML Upload
                </UserInfoamtionTextDiv>
                <SeparatorDiv/>
                <UserInfoCardDiv>
                    <CardRightDiv>
                        <SkinDiv onClick={onSkinUploadButtonClick}>
                            <SkinDiv2>
                                <SkinUploadButton/>
                            </SkinDiv2>
                        </SkinDiv>
                        {url 
                            ? <>
                                <p>Your HTML is uploaded. url is: {url}</p>
                            </>
                            : "Upload your html file"}
                    </CardRightDiv>
                </UserInfoCardDiv>
            </ContentDiv>
            <input type="file" id="file" accept=".html, text/*" ref={inputFile} style={{display: "none"}} onChange={onFileChange} />
        </NavTemplate>
    );
}

export default UploadHtml;

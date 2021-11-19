import Context from "../../context";
import {
    Link, useHistory
} from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import twLogo2Black from '../atoms/tw logo 2 black.svg';
import VariableBtnIcon from '../atoms/VariableBtnIcon.svg';
import ChannelBtnIcon from '../atoms/ChannelBtnIcon.svg';
import ArrowIcon from '../atoms/ArrowIcon.svg';
import TrashcanIcon from '../atoms/TrashcanIcon.svg';
import ChatIcon from '../atoms/ChatIcon.svg';
import SendButtonIcon from '../atoms/SendButtonIcon.svg';
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT, FORM_FONT_SIZE, FORM_FONT_FAMILY, FORM_FONT_STYLE, FORM_FONT_WEIGHT } from "../../pages/GlobalEnviroment";
import { ApolloClient, FetchResult, gql } from "@apollo/client";
import { useParams } from "react-router";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
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
    pointer-events: all;
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
    pointer-events: all;
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
    padding: 7px;
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
    pointer-events: all;
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

const ChatButton = styled.button`
    background: url(${ChatIcon}) no-repeat;
    border: none;
    width: 47px;
    height: 47px;
    position: absolute;
    right: 18px;
    bottom: 18px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
    pointer-events: all;
`;

const ChatDiv = styled.div`
    background: rgba(122, 143, 221, 0.6);
    border-radius: 23px;
    width: 319px;
    height: 441px;
    position: fixed;
    right: 20px;
    bottom: 80px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
    display: flex;
    flex-direction: column;
    transition: transform 0.5s;
    pointer-events: all;
`;

const ChatContentDiv = styled.div`
    background: rgba(255, 255, 251, 0.6);
    border-radius: 20px;
    height: 100%;
    margin: 15px;
    overflow-y: scroll;

    & > p {
        padding-left: 20px;
        margin: 0;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    
    font-size: ${FORM_FONT_SIZE};
    font-weight: ${FORM_FONT_WEIGHT};
    font-family: ${FORM_FONT_FAMILY};
    font-style: ${FORM_FONT_STYLE};
`;

const ChatInputDiv = styled.div`
    background: rgba(255, 255, 251, 0.6);
    border-radius: 20px;
    height: 50px;
    margin: 15px;
    margin-top: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const ChatInput = styled.input`
    background: #00000000;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    margin-left: 15px;
    margin-right: 5px;
    font-size: ${FORM_FONT_SIZE};
    font-weight: ${FORM_FONT_WEIGHT};
    font-family: ${FORM_FONT_FAMILY};
    font-style: ${FORM_FONT_STYLE};
    display: block;
`;

const SendButton = styled.button`
    background: url(${SendButtonIcon}) no-repeat;
    border: none;
    width: 18px;
    height: 18px;
    margin-left: auto;
    margin-right: 15px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
`;



function sendChat(worldId: string, message: string, apolloClient: ApolloClient<any>) {
    return apolloClient.mutate({
        mutation: gql`
            mutation Chat($worldId: String!, $message: String!) {
                sendChat(worldId: $worldId, message: $message)
            }
        `,
        variables: {
            worldId,
            message,
        }
    });
}


interface chatMessage {
    user: {
        id: string;
        nickname: string;
    };
    message: string;
}
function onChat(worldId: string, callback: (data: chatMessage) => void, apolloClient: ApolloClient<any>) {
    return apolloClient.subscribe({
        query: gql`
            subscription Chat($worldId: String!) {
                chat(worldId: $worldId) {
                    user {
                        id
                        nickname
                    }
                    message
                }
            }
        `,
        variables: {
            worldId,
        }
    }).subscribe(data => {
        data.data.chat && callback(data.data.chat as chatMessage);
    });
}



interface PropsType {
    apolloClient: ApolloClient<any>
}

function IngameInterface({ apolloClient }: PropsType) {
    const { worldId } = useParams<{worldId: string}>();
    const [barOpened, setBarOpened] = useState(false);
    const [chatOpened, setChatOpened] = useState(false);
    const [inputText, setInputText] = useState('');
    const [chatting, setChatting] = useState<chatMessage[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    function expandBarToggle() {
        setBarOpened((lastState) => !lastState);
    }

    function chatToggle() {
        setChatOpened((lastState) => !lastState);
    }

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter' && inputText !== '') {
            sendChatMessage();
        }
    }

    function sendChatMessage() {
        sendChat(worldId, inputText, apolloClient);
        setInputText('');
    }

    useEffect(() => {
        onChat(worldId, data => {
            setChatting(
                lastState => 
                    lastState.length > 100 
                      ? [...lastState.slice(1), data] 
                      : [...lastState, data]);
            if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
        }, apolloClient);
    }, [])

    return (
        <OuterDiv>
            <SidebarDiv>
                <span onClick={() => window.location.href = '/'}>
                    <LogoImage src={twLogo2Black} />
                </span>
                {/* <BarDivider/>
                <MenuButtonImage src={VariableBtnIcon} />
                <MenuButtonImage src={ChannelBtnIcon} />
                <CountIndicatorDiv>5/10</CountIndicatorDiv> */}
            </SidebarDiv>
            <ExpandBarDiv style={barOpened ? {} : {right: '350px'}}>
                <ListContainer>
                    <ListItem>
                        <ListItemInner>
                            여기는 아직 작성중 입니다!!!
                        </ListItemInner>
                    </ListItem>
                    {/* <ListItem>
                        <ListItemInner/>
                    </ListItem> */}
                </ListContainer>
                <TrashCanButton/>
            </ExpandBarDiv>
            <ExpandButton onClick={() => expandBarToggle()} 
            style={barOpened ? {} : {transform: 'rotate(180deg)'}}/>
            <ChatButton onClick={() => chatToggle()}/>
            <ChatDiv style={chatOpened ? {} : {transform: 'translateX(339px)'}}>
                <ChatContentDiv ref={ref}>
                    {chatting.map((data, index) => (
                        <p key={data.message}>
                            {data.user.nickname}: {data.message}
                        </p>
                    ))}
                </ChatContentDiv>
                <ChatInputDiv>
                    <ChatInput 
                        placeholder="Enter message here." 
                        value={inputText} 
                        onKeyPress={(event) => onKeyPress(event)} 
                        onChange={e => setInputText(e.currentTarget.value)}/>
                    <SendButton onClick={() => sendChatMessage()}/>
                </ChatInputDiv>
            </ChatDiv>
        </OuterDiv>
    );
}

export default IngameInterface;

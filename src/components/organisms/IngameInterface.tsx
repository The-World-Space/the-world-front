import {
    Link,
} from "react-router-dom";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import twLogo2Black from "../atoms/tw logo 2 black.svg";
import ArrowIcon from "../atoms/ArrowIcon.svg";
import ChatIcon from "../atoms/ChatIcon.svg";
import SendButtonIcon from "../atoms/SendButtonIcon.svg";
import {ReactComponent as PeopleIcon} from "../atoms/PeopleIcon.svg";
import { MENU_BUTTON_FONT_FAMILY, MENU_BUTTON_FONT_STYLE, MENU_BUTTON_FONT_WEIGHT, FORM_FONT_SIZE, FORM_FONT_FAMILY, FORM_FONT_STYLE, FORM_FONT_WEIGHT } from "../../GlobalEnviroment";
import { FANCY_SCROLLBAR_CSS } from "./EditorInner/FieldEditorInner";
import { gql, useMutation } from "@apollo/client";
import ObjectEditorInner from "./EditorInner/ObjectEditorInner";
import FieldEditorInner from "./EditorInner/FieldEditorInner";
import BroadcasterEditorInner from "./EditorInner/BroadcasterEditorInner";
import WorldEditorInner from "./EditorInner/WorldEditorInner";
import AtlasEditorInner from "./EditorInner/AtlasEditorInner";
import { WorldEditorContext } from "../../context/contexts";
import useUser from "../../hooks/useUser";
import IframeEditorInner from "./EditorInner/IframeEditorInner";
import { Server } from "../../game/connect/types";
import { ProtoWebSocket } from "../../proto/ProtoWebSocket";
import * as pb from "../../proto/the_world";

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

    -webkit-user-select:none; 
    -moz-user-select:none; 
    -ms-user-select:none; 
    user-select:none;
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

const LittleDivider = styled(BarDivider)`
    margin: 0px 0px 10px 0px;
`;

const MenuButton = styled.div<{selected: boolean}>`
    width: 85px;
    height: 36px;

    box-sizing: border-box;

    margin: 0px 0px 10px 0px;
    
    border-radius: 66px;
    border: 4px ${p => p.selected ? "#FFFFFB" : "#2E2E2E"} solid;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #FFFFFF;

    background-color: #2E2E2E;

    font-family: "Noto Sans";
    font-size: 22px;

    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    line-height: 16px;

    transition: border 200ms;

    :hover {
        cursor: pointer;
    }
`;

const CountIndicatorDiv = styled.div`
    margin-top: auto;
    margin-bottom: 26px;
    border-radius: 50%;
    padding: 10px;
    box-sizing: border-box;
    width: 59px;
    height: 59px;
    background: #FFFFFB;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-family: ${MENU_BUTTON_FONT_FAMILY};
    font-size: 14px;
    font-style: ${MENU_BUTTON_FONT_STYLE};
    font-weight: ${MENU_BUTTON_FONT_WEIGHT};
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
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

    :hover {
        cursor: pointer;
    }
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

    :hover {
        cursor: pointer;
    }
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

        overflow-wrap: break-word;
    }
    
    font-size: ${FORM_FONT_SIZE};
    font-weight: ${FORM_FONT_WEIGHT};
    font-family: ${FORM_FONT_FAMILY};
    font-style: ${FORM_FONT_STYLE};

    ${FANCY_SCROLLBAR_CSS}
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

    :hover {
        cursor: pointer;
    }
`;



function sendChat(message: string, protoWs: ProtoWebSocket<pb.ServerEvent>) {
    protoWs.send(new pb.ClientEvent({
        sendChat: new pb.SendChat({
            message
        })
    }));
}


interface chatMessage {
    user: {
        id: string;
        nickname: string;
    };
    message: string;
}
function onChat(callback: (data: chatMessage) => void, protoWs: ProtoWebSocket<pb.ServerEvent>) {
    [callback, protoWs];
    protoWs.on("message", serverEvent => {
        if(serverEvent.event === "chatAdded") {
            const chat = serverEvent.chatAdded;
            callback({
                message: chat.message,
                user: {
                    id: chat.user.id,
                    nickname: chat.user.nickname
                }
            });
        }
    });
}

enum Editor {
    Field,
    Broadcaster,
    World,
    Atlas,
    Object,
    Iframe
}

interface PropsType {
    protoWs: ProtoWebSocket<pb.ServerEvent>;
    worldId: string;
}

function IngameInterface({ protoWs, worldId }: PropsType): JSX.Element {
    const { playerNetworker } = useContext(WorldEditorContext);
    const { world, playerList, amIadmin } = useContext(WorldEditorContext);
    const [barOpened, setBarOpened] = useState(false);
    const [selectedEditor, setSelectedEditor] = useState(Editor.Field);
    const [chatOpened, setChatOpened] = useState(false);
    const [inputText, setInputText] = useState("");
    const [chatting, setChatting] = useState<(chatMessage & {key: number})[]>([]);
    const previledge = useMemo(() => amIadmin || !!world?.amIOwner, [amIadmin, world]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setBarOpened(barOpened && previledge);
    }, [barOpened, previledge]);

    function expandBarToggle() {
        setBarOpened((lastState) => !lastState);
    }

    function chatToggle() {
        setChatOpened((lastState) => !lastState);
    }

    function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" && inputText !== "") {
            sendChatMessage();
        }
    }

    function sendChatMessage() {
        sendChat(inputText, protoWs);
        setInputText("");
    }

    useEffect(() => {
        if (!worldId) return;
        if (!playerNetworker) return;

        onChat(data => {
            playerNetworker.showNetworkPlayerChat(data.user.id, data.message);

            setChatting(
                lastState => 
                    lastState.length > 100 
                        ? [...lastState.slice(1), {...data, key: performance.now()}] 
                        : [...lastState, {...data, key: performance.now()}]);
            if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
        }, protoWs);
    }, [protoWs, worldId, playerNetworker]);

    const onMenuSelect = useCallback((editor: Editor) => {
        setBarOpened(b => editor === selectedEditor ? !b : true);
        setSelectedEditor(editor);
    }, [selectedEditor]);

    const [popupOpened, setPopupOpened] = useState(false);
    const onPeopleCountClick = useCallback(() => {
        setPopupOpened(p => !p);
    }, []);

    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    return (
        <>
            <PlayerListPopup opened={popupOpened} worldId={worldId} />
            <OuterDiv>
                <SidebarDiv>
                    <Link to="/">
                        <LogoImage src={twLogo2Black} />
                    </Link>
                    { (amIadmin || world?.amIOwner) &&
                        <>
                            <BarDivider/>
                            <MenuButton selected={barOpened && selectedEditor === Editor.Object} onClick={() => onMenuSelect(Editor.Object)}>OBJ</MenuButton>
                            <MenuButton selected={barOpened && selectedEditor === Editor.Atlas} onClick={() => onMenuSelect(Editor.Atlas)}>ATL</MenuButton>
                            <LittleDivider/>
                            <MenuButton selected={barOpened && selectedEditor === Editor.World} onClick={() => onMenuSelect(Editor.World)}>EDIT</MenuButton>
                            <LittleDivider/>
                            <MenuButton selected={barOpened && selectedEditor === Editor.Field} onClick={() => onMenuSelect(Editor.Field)}>VAR</MenuButton>
                            <MenuButton selected={barOpened && selectedEditor === Editor.Broadcaster} onClick={() => onMenuSelect(Editor.Broadcaster)}>CH</MenuButton>
                            <MenuButton selected={barOpened && selectedEditor === Editor.Iframe} onClick={() => onMenuSelect(Editor.Iframe)}>PORT</MenuButton>
                        </>
                    }
                    <CountIndicatorDiv onClick={onPeopleCountClick}>
                        <PeopleIcon style={{marginTop: "10px"}} /> 
                        {playerList?.length + 1}
                    </CountIndicatorDiv>
                </SidebarDiv>
                <>
                    <FieldEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.Field}/>
                    <BroadcasterEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.Broadcaster}/>
                    <ObjectEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.Object} />
                    <AtlasEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.Atlas} />
                    <WorldEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.World}/>
                    <IframeEditorInner worldId={worldId} opened={barOpened && selectedEditor === Editor.Iframe}/>
                </>
                { (amIadmin || world?.amIOwner) &&
                    <ExpandButton onClick={() => expandBarToggle()} 
                        style={barOpened ? {} : {transform: "rotate(180deg)"}}/>
                }
                <ChatButton onClick={() => chatToggle()}/>
                <ChatDiv style={chatOpened ? {} : {transform: "translateX(339px)"}}>
                    <ChatContentDiv ref={ref}>
                        {chatting.map((data/*, index*/) => (
                            <p key={data.key}>
                                {data.user.nickname}: {data.message}
                            </p>
                        ))}
                    </ChatContentDiv>
                    <ChatInputDiv>
                        <ChatInput 
                            placeholder="Enter message here." 
                            value={inputText} 
                            onKeyPress={(event) => onKeyPress(event)} 
                            onChange={e => setInputText(e.currentTarget.value.substring(0, 1000))}
                            onFocus={onFocus}
                            onBlur={onBlur}/>
                        <SendButton onClick={() => sendChatMessage()}/>
                    </ChatInputDiv>
                </ChatDiv>
            </OuterDiv>
        </>
    );
}

export default IngameInterface;


const PopupDiv = styled.div<{opened: boolean}>`
    width: 80%;
    height: 300px;
    max-width: 700px;
    
    position: fixed;
    z-index: 10;
    left: 50%;
    top: ${p => p.opened ? "50%" : "100%"};

    box-sizing: border-box;
    padding: 30px;

    overflow-x: auto;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    transform: ${p => p.opened ? "translate(-50%, -50%)" : "translate(-50%, 0)"};

    background: #FFFFFFDD;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    border-radius: 38px;

    pointer-events: auto;

    transition: all 0.3s ease-in-out;
`;

interface PopupProps {
    opened: boolean;
    worldId: string;
}

const ADD_WORLD_ADMIN = gql`
    mutation addWorldAdmin($userId: String!, $worldId: String!) {
        addWorldAdmin(userId: $userId, worldId: $worldId) {
            id
        }
    }
`;

const REMOVE_WORLD_ADMIN = gql`
    mutation removeWorldAdmin($userId: String!, $worldId: String!) {
        removeWorldAdmin(userId: $userId, worldId: $worldId) {
            id
        }
    }
`;

const    PlayerListPopup = React.memo(PlayerListPopup_);
function PlayerListPopup_({ opened/*, worldId*/}: PopupProps) {
    const { playerList, world, adminPlayerList } = useContext(WorldEditorContext);
    const [addWorldAdmin] = useMutation(ADD_WORLD_ADMIN);
    const [removeWorldAdmin] = useMutation(REMOVE_WORLD_ADMIN);
    const adminSet = useMemo(() => new Set(adminPlayerList.map(a => a.id)), [adminPlayerList]);
    const user = useUser();

    const onSelect = useCallback((player: Server.User, admin: boolean) => {
        if (!world) return;
        if (admin) {
            addWorldAdmin({
                variables: {
                    userId: player.id,
                    worldId: world.id
                }
            });
        }
        else {
            removeWorldAdmin({
                variables: {
                    userId: player.id,
                    worldId: world.id
                }
            });
        }
    }, [addWorldAdmin, world, removeWorldAdmin]);

    return (
        <PopupDiv opened={opened}>
            {
                world?.amIOwner &&
                <span style={{fontWeight: 900, fontFamily: "Noto Sans"}}>Select Admin</span>
            }
            <p style={{marginLeft: world?.amIOwner ? "20px" : "0px"}}>
                {user?.nickname}
            </p>
            {playerList.map(player => (
                <div style={{display: "flex", alignItems: "center"}} key={player.id}>
                    {
                        world?.amIOwner && 
                            <input type="checkbox" defaultChecked={adminSet.has(player.id)} onChange={e => onSelect(player, e.target.checked)} />
                    }
                    <p>
                        {player.nickname}
                    </p>
                </div>
            ))}
            {playerList.length === 0 && <p>No players online.</p>}
        </PopupDiv>
    );
}
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import TileEditor from "../../molecules/TileEditor";
import { ReactComponent as PenTool } from '../../atoms/PenTool.svg';
import { ReactComponent as EraseTool } from '../../atoms/EraseTool.svg';
import { ReactComponent as ColliderTool } from '../../atoms/ColliderTool.svg';
import { ReactComponent as ImageTool } from '../../atoms/ImageTool.svg';
import { ReactComponent as SizerTool } from '../../atoms/SizerTool.svg';
import { ReactComponent as BlueSaveIcon } from '../../atoms/BlueSaveIcon.svg';
import DualTabList, { PhotoElementData } from "../../molecules/DualTabList";
import { Server } from "../../../game/connect/types";

const SIDE_BAR_WIDTH = 130/* px */;
const EXTENDS_BAR_WIDTH = 464/* px */;

const ExpandBarDiv = styled.div<{opened: boolean}>`
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    height: 100%;
    width: ${EXTENDS_BAR_WIDTH}px;
    position: absolute;
    left: ${p => p.opened ? SIDE_BAR_WIDTH : SIDE_BAR_WIDTH - EXTENDS_BAR_WIDTH}px;
    transition: left 0.5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    pointer-events: all;
`;

const Container = styled.div`
    width: 100%;
    height: calc(100% - 70px);
    
    overflow-y: scroll;
    overflow-y: overlay;

    box-sizing: border-box;

    ::-webkit-scrollbar {
        width: 14px;
        padding: 10px 1px 10px 1px;
    }
    ::-webkit-scrollbar-thumb {
        width: 2px;
        border-radius: 1px;
        background-color: #2E2E2E60;

        background-clip: padding-box;
        border: 6px solid transparent;
        border-bottom: 12px solid transparent;
    }
    ::-webkit-scrollbar-track {
        display: none;
    }

    scrollbar-color: #2E2E2E60 #00000000; // for FF
    scrollbar-width: thin; // for FF
`


const ObjectTypeRadioWrapper = styled.div`
    display: flex;
    height: 49px;

    margin: 0px 18px 0px 18px;

    border-radius: 24.5px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);

    margin-bottom: 10px;

    :hover {
        cursor: pointer;
    }
`

const ObjectTypeRadio = styled.div<{selected: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: 'Noto Sans';
    font-size: 12px;

    flex: 1;

    background-color: ${p => p.selected ? "#A69B97" : "#A69B9760"};

    transition: background-color 100ms;
`

const ObjectTypeRadioL = styled(ObjectTypeRadio)`
    border-radius: 24.5px 0px 0px 24.5px;

    border-right: 1px solid #FFFFFF60;
`

const ObjectTypeRadioR = styled(ObjectTypeRadio)`
    border-radius: 0px 24.5px 24.5px 0px;
    
    border-left: 1px solid #FFFFFF60;
`


const ToolsWrapper = styled.div<{selected: number}>`
    width: 100%;
    
    display: flex;
    align-items: center;

    box-sizing: border-box;

    padding-left: 77px;
    margin-bottom: 18px;

    & > svg:nth-child(${p => p.selected + 1}){
        border: 3px solid #A69B97;
    }

    & > svg {
        filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
        margin-right: 10px;

        transition: all 50ms;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px solid #00000000;

        :hover {
            cursor: pointer;
        }
    }

`



interface PropsType {
    worldId: string;
    opened: boolean;
}

enum Tools {
    Pen,
    Eraser,
    Collider,
    Image,
    Sizer
}

function ObjectEditorInner({ worldId, opened }: PropsType) {
    const [tab, setTab] = useState(0);
    const onChangeTab = useCallback((index: number) => {
        if (index !== tab)
            if (!window.confirm("unsaved data will be lost. continue?")) return;
        setTab(index);
    }, [tab]);

    const [photoId, setPhotoId] = useState(0);
    const tabNames = useMemo(() => ({left: "Tile List", right: "Result object"}), []);

    const [selectedObjectType, setSelectedObjectType] = useState(Server.GameObjectType.Wall);
    const [selectedTool, setSelectedTool] = useState(Tools.Pen);
    const onSelectTool = useCallback((tool: Tools) => {
        if (tool === Tools.Image) {
            if (!window.confirm("unsaved data will be lost. continue?")) return;
            return ;
        }
        setSelectedTool(tool);
    }, []);

    const save = useCallback(() => {
        const shouldSave = window.confirm("save current work?");
        if (!shouldSave) return;
        // @TODO: save
    }, []);
    
    const [datas] = useState<{
        left: PhotoElementData[];
        right: PhotoElementData[];
    }>({left: [], right: []});

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <DualTabList 
                    datas={datas} 
                    setId={setPhotoId} 
                    id={photoId} 
                    tab={tab} 
                    setTab={onChangeTab}
                    tabNames={tabNames}
                />
                <TileEditor opened={opened} />
                <ObjectTypeRadioWrapper>
                    <ObjectTypeRadioL 
                        selected={Server.GameObjectType.Wall === selectedObjectType}
                        onClick={() => setSelectedObjectType(Server.GameObjectType.Wall)}
                    >
                        Wall
                    </ObjectTypeRadioL>
                    <ObjectTypeRadio 
                        selected={Server.GameObjectType.Floor === selectedObjectType}
                        onClick={() => setSelectedObjectType(Server.GameObjectType.Floor)}
                    > 
                        Floor
                    </ObjectTypeRadio>
                    <ObjectTypeRadioR 
                        selected={Server.GameObjectType.Effect === selectedObjectType}
                        onClick={() => setSelectedObjectType(Server.GameObjectType.Effect)}
                    >
                        Effect
                    </ObjectTypeRadioR>
                </ObjectTypeRadioWrapper>
            </Container>
            <ToolsWrapper selected={selectedTool}>
                <PenTool onClick={() => onSelectTool(Tools.Pen)} />
                <EraseTool onClick={() => onSelectTool(Tools.Eraser)} />
                <ColliderTool onClick={() => onSelectTool(Tools.Collider)} />
                <ImageTool onClick={() => onSelectTool(Tools.Image)} />
                <SizerTool onClick={() => onSelectTool(Tools.Sizer)} />
                <BlueSaveIcon 
                    style={{marginLeft: 'auto', marginRight: "18px", width: '44px', height: '44px'}}
                    onClick={save}
                />
            </ToolsWrapper>
        </ExpandBarDiv>
    );
}


export default React.memo(ObjectEditorInner);

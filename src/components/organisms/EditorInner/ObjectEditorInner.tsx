import React, { useMemo, useState } from "react";
import styled from "styled-components";

import TileEditor from "../../molecules/TileEditor";
import { ReactComponent as PenTool } from '../../atoms/PenTool.svg';
import { ReactComponent as EraseTool } from '../../atoms/EraseTool.svg';
import { ReactComponent as ColliderTool } from '../../atoms/ColliderTool.svg';
import { ReactComponent as ImageTool } from '../../atoms/ImageTool.svg';
import { ReactComponent as SizerTool } from '../../atoms/SizerTool.svg';
import DualTabList, { PhotoElementData } from "../../molecules/DualTabList";

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
`

const ObjectTypeRadioL = styled(ObjectTypeRadio)`
    border-radius: 24.5px 0px 0px 24.5px;

    border-right: 1px solid #FFFFFF60;
`

const ObjectTypeRadioR = styled(ObjectTypeRadio)`
    border-radius: 0px 24.5px 24.5px 0px;
    
    border-left: 1px solid #FFFFFF60;
`



const ToolsWrapper = styled.div`
    width: 100%;
    height: 38px;
    
    display: flex;

    box-sizing: border-box;

    padding-left: 77px;
    margin-bottom: 18px;

    & > svg {
        filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
        margin-right: 10px;

        :hover {
            cursor: pointer;
        }
    }

`



interface PropsType {
    worldId: string;
    opened: boolean;
}

function ObjectEditorInner({ worldId, opened }: PropsType) {
    const [tab, setTab] = useState(0);
    const [photoId, setPhotoId] = useState(0);
    const tabNames = useMemo(() => ({left: "Tile List", right: "Result object"}), []);
    
    const [datas] = useState<{
        left: PhotoElementData[];
        right: PhotoElementData[];
    }>({left: [], right: []});

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <DualTabList datas={datas} setId={setPhotoId} id={photoId} tab={tab} setTab={setTab} tabNames={tabNames}/>
                <TileEditor />
                <ObjectTypeRadioWrapper>
                    <ObjectTypeRadioL selected={true}>
                        Wall
                    </ObjectTypeRadioL>
                    <ObjectTypeRadio selected={false}> 
                        Floor
                    </ObjectTypeRadio>
                    <ObjectTypeRadioR selected={false}> 
                        Effect
                    </ObjectTypeRadioR>
                </ObjectTypeRadioWrapper>
            </Container>
            <ToolsWrapper>
                <PenTool />
                <EraseTool />
                <ColliderTool />
                <ImageTool />
                <SizerTool />
            </ToolsWrapper>
        </ExpandBarDiv>
    );
}


export default React.memo(ObjectEditorInner);

import React, { useCallback } from "react";
import styled from "styled-components";
import { ReactComponent as PenTool } from '../../atoms/PenTool.svg';
import { ReactComponent as EraseTool } from '../../atoms/EraseTool.svg';
import { ReactComponent as ColliderTool } from '../../atoms/ColliderTool.svg';
import { ReactComponent as ImageTool } from '../../atoms/ImageTool.svg';
import { ReactComponent as SizerTool } from '../../atoms/SizerTool.svg';


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

const VerticalWrapperList = styled.div`
    display: flex;
    flex-direction: column;
    width: 428px;
    height: 390px;
    margin: 18px;
`

const ListTitle = styled.div`
    height: 48px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: 'Noto Sans';
    font-size: 16px;

    background-color: #A69B97;
    border-radius: 23px 23px 0px 0px;
`

const ListFakeHr = styled.div`
    height: 2px;
    background-color: #FFFFFF60;
`

const ListBody = styled.div`
    height: 350px;
    
    overflow-y: scroll; // for FF
    overflow-y: overlay;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;

    padding: 10px;

    background-color: #A69B97;
    border-radius: 0px 0px 23px 23px;

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


const DrawArea = styled.div`
    width: 427px;
    height: 390px;

    margin: 0px 18px 18px 18px;

    border-radius: 23px;

    box-shadow: 5px 5px 20px 0px #00000012; 
    background-color: #FFFFFF;
`

const ObjectTypeRadioWrapper = styled.div`
    display: flex;
    height: 49px;

    margin: 0px 18px 0px 18px;

    border-radius: 24.5px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);

    margin-bottom: 10px;
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
    }

`



interface PropsType {
    worldId: string;
    opened: boolean;
    datas: PhotoElementData[];
}

function ObjectEditorInner({ worldId, opened, datas }: PropsType) {
    const onSelect = useCallback((id: string) => {
        console.log("select");
    }, [])
    
    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <VerticalWrapperList>
                    <ListTitle>
                        Tile List
                    </ListTitle>
                    <ListFakeHr />
                    <ListBody>
                        {datas.map(data => (
                            <PhotoElement onSelect={onSelect} selected={false} data={data} />
                        ))}
                    </ListBody>
                </VerticalWrapperList>
                <DrawArea />
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




const ElementWrapperDIv = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;

    margin: 10px;
`

const ElementThumbnail = styled.img`
    width: 75px;
    height: 75px;

`

const ElementName = styled.span`
    font-family: 'Noto Sans';
    font-size: 14px;
`

export interface PhotoElementData {
    id: string,
    src: string,
    name: string,
}

interface PhotoElementProps {
    onSelect: (id: PhotoElementData["id"]) => void;
    selected: boolean;
    data: PhotoElementData;
}

const PhotoElement = React.memo(({ onSelect, selected, data }: PhotoElementProps) => {
    return (
        <ElementWrapperDIv onClick={() => onSelect(data.id)}>
            <ElementThumbnail src={data.src} />
            <ElementName>{data.name}</ElementName>
        </ElementWrapperDIv>
    );
});

export default React.memo(ObjectEditorInner);

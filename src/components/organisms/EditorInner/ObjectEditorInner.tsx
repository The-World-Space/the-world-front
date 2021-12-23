import React from "react";
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
    height: calc(100% - 70px);
    
    overflow-y: scroll;
    overflow-y: overlay;

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
    console.debug("ObjectEditorInner");
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
                            <PhotoElement onSelect={() => {}} selected={false} data={data} />
                        ))}
                        <PhotoElement onSelect={() => {}} key={ '1'} selected={false} data={{id: '1', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '2'} selected={false} data={{id: '2', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '3'} selected={false} data={{id: '3', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '4'} selected={false} data={{id: '4', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '5'} selected={false} data={{id: '5', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '6'} selected={false} data={{id: '6', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '7'} selected={false} data={{id: '7', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '8'} selected={false} data={{id: '8', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={ '9'} selected={false} data={{id: '9', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'10'} selected={false} data={{id: '10', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'11'} selected={false} data={{id: '11', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'12'} selected={false} data={{id: '12', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'13'} selected={false} data={{id: '13', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'14'} selected={false} data={{id: '14', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'15'} selected={false} data={{id: '15', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'16'} selected={false} data={{id: '16', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'17'} selected={false} data={{id: '17', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'18'} selected={false} data={{id: '18', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'19'} selected={false} data={{id: '19', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'20'} selected={false} data={{id: '20', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'21'} selected={false} data={{id: '21', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'22'} selected={false} data={{id: '22', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'23'} selected={false} data={{id: '23', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'24'} selected={false} data={{id: '24', name:'사진 캡쳐', src:"/logo192.png"}} />
                        <PhotoElement onSelect={() => {}} key={'25'} selected={false} data={{id: '25', name:'사진 캡쳐', src:"/logo192.png"}} />
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
    onSelect: () => void;
    selected: boolean;
    data: PhotoElementData;
}

const PhotoElement = React.memo(({ onSelect, selected, data }: PhotoElementProps) => {
    console.debug('PhotoElement', onSelect, selected, data);
    return (
        <ElementWrapperDIv onClick={onSelect}>
            <ElementThumbnail src={data.src} />
            <ElementName>{data.name}</ElementName>
        </ElementWrapperDIv>
    );
}, (prev, next) => (
    prev.data.id === next.data.id
    && prev.data.name === next.data.name
    && prev.data.src === next.data.src
    && prev.selected === next.selected
));

export default React.memo(ObjectEditorInner);

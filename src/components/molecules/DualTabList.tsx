import React from "react";
import styled from "styled-components";

const IMAGE_SIZE = 75;

const VerticalWrapperList = styled.div`
    display: flex;
    flex-direction: column;
    width: 428px;
    height: 390px;
    margin: 18px;
`;

const ListTop = styled.div`
    height: 48px;

    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;

`;

const Tab = styled.div<{selected: boolean}>`
    width: ${p => p.selected ? "55%" : "50%"};
    height: ${p => p.selected ? "48px" : "36px"};

    position: absolute;
    bottom: 0px;

    border-radius: 23px 23px 0px 0px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: "Noto Sans";
    font-size: 16px;

    color: ${p => p.selected ? "#000000" : "#00000060"};
    background-color: ${p => p.selected ? "#A69B97" : "#A69B9760"};

    transition: all 50ms;

    :hover {
        cursor: pointer;
    }
`;

const TabL = styled(Tab)`
    left: 0px;
`;

const TabR = styled(Tab)`
    right: 0px;
`;


const ListFakeHr = styled.div`
    height: 2px;
    background-color: #FFFFFF60;
`;

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
`;

export enum DualTabType {
    Left,
    Right
}

interface DualTabListProps {
    setId: (id: PhotoElementData["id"]) => void;
    id: PhotoElementData["id"];
    setTab: (tab: DualTabType) => void;
    tab: DualTabType;
    datas: {
        left: PhotoElementData[];
        right: PhotoElementData[];
    }
    tabNames: {
        left: string,
        right: string
    }
}

function DualTabList({setId, id, setTab, tab, datas, tabNames}: DualTabListProps) {
    return (
        <VerticalWrapperList>
            <ListTop>
                <TabL selected={tab === DualTabType.Left} onClick={() => setTab(DualTabType.Left)}>
                    {tabNames.left}
                </TabL>
                <TabR selected={tab === DualTabType.Right} onClick={() => setTab(DualTabType.Right)}>
                    {tabNames.right}
                </TabR>
            </ListTop>
            <ListFakeHr />
            <ListBody>
                {(tab === DualTabType.Right ? datas.right : datas.left).map(data => (
                    <PhotoElement onSelect={setId} selected={id === data.id} data={data} key={data.id} label={String(data.name)} />
                ))}
            </ListBody>
        </VerticalWrapperList>
    );
}


const ElementWrapperDIv = styled.div<{selected: boolean}>`
    display: flex;
    flex-direction: column;

    align-items: center;

    margin: 10px;

    background-color: ${p => p.selected ? "#D7CCC8" : "#A69B97"};
`;

const ElementThumbnail = styled.img`
    width: ${IMAGE_SIZE}px;
    height: ${IMAGE_SIZE}px;
    image-rendering: pixelated;
`;

const AtlasThumbnail = styled.div`
    width: ${IMAGE_SIZE}px;
    height: ${IMAGE_SIZE}px;
    image-rendering: pixelated;
`;

const ElementName = styled.span`
    font-family: "Noto Sans";
    font-size: 14px;
`;

export type PhotoElementData = PhotoSrcData | PhotoAtlasData;


export interface PhotoSrcData {
    id: string,
    src: string,
    name: string,
    isAtlas: undefined,
}

export interface PhotoAtlasData {
    id: string,
    src: string,
    atlasIndex: number,
    verticalCount: number,
    horizontalCount: number,
    isAtlas: true,
    name: string,
}

interface PhotoElementProps {
    onSelect: (id: PhotoElementData["id"]) => void;
    selected: boolean;
    data: PhotoElementData;
    label: string;
}

const    PhotoElement = React.memo(PhotoElement_);
function PhotoElement_({ onSelect, selected, data, label }: PhotoElementProps) {
    const verticalIndex = data.isAtlas ? ~~(data.atlasIndex / data.horizontalCount) : 0;
    const horizontalIndex = data.isAtlas ? (data.atlasIndex % data.horizontalCount) : 0;
    return (
        <ElementWrapperDIv onClick={() => onSelect(String(data.id))} selected={selected}>
            {
                data.isAtlas 
                    ? <AtlasThumbnail 
                        style={{
                            backgroundImage: `url(${data.src})`,
                            backgroundSize: `${data.horizontalCount * IMAGE_SIZE}px ${data.verticalCount * IMAGE_SIZE}px`,
                            objectFit: "none",
                            backgroundPosition: `${horizontalIndex * -IMAGE_SIZE}px ${verticalIndex * -IMAGE_SIZE}px`,
                        }}
                    />
                    : <ElementThumbnail src={data.src} />
            }
            <ElementName>{label}</ElementName>
        </ElementWrapperDIv>
    );
}


export default React.memo(DualTabList);

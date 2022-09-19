import React from "react";
import styled from "styled-components";

const IMAGE_SIZE = 75;

const VerticalWrapperList = styled.div<{height?: string, minHeight?: string}>`
    display: flex;
    flex-direction: column;
    width: 428px;
    height: ${p => p.height || "390px"};
    ${p => p.minHeight ? `min-height: ${p.minHeight};` : ""}
    margin: 0px 0px 18px 0px;
`;

const ListTop = styled.div`
    height: 48px;

    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;

`;

const Tab = styled.div`
    width: 100%;
    height: 48px;

    border-radius: 23px 23px 0px 0px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: "Noto Sans";
    font-size: 16px;

    color: "#000000";
    background-color: #A69B97;

    transition: all 50ms;
`;


const ListFakeHr = styled.div`
    height: 2px;
    background-color: #FFFFFF60;
`;

const ListBody = styled.div`
    height: 350px;

    flex: 1;
    
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

interface LabeledListProps {
    setId: (id: PhotoElementData["id"]) => void;
    id: PhotoElementData["id"];
    datas: PhotoElementData[];
    tabName: string;
    height?: string;
    minHeight?: string;
}

function LabeledList({setId, id, datas, tabName, height, minHeight}: LabeledListProps) {
    return (
        <VerticalWrapperList height={height} minHeight={minHeight}>
            <ListTop>
                <Tab>
                    {tabName}
                </Tab>
            </ListTop>
            <ListFakeHr />
            <ListBody>
                {datas.map((data, i) => (
                    <PhotoElement onSelect={setId} selected={id === data.id} data={data} key={data.id} label={String(i)} />
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
    id: number,
    src: string,
    name: string,
    isAtlas: undefined,
}

export interface PhotoAtlasData {
    id: number,
    src: string,
    atlasIndex: number,
    rowCount: number,
    columnCount: number,
    isAtlas: true,
}

interface PhotoElementProps {
    onSelect: (id: PhotoElementData["id"]) => void;
    selected: boolean;
    data: PhotoElementData;
    label: string;
}

function PhotoElement_({ onSelect, selected, data, label }: PhotoElementProps) {
    const rowIndex = data.isAtlas ? ~~(data.atlasIndex / data.columnCount) : 0;
    const columnIndex = data.isAtlas ? (data.atlasIndex % data.columnCount) : 0;
    return (
        <ElementWrapperDIv onClick={() => onSelect(data.id)} selected={selected}>
            {
                data.isAtlas 
                    ? <AtlasThumbnail 
                        style={{
                            backgroundImage: `url(${data.src})`,
                            backgroundSize: `${data.columnCount * IMAGE_SIZE}px ${data.rowCount * IMAGE_SIZE}px`,
                            objectFit: "none",
                            backgroundPosition: `${columnIndex * -IMAGE_SIZE}px ${rowIndex * -IMAGE_SIZE}px`
                        }}
                    />
                    : <ElementThumbnail src={data.isAtlas} />
            }
            <ElementName>{label}{data.isAtlas ? `:: ${rowIndex} ${columnIndex} ${data.atlasIndex}` : ""}</ElementName>
        </ElementWrapperDIv>
    );
}
const PhotoElement = React.memo(PhotoElement_);

export default React.memo(LabeledList);

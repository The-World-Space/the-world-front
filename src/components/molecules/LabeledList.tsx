import React from "react";
import styled from "styled-components";

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
}

function LabeledList({setId, id, datas, tabName}: LabeledListProps) {
    return (
        <VerticalWrapperList>
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


const ElementWrapperDIv = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;

    margin: 10px;
`;

const ElementThumbnail = styled.img`
    width: 75px;
    height: 75px;

`;

const ElementName = styled.span`
    font-family: "Noto Sans";
    font-size: 14px;
`;

export type PhotoElementData = PhotoSrcData;


interface PhotoSrcData {
    id: number,
    src: string,
}

interface PhotoElementProps {
    onSelect: (id: PhotoElementData["id"]) => void;
    selected: boolean;
    data: PhotoElementData;
    label: string;
}

const    PhotoElement = React.memo(PhotoElement_);
function PhotoElement_({ onSelect, /*selected,*/ data, label }: PhotoElementProps) {
    return (
        <ElementWrapperDIv onClick={() => onSelect(data.id)}>
            <ElementThumbnail src={data.src} />
            <ElementName>{label}</ElementName>
        </ElementWrapperDIv>
    );
}

export default React.memo(LabeledList);

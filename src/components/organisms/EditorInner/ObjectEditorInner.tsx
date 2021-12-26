import React, { useCallback, useContext, useRef, useState } from "react";
import styled from "styled-components";

import TileEditor from "../../molecules/TileEditor";
import { ReactComponent as PenTool } from "../../atoms/PenTool.svg";
import { ReactComponent as EraseTool } from "../../atoms/EraseTool.svg";
import { ReactComponent as ColliderTool } from "../../atoms/ColliderTool.svg";
import { ReactComponent as ImageTool } from "../../atoms/ImageTool.svg";
import { ReactComponent as SizerTool } from "../../atoms/SizerTool.svg";
import { ReactComponent as BlueSaveIcon } from "../../atoms/BlueSaveIcon.svg";
import { Server } from "../../../game/connect/types";
import { ObjEditorContext } from "../../../context/contexts";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { globalFileApolloClient } from "../../../game/connect/files";
import LabeledList, { PhotoElementData } from "../../molecules/LabeledList";

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
    
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-y: overlay;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;

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
`;

const ObjectTypeRadio = styled.div<{selected: boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: "Noto Sans";
    font-size: 12px;

    flex: 1;

    background-color: ${p => p.selected ? "#A69B97" : "#A69B9760"};

    transition: background-color 100ms;
`;

const ObjectTypeRadioL = styled(ObjectTypeRadio)`
    border-radius: 24.5px 0px 0px 24.5px;

    border-right: 1px solid #FFFFFF60;
`;

const ObjectTypeRadioR = styled(ObjectTypeRadio)`
    border-radius: 0px 24.5px 24.5px 0px;
    
    border-left: 1px solid #FFFFFF60;
`;


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

`;


const UPLOAD_IMAGE = gql`
    mutation UploadFile($image: Upload!) {
        uploadImageAsset(image: $image) {
            filename
        }
    }
`;


const SAVE_IMAGE_PROTO = gql`
mutation CREATE_IMAGE_PROTO ($protoInput: ImageGameObjectProtoInput!) {
    createImageGameObjectProto(
        imageGameObjectProto: $protoInput
    ) {
        id
    }
}
`;


interface PropsType {
    worldId: string;
    opened: boolean;
}

export enum Tools {
    Pen,
    Eraser,
    Collider,
    Image,
    Sizer
}

function ObjectEditorInner({ /*worldId,*/ opened }: PropsType) {
    const {objEditorConnector} = useContext(ObjEditorContext);

    const [photoId, setPhotoId] = useState(0);

    const [selectedObjectType, setSelectedObjectType] = useState(Server.GameObjectType.Wall);
    const [selectedTool, setSelectedTool] = useState(Tools.Pen);
    const onSelectTool = useCallback((tool: Tools) => {
        if (tool === Tools.Image) {
            if (!window.confirm("unsaved data will be lost. continue?")) return;
            objEditorConnector.clearColliders();
            inputFile.current?.click();
            return ;
        }
        objEditorConnector.setToolType(tool);
        setSelectedTool(tool);
    }, [objEditorConnector]);

    
    const [imageUploadMutate] = useMutation(UPLOAD_IMAGE, {
        client: globalFileApolloClient,
    });
    const [saveMutate] = useMutation(SAVE_IMAGE_PROTO);
    const [file, setFile] = useState<File>();
    const onFileChange = useCallback(({ target: { validity, files } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!validity.valid || !files || files.length < 1) return;
        const inputedFile = files[0];
        setFile(inputedFile);
        const src = window.URL.createObjectURL(inputedFile);
        objEditorConnector.setViewObject(src, imageWidth, imageHeight);
    }, []);

    const [imageWidth] = useState(2);
    const [imageHeight] = useState(2);

    const apolloClient = useApolloClient();
    const save = useCallback(async () => {
        const shouldSave = window.confirm("save current work?");
        if (!shouldSave) return;
        if (!file) throw new Error("no file");
        const vars = {
            name: "noname",
            width: imageWidth,
            height: imageHeight,
            isPublic: true,
            type: selectedObjectType,
            offsetX: 0,
            offsetY: 0,
            colliders: 
                objEditorConnector.getColliderShape()
                    .map(c => ({x: c.x, y: c.y, isBlocked: true})),
        };
        const imageUploadRes = await imageUploadMutate({
            variables: {
                image: file
            }
        });
        await saveMutate({
            variables: {
                protoInput: {
                    ...vars,
                    src: `https://asset.the-world.space/image/${imageUploadRes.data.uploadImageAsset.filename}`,
                }
            }
        });
        objEditorConnector.clearColliders();
        objEditorConnector.clearViewObject();
        apolloClient.resetStore();
    }, [file, imageWidth, imageHeight, selectedObjectType]);
    
    const [datas] = useState<PhotoElementData[]>([]);
    
    const inputFile = useRef<HTMLInputElement | null>(null);
    (global as any).inputFile = inputFile;

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <LabeledList 
                    datas={datas} 
                    setId={setPhotoId} 
                    id={photoId}
                    tabName="Result object"
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
                    style={{marginLeft: "auto", marginRight: "18px", width: "44px", height: "44px"}}
                    onClick={save}
                />
            </ToolsWrapper>
            <input type="file" id="file" ref={inputFile} style={{display: "none"}} onChange={onFileChange} />
        </ExpandBarDiv>
    );
}


export default React.memo(ObjectEditorInner);

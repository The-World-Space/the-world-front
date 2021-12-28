import React, { ChangeEventHandler, useCallback, useContext, useRef, useState } from "react";
import styled from "styled-components";

import TileEditor from "../../molecules/TileEditor";
import { ReactComponent as PenTool } from "../../atoms/PenTool.svg";
import { ReactComponent as EraseTool } from "../../atoms/EraseTool.svg";
import { ReactComponent as ImageTool } from "../../atoms/ImageTool.svg";
import { ReactComponent as BlueSaveIcon } from "../../atoms/BlueSaveIcon.svg";
import { ReactComponent as ChainOn } from "../../atoms/ChainOn.svg";
import { ReactComponent as ChainOff } from "../../atoms/ChainOff.svg";
import { Server } from "../../../game/connect/types";
import { ObjEditorContext, WorldEditorContext } from "../../../context/contexts";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { globalFileApolloClient } from "../../../game/connect/files";

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

    padding: 18px;

    /* display: flex;
    flex-direction: column; */

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

    margin: 0px 0px 18px 0px;

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


const InputWrapper = styled.div`
    width: 100%;
    
    box-sizing: border-box;

    display: flex;

    background-color: #A69B97;

    border-radius: 27.5px;
`;

const InputWrapperSide = styled.div`
    width: calc(50% - 1px);

    display: flex;

    justify-content: center;
    align-items: center;
`;

const InputWrapperSideVerticalLine = styled.div`
    width: 0px;

    border: 1px solid rgba(255, 255, 255, 0.6);
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
    Collider,
    Eraser,
    Image
}

function ObjectEditorInner({ /*worldId,*/ opened }: PropsType) {
    const {objEditorConnector} = useContext(ObjEditorContext);

    //const [photoId, setPhotoId] = useState(0);

    const [selectedObjectType, setSelectedObjectType] = useState(Server.GameObjectType.Wall);
    const [selectedTool, setSelectedTool] = useState(Tools.Collider);
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

    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [imageNaturalWidth, setImageNaturalWidth] = useState(16);
    const [imageNaturalHeight, setImageNaturalHeight] = useState(16);

    const [imageWidth, setImageWidth] = useState("2");
    const [imageHeight, setImageHeight] = useState("2");
    const [name, setName] = useState("");
    const isSafeNum = useCallback((num: number) => !isNaN(num) && num >= 0 && num < Infinity, []);
    const onImageSizeChange = useCallback((width?: string, height?: string) => {
        let numWidth = +(width ?? 0);
        let numHeight = +(height ?? 0);
        let isValid = true;

        if (width && height) {
            numWidth = +width;
            numHeight = +height;
            if (isSafeNum(numWidth) && isSafeNum(numHeight)) {
                setImageWidth(width);
                setImageHeight(height);
            } else isValid = false;
        } else {
            if (maintainAspectRatio) {
                if (width) {
                    numWidth = +width;
                    numHeight = numWidth * imageNaturalHeight / imageNaturalWidth;
                    if (isSafeNum(numWidth)) {
                        setImageWidth(width);
                        setImageHeight(`${numWidth * imageNaturalHeight / imageNaturalWidth}`);
                    } else isValid = false;
                } else if (height) {
                    numHeight = +height;
                    numWidth = numHeight * imageNaturalWidth / imageNaturalHeight;
                    if (isSafeNum(numHeight)) {
                        setImageHeight(height);
                        setImageWidth(`${numHeight * imageNaturalWidth / imageNaturalHeight}`);
                    } else isValid = false;
                }
            } else {
                if (width) {
                    numWidth = +width;
                    numHeight = parseFloat(imageHeight) ?? 0;
                    if (isSafeNum(numWidth)) {
                        setImageWidth(width);
                    } else isValid = false;
                } else if (height) {
                    numHeight = +height;
                    numWidth = parseFloat(imageWidth) ?? 0;
                    if (isSafeNum(numHeight)) {
                        setImageHeight(height);
                    } else isValid = false;
                }
            }
        }
        if (numWidth > 0 && numHeight > 0  && isValid) {
            objEditorConnector.setViewObjectSize(numWidth, numHeight);
        }
    }, [isSafeNum, objEditorConnector, imageNaturalHeight, imageNaturalWidth, maintainAspectRatio, imageWidth, imageHeight]);

    const [imageUploadMutate] = useMutation(UPLOAD_IMAGE, {
        client: globalFileApolloClient,
    });
    const [saveMutate] = useMutation(SAVE_IMAGE_PROTO);
    const [file, setFile] = useState<File>();
    const onFileChange = useCallback(({ target: { validity, files } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!validity.valid || !files || files.length < 1) return;
        const reader = new FileReader();
        const inputedFile = files[0];
        setFile(inputedFile);
        reader.onload = (e) => {
            const img = new Image();
            if (!e.target?.result) throw new Error("Image load failed");
            img.onload = async function(e) {
                setImageNaturalWidth(img.naturalWidth);
                setImageNaturalHeight(img.naturalHeight);
                if (maintainAspectRatio) {
                    objEditorConnector.setViewObject((e.target as HTMLImageElement).src, 2, img.naturalHeight / img.naturalWidth * 2);
                    onImageSizeChange("2", String(img.naturalHeight / img.naturalWidth * 2));
                } else {
                    objEditorConnector.setViewObject((e.target as HTMLImageElement).src, 2, 2);
                    onImageSizeChange("2", "2");
                }
            };
            img.src = e.target.result as string;
        };
        reader.readAsDataURL(inputedFile);
    }, [maintainAspectRatio, onImageSizeChange, objEditorConnector]);


    const apolloClient = useApolloClient();
    const save = useCallback(async () => {
        const shouldSave = window.confirm("save current work?");
        if (!shouldSave) return;
        try{
            if (!file) throw new Error("no file");
            if (!isSafeNum(+imageWidth)) throw new Error("invalid image width");
            if (!isSafeNum(+imageHeight)) throw new Error("invalid image height");
            if (+imageWidth <= 0 || +imageHeight <= 0) throw new Error("invalid image size");
            if (!name) throw new Error("no name");
        } catch(e) {
            alert("ERROR: " + (e as Error).message);
            return;
        }

        const vars = {
            name: name,
            width: +imageWidth,
            height: +imageHeight,
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
    }, [file, imageWidth, imageHeight, selectedObjectType, name, imageUploadMutate, saveMutate, apolloClient, objEditorConnector, isSafeNum]);
    
    //const [datas] = useState<PhotoElementData[]>([]);
    
    const inputFile = useRef<HTMLInputElement | null>(null);
    (global as any).inputFile = inputFile;

    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    const updateMaintainAspectRatio = useCallback((value: boolean) => {
        setMaintainAspectRatio(value);
        if (value) {
            const imageWidthNum = parseFloat(imageWidth);
            if (isSafeNum(imageWidthNum)) {
                onImageSizeChange(imageWidth, String(imageWidthNum * imageNaturalHeight / imageNaturalWidth));
            } else {
                onImageSizeChange("2", String(imageNaturalHeight / imageNaturalWidth * 2));
            }
        }
    }, [imageNaturalWidth, imageNaturalHeight, onImageSizeChange, imageWidth, isSafeNum]);

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
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
                <InputWrapper>
                    <InputWrapperSide>
                        <NameInputWrapper>
                            <NameInputLabel>
                                Name :
                            </NameInputLabel>
                            <NameInputArea value={name} onChange={e => setName(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                        </NameInputWrapper>
                    </InputWrapperSide>
                    <InputWrapperSideVerticalLine />
                    <InputWrapperSide>
                        <LabeledInput label="W" value={imageWidth} onChange={e => onImageSizeChange(e.target.value, undefined)} />
                        {maintainAspectRatio 
                            ? <ChainOn onClick={() => updateMaintainAspectRatio(false)} /> 
                            : <ChainOff onClick={() => updateMaintainAspectRatio(true)} />}
                        <LabeledInput label="H" value={imageHeight} onChange={e => onImageSizeChange(undefined, e.target.value)} />
                    </InputWrapperSide>
                </InputWrapper>
            </Container>
            <ToolsWrapper selected={selectedTool}>
                <PenTool onClick={() => onSelectTool(Tools.Collider)} />
                <EraseTool onClick={() => onSelectTool(Tools.Eraser)} />
                <ImageTool onClick={() => onSelectTool(Tools.Image)} />
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




const LabeledInputWrapper = styled.div`
    width: 70px;
    height: 27px;

    display: flex;

    margin: 10px;

    border-radius: 13.5px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
`;

const NameInputWrapper = styled(LabeledInputWrapper)`
    width: 182px;
`;

const LabeledInputLabel = styled.span`
    width: 30px;
    height: 27px;
    line-height: 27px;

    padding-left: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;

    background-color: #FFFFFB;

    border-radius: 13.5px 0px 0px 13.5px;
`;

const NameInputLabel = styled(LabeledInputLabel)`
    width: 50px;
`;


const LabeledInputArea = styled.input`
    width: calc(100% - 30px);
    height: 27px;
    line-height: 27px;

    box-sizing: border-box;

    border: none;
    outline: none;

    background-color: #FFFFFB;

    border-radius: 0px 13.5px 13.5px 0px;
`;

const NameInputArea = styled(LabeledInputArea)`
    width: calc(100% - 50px);
`;


interface LabeledInputProps {
    label: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

function LabeledInput({label, value, onChange}: LabeledInputProps) {
    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    return (
        <LabeledInputWrapper>
            <LabeledInputLabel>
                {label} :
            </LabeledInputLabel>
            <LabeledInputArea onChange={onChange} onFocus={onFocus} onBlur={onBlur} value={value} />
        </LabeledInputWrapper>
    );
}

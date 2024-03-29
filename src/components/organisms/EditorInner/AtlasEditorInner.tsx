import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { ChangeEventHandler, useCallback, useContext, useRef, useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";

import { WorldEditorContext } from "../../../context/contexts";
import { globalFileApolloClient } from "../../../game/connect/files";
import { IMAGE_MAX_SIZE, MB } from "../../../GlobalEnviroment";
import { ReactComponent as BlueSaveIcon } from "../../atoms/BlueSaveIcon.svg";
import { ReactComponent as ImageTool } from "../../atoms/ImageTool.svg";
import LabeledList, { PhotoAtlasData } from "../../molecules/LabeledList";

const SIDE_BAR_WIDTH = 130/* px */;
const EXTENDS_BAR_WIDTH = 464/* px */;

const ExpandBarDiv = styled.div<{opened: boolean}>`
    background: #D7CCC8;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
    height: 100%;
    width: ${EXTENDS_BAR_WIDTH}px;
    position: absolute;
    left: ${(p): number => p.opened ? SIDE_BAR_WIDTH : SIDE_BAR_WIDTH - EXTENDS_BAR_WIDTH}px;
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

    & > svg:nth-child(${(p): number => p.selected + 1}){
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


const CREATE_ATLAS = gql`
    mutation createAtlas($atlasInput: AtlasInput!) {
        createAtlas(atlas: $atlasInput) {
            id
        }
    }
`;


interface PropsType {
    worldId: string;
    opened: boolean;
}

export enum Tools {
    Image
}

function ObjectEditorInner({ /*worldId,*/ opened }: PropsType): JSX.Element {

    const [photoId, setPhotoId] = useState(0);

    const [selectedTool, setSelectedTool] = useState(Tools.Image);
    const onSelectTool = useCallback((tool: Tools): void => {
        if (tool === Tools.Image) {
            if (!window.confirm("unsaved data will be lost. continue?")) return;
            inputFile.current?.click();
            return;
        }
        setSelectedTool(tool);
    }, []);

    
    const [imageUploadMutate] = useMutation(UPLOAD_IMAGE, {
        client: globalFileApolloClient
    });
    const [crateMutate] = useMutation(CREATE_ATLAS);
    const [file, setFile] = useState<File>();
    const onFileChange = useCallback(({ target: { validity, files } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!validity.valid || !files || files.length < 1) return;
        const inputedFile = files[0];
        
        //if file size is too big, it will be rejected by the browser
        if (IMAGE_MAX_SIZE < inputedFile.size) {
            alert(`file size is too big. max size is ${IMAGE_MAX_SIZE / MB}MB`);
            return;
        }
        
        setFile(inputedFile);
        if (inputFile.current)
            inputFile.current.value = "";
    }, []);

    const [rowCount, setVerticalCount] = useState("2");
    const [columnCount, setHorizontalCount] = useState("2");
    const [name, setName] = useState("");
    const isSafeNum = useCallback((num: string) => /^\d*$/.test(num) && +num >= 0 && +num < Infinity, []);
    const onImageSizeChange = useCallback((width: string, height: string) => {
        if (!isSafeNum(width) || !isSafeNum(height)) return;
        setVerticalCount(width);
        setHorizontalCount(height);
    }, [isSafeNum]);

    const apolloClient = useApolloClient();
    const save = useCallback(async () => {
        const shouldSave = window.confirm("save current work?");
        if (!shouldSave) return;
        try{
            if (!file) throw new Error("no file");
            if (!isSafeNum(rowCount)) throw new Error("invalid image width");
            if (!isSafeNum(columnCount)) throw new Error("invalid image height");
            if (+rowCount <= 0 || +columnCount <= 0) throw new Error("invalid image size");
            if (!name) throw new Error("no name");
        } catch(e) {
            alert("ERROR: " + (e as Error).message);
            return;
        }

        const vars = {
            name: name,
            columnCount: +columnCount,
            rowCount: +rowCount,
            isPublic: true
        };
        const imageUploadRes = await imageUploadMutate({
            variables: {
                image: file
            }
        });
        await crateMutate({
            variables: {
                atlasInput: {
                    ...vars,
                    src: `https://asset.the-world.space/image/${imageUploadRes.data.uploadImageAsset.filename}`
                }
            }
        });
        setFile(undefined);
        setTileDataList([]);
        apolloClient.resetStore();
    }, [file, rowCount, columnCount, name, imageUploadMutate, crateMutate, apolloClient, isSafeNum]);
    
    //const [atlasDatas] = useState<PhotoElementData[]>([]);
    const [tileDataList, setTileDataList] = useState<PhotoAtlasData[]>([]);
    
    const inputFile = useRef<HTMLInputElement | null>(null);

    useDebounce(() => {
        if (!file) return;
        const rc = +rowCount;
        const cc = +columnCount;
        const src = window.URL.createObjectURL(file);
        const newDatas: PhotoAtlasData[] = new Array(rc * cc).fill(0).map((_, i) => ({
            id: i,
            atlasIndex: i,
            src,
            rowCount: rc,
            columnCount: cc,
            isAtlas: true as const
        }));
        setTileDataList(newDatas);
    }, 500, [file, columnCount, rowCount]);

    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <LabeledList 
                    datas={tileDataList} 
                    setId={setPhotoId} 
                    id={photoId}
                    tabName="Result object"
                    height="calc(100% - 65px)"
                    minHeight="400px"
                />
                <InputWrapper>
                    <InputWrapperSide>
                        <NameInputWrapper>
                            <NameInputLabel>
                                Name :
                            </NameInputLabel>
                            <NameInputArea value={name} onChange={(e): void => setName(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                        </NameInputWrapper>
                    </InputWrapperSide>
                    <InputWrapperSideVerticalLine />
                    <InputWrapperSide>
                        <LabeledInput label="C" value={columnCount} onChange={(e): void => onImageSizeChange(rowCount, e.target.value)} />
                        <LabeledInput label="R" value={rowCount} onChange={(e): void => onImageSizeChange(e.target.value, columnCount)} />
                    </InputWrapperSide>
                </InputWrapper>
            </Container>
            <ToolsWrapper selected={selectedTool}>
                <ImageTool onClick={(): void => onSelectTool(Tools.Image)} />
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

function LabeledInput({label, value, onChange}: LabeledInputProps): JSX.Element {
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

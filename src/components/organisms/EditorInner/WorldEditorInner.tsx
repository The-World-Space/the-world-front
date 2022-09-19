import React, { ChangeEventHandler, useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { ReactComponent as PenTool } from "../../atoms/PenTool.svg";
import { ReactComponent as EraseTool } from "../../atoms/EraseTool.svg";
import { ReactComponent as Trashcan } from "../../atoms/TrashcanIcon.svg";
import DualTabList, { DualTabType, PhotoAtlasData, PhotoSrcData } from "../../molecules/DualTabList";
import { Server } from "../../../game/connect/types";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { WorldEditorContext } from "../../../context/contexts";
import { Tools } from "../../../game/script/WorldEditorConnector";
import { useDebounce } from "react-use";
import { Link } from "react-router-dom";

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
`;

const IframeInputWrapper = styled.div`
    width: 428px;

    margin: 18px;

    display: flex;

    flex-direction: column;
    align-items: center;

    border-radius: 23px;

    background: #A69B97;
`;

const IframeTitle = styled.span`
    margin: 16px;

    font-family: "Noto Sans";
    font-size: 16px;
    font-weight: 500;
`;

const ListFakeHr = styled.div`
    width: 100%;
    height: 2px;
    background-color: #FFFFFF60;
`;

const IframeInput = styled.input`
    width: calc(100% - 14px);
    height: 42px;

    box-sizing: border-box;

    margin: 7px;
    padding-left: 10px;

    border-radius: 38px;
    border: 0px;
    outline: none;

    background: #FFFFFB;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.12);
`;

const IframeInputSettingWrapper = styled.div`
    width: 100%;
    height: 48px;

    padding: 0px 10px 0px 10px;

    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const IframeInputSettingRightText = styled.span<{selected: boolean, selectable: boolean}>`
    margin: 16px 53px;

    color: ${p => 
        p.selected ? "#000000" : 
        p.selectable ? "#00000060" : "#00000000"};
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;

    transition: color 50ms;

    :hover {
        cursor: pointer;
    }
`;

const PlaceModeBottomText = styled.span<{selected: boolean}>`
    margin: 16px 33px;

    color: ${p => p.selected ? "#000000" :"#00000060"};
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;

    transition: color 50ms;

    :hover {
        cursor: pointer;
    }
`;

const LittleVerticalLine = styled.div`
    width: 0px;
    height: 24px;

    border: 1px solid rgba(255, 255, 255, 0.6);
`;

const PlaceModeInputWrapper = styled.div`
    width: 428px;

    margin: 18px;

    display: flex;

    flex-direction: column;
    align-items: center;

    border-radius: 23px;

    background: #A69B97;
`;

const PlaceModeTitle = styled.span`
    margin: 16px;

    font-family: "Noto Sans";
    font-size: 16px;
    font-weight: 500;
`;

const PlaceModeLayerSelect = styled.div`
    width: calc(50% - 1px);
    height: 100%;

    display: flex;

    flex-direction: center;
    justify-content: space-around;
    align-items: center;
`;

const ToolsWrapper = styled.div<{selected: number}>`
    width: 100%;
    height: 38px;
    
    display: flex;

    box-sizing: border-box;

    padding-left: 77px;
    margin-bottom: 18px;

    & > svg:nth-child(${p => p.selected}){
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

const STYLED_LINK = styled(Link)`
    color: #00000080;
    font-weight: 800;
    text-decoration: none;
`;

const MY_IMAGE_GAME_OBJECT_PROTOS = gql`
    query myImageGOProtos {
        myImageGameObjectProtos {
            id
            name
            isPublic
            width
            height
            type
            colliders {
                x
                y
                isBlocked
            }
            src
        }
    }
`;

const MY_ATLASES = gql`
    query myAtlases {
        myAtlases {
            id
            name
            isPublic
            columnCount
            rowCount
            src
        }
    }
`;

const REMOVE_IMAGE_GAME_OBJECT_PROTO = gql`
    mutation deleteImageGameObject($id: Int!) {
        deleteImageGameObjectProto(id: $id)
    }
`;

const DELETE_ATLAS = gql`
    mutation deleteAtlas($atlasId: Int!) {
        deleteAtlas(id: $atlasId)
    }
`;

interface PropsType {
    worldId: string;
    opened: boolean;
}

enum PlaceKind {
    Tile = 1,
    Object = 2,
    Iframe = 3,
    Collider = 4,
}

enum EditorTools {
    None,
    Pen,
    Eraser,
}

enum Tabs {
    Tile,
    Object,
}

function WorldEditorInner({ /*worldId,*/ opened }: PropsType) {
    const apolloClient = useApolloClient();
    const {worldEditorConnector} = useContext(WorldEditorContext);

    const [tab, setTab] = useState(0);
    const [photoId, setPhotoId] = useState("0_0");
    const tabNames = useMemo(() => ({left: "Tile List", right: "Object List"}), []);

    const myImageGameObjectProtos = useQuery(MY_IMAGE_GAME_OBJECT_PROTOS);
    const myAtlases = useQuery(MY_ATLASES);

    const [removeImageGameObjectProto] = useMutation(REMOVE_IMAGE_GAME_OBJECT_PROTO);
    const [deleteAtlas] = useMutation(DELETE_ATLAS);

    interface DataType {
        left: PhotoAtlasData[];
        right: PhotoSrcData[];
    }
    const datas = 
        useMemo<DataType>(() => {
            const atlass: Server.Atlas[] | null = myAtlases.data?.myAtlases;
            const atlasTiles = atlass?.flatMap(a => {
                const rowCount = a.rowCount;
                const columnCount = a.columnCount;
                const newDatas: PhotoAtlasData[] = 
                    new Array(rowCount * columnCount).fill(0).map((_, i) => ({
                        id: `${a.id}_${i}`,
                        name: `${a.name}_${i}`,
                        isPublic: a.isPublic,
                        atlasIndex: i,
                        rowCount,
                        columnCount,
                        src: a.src,
                        isAtlas: true as const,
                    }));
                return newDatas;
            });
            const _imageProtos: Server.ImageGameObjectProto[] | null = myImageGameObjectProtos.data?.myImageGameObjectProtos;
            const imageProtos: PhotoSrcData[] | undefined = _imageProtos?.map(p => ({
                id: String(p.id),
                src: p.src,
                name: p.name,
                isAtlas: undefined,
            }));
            return {
                left: atlasTiles || [], 
                right: imageProtos || []
            };
        }, [
            myAtlases.data,
            myImageGameObjectProtos.data
        ]);

    
    const atlasMap = useMemo<{[key: string]: (Server.Atlas | undefined)}>(() => {
        const newMap: {[key: string]: (Server.Atlas | undefined)} = {};
        const atlases: Server.Atlas[] | null = myAtlases.data?.myAtlases;
        atlases?.forEach(a => {
            newMap[a.id] = a;
        });
        return newMap;
    }, [myAtlases.data]);
    const protoMap = useMemo<{[key: string]: (Server.ImageGameObjectProto | undefined)}>(() => {
        const newMap: {[key: string]: (Server.ImageGameObjectProto | undefined)} = {};
        const imageProtos: Server.ImageGameObjectProto[] | null = myImageGameObjectProtos.data?.myImageGameObjectProtos;
        imageProtos?.forEach(p => {
            newMap[p.id] = p;
        });
        return newMap;
    }, [myImageGameObjectProtos.data]);

    const [iframeWidth, setIframeWidth] = useState("1");
    const [iframeHeight, setIframeHeight] = useState("1");
    const [iframeSrc, setIframeSrc] = useState("");
    const [placeObjectType, setPlaceObjectType] = useState(Server.GameObjectType.Floor);
    const [placeKind, setPlaceKind] = useState(PlaceKind.Tile);
    const isSafeNum = useCallback((num: number) => !isNaN(num) && num >= 0 && num < Infinity, []);

    const [selectedTool, setSelectedTool] = useState(EditorTools.None);
    useDebounce(() => {
        if (!opened) {
            const tool = new Tools.None();
            worldEditorConnector.setToolType(tool);
            return;
        }
        if (selectedTool === EditorTools.Pen) {
            switch (placeKind) {
            case PlaceKind.Tile: {
                if (placeObjectType === Server.GameObjectType.Wall) throw new Error("Wall is not supported in atlas");
                const [atlasId, atlasIndex] = photoId.split("_");
                const atlas = atlasMap[atlasId];
                const type = placeObjectType === Server.GameObjectType.Floor ? Server.TileType.Floor : Server.TileType.Effect;
                if (!atlas) {
                    return;
                }
                const tool = new Tools.Tile({
                    atlas, 
                    atlasIndex: +atlasIndex,
                    type,
                });
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Object: {
                const protoId = +photoId;
                const proto = protoMap[protoId];
                if (!proto) {
                    const tool = new Tools.None();
                    worldEditorConnector.setToolType(tool);
                    return;
                }
                const tool = new Tools.ImageGameObject(proto);
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Iframe: {
                const tool = new Tools.IframeGameObject({
                    src: iframeSrc,
                    width: +iframeWidth,
                    height: +iframeHeight,
                    isPublic: true,
                    offsetX: 0,
                    offsetY: 0,
                    name: `${iframeSrc}_instantIframe`,
                    type: placeObjectType,
                });
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Collider: {
                const tool = new Tools.Collider();
                worldEditorConnector.setToolType(tool);
                break;
            }
            }
        }
        else if (selectedTool === EditorTools.Eraser) {
            switch (placeKind) {
            case PlaceKind.Tile: {
                if (placeObjectType === Server.GameObjectType.Wall) throw new Error("Wall is not supported in atlas");
                const type = placeObjectType === Server.GameObjectType.Floor ? Server.TileType.Floor : Server.TileType.Effect;
                const tool = new Tools.EraseTile(type);
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Object: {
                const tool = new Tools.EraseImageObject();
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Iframe: {
                const tool = new Tools.EraseIframeObject(placeObjectType);
                worldEditorConnector.setToolType(tool);
                break;
            }
            case PlaceKind.Collider: {
                const tool = new Tools.EraseCollider();
                worldEditorConnector.setToolType(tool);
                break;
            }
            }
        }
    }, 100, [
        atlasMap,
        photoId,
        placeKind,
        placeObjectType,
        protoMap,
        selectedTool,
        worldEditorConnector,
        // react to input
        iframeHeight,
        iframeWidth,
        iframeSrc,
        selectedTool,
        placeKind,
        placeObjectType,
        opened,
    ]);

    const onSelectTool = useCallback((editorTool: EditorTools) => {
        setSelectedTool(editorTool);
    }, [setSelectedTool]);


    useEffect(() => {
        if (myImageGameObjectProtos.error) throw myImageGameObjectProtos.error;
    }, [
        myImageGameObjectProtos.error
    ]);


    useEffect(() => {
        if (tab === Tabs.Tile) {
            setPlaceKind(PlaceKind.Tile);
            setWallSelectable(false);
            setFloorSelectable(true);
            setEffectSelectable(true);
            setPlaceObjectType(Server.GameObjectType.Floor);
        }
        else if (tab === Tabs.Object) {
            setPlaceKind(PlaceKind.Object);
            setWallSelectable(false);
            setFloorSelectable(false);
            setEffectSelectable(false);
            const protoId = +photoId;
            const proto = protoMap[protoId];
            if (!proto) return;
            setPlaceObjectType(proto.type);
        }
    }, [tab, photoId, protoMap]);


    const onTabListPhotoSet = useCallback((photoId: string) => {
        setPhotoId(photoId);
        setSelectedTool(EditorTools.Pen);
    }, []);

    const onSetTab = useCallback((tab: DualTabType) => {
        setTab(tab);
    }, []);

    const onRemoveBtnClick = useCallback(async () => {
        if (tab === Tabs.Object) {
            const protoId = +photoId;
            const proto = protoMap[protoId];
            if (!proto) {
                return;
            }
            if(!confirm("are you sure?")) return;
            removeImageGameObjectProto({
                variables: {
                    id: protoId,
                }
            });
        }
        else if (tab === Tabs.Tile) {
            const [atlasId, _] = photoId.split("_");
            const atlas = atlasMap[atlasId];
            if (!atlas) {
                return;
            }
            if(!confirm("are you sure?")) return;
            deleteAtlas({
                variables: {
                    atlasId: +atlasId,
                }
            });
        }
        await apolloClient.resetStore();
        await myImageGameObjectProtos.refetch();
        await myAtlases.refetch();
    }, [
        photoId, 
        removeImageGameObjectProto, 
        tab,
        atlasMap,
        deleteAtlas,
        myImageGameObjectProtos,
        protoMap,
        myAtlases,
        apolloClient,
    ]);


    const [wallSelectable, setWallSelectable] = useState(false);
    const [floorSelectable, setFloorSelectable] = useState(true);
    const [effectSelectable, setEffectSelectable] = useState(true);
    const unselectable = useMemo(() => (
        !wallSelectable && !floorSelectable && !effectSelectable
    ), [effectSelectable, floorSelectable, wallSelectable]);

    const onPlaceKindSelect = useCallback((type: PlaceKind) => {
        setPlaceKind(type);
        if (type === PlaceKind.Collider) {
            setWallSelectable(false);
            setFloorSelectable(false);
            setEffectSelectable(false);
        }
        else if (type === PlaceKind.Tile) {
            setWallSelectable(false);
            setFloorSelectable(true);
            setEffectSelectable(true);
            setPlaceObjectType(Server.GameObjectType.Floor);
        }
        else if (type === PlaceKind.Object) {
            setWallSelectable(false);
            setFloorSelectable(false);
            setEffectSelectable(false);
        }
        else if (type === PlaceKind.Iframe) {
            setWallSelectable(true);
            setFloorSelectable(true);
            setEffectSelectable(true);
        }
    }, []);

    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    const onIframeBlur = useCallback(() => {
        onBlur();
        if (iframeSrc === "") {
            return;
        }
        else if (!(/^(http(s?)):\/\//.test(iframeSrc))) {
            alert("iframe src must start with http(s)://");
            setIframeSrc("");
        }
    }, [onBlur, iframeSrc]);

    return (
        <ExpandBarDiv opened={opened}>
            <Container>
                <DualTabList datas={datas} setId={onTabListPhotoSet} id={photoId} tab={tab} setTab={onSetTab} tabNames={tabNames}/>
                <IframeInputWrapper>
                    <IframeTitle>Iframe Address</IframeTitle>
                    <ListFakeHr />
                    <IframeInput type="text" placeholder="Add iframe address" value={iframeSrc} onChange={e => setIframeSrc(e.target.value)} onFocus={onFocus} onBlur={onIframeBlur} />
                    <ListFakeHr />
                    <IframeInputSettingWrapper>
                        <span style={{marginRight: "auto", opacity: "0"}}>
                            Upload
                        </span>
                        <IframeSettingLeftInput label="W" value={iframeWidth} onChange={e => isSafeNum(+e.target.value) && setIframeWidth(e.target.value)} />
                        <IframeSettingLeftInput label="H" value={iframeHeight} onChange={e => isSafeNum(+e.target.value) && setIframeHeight(e.target.value)} />
                        <span style={{marginLeft: "auto"}}>
                            <STYLED_LINK to="/upload" target="_blank" rel="noopener noreferrer">
                                Upload
                            </STYLED_LINK>
                        </span>
                    </IframeInputSettingWrapper>
                </IframeInputWrapper>
                <PlaceModeInputWrapper>
                    <PlaceModeTitle>Place Mode</PlaceModeTitle>
                    <ListFakeHr />
                    <PlaceModeLayerSelect>
                        <PlaceModeBottomText
                            selected={placeKind === PlaceKind.Tile}
                            onClick={() => onPlaceKindSelect(PlaceKind.Tile)}
                        >
                            tile
                        </PlaceModeBottomText>
                        <LittleVerticalLine />
                        <PlaceModeBottomText
                            selected={placeKind === PlaceKind.Object}
                            onClick={() => onPlaceKindSelect(PlaceKind.Object)}
                        >
                            object
                        </PlaceModeBottomText>
                        <LittleVerticalLine />
                        <PlaceModeBottomText
                            selected={placeKind === PlaceKind.Iframe}
                            onClick={() => onPlaceKindSelect(PlaceKind.Iframe)}
                        >
                            iframe
                        </PlaceModeBottomText>
                        <LittleVerticalLine />
                        <PlaceModeBottomText
                            selected={placeKind === PlaceKind.Collider}
                            onClick={() => onPlaceKindSelect(PlaceKind.Collider)}
                        >
                            collider
                        </PlaceModeBottomText>
                    </PlaceModeLayerSelect>
                    <ListFakeHr />
                    <PlaceModeLayerSelect>
                        <IframeInputSettingRightText
                            selected={!unselectable && placeObjectType === Server.GameObjectType.Wall}
                            selectable={!unselectable && wallSelectable}
                            onClick={() => wallSelectable && setPlaceObjectType(Server.GameObjectType.Wall)}
                        >
                            wall
                        </IframeInputSettingRightText>
                        <LittleVerticalLine />
                        <IframeInputSettingRightText
                            selected={!unselectable && placeObjectType === Server.GameObjectType.Floor}
                            selectable={!unselectable && floorSelectable}
                            onClick={() => floorSelectable && setPlaceObjectType(Server.GameObjectType.Floor)}
                        >
                            floor
                        </IframeInputSettingRightText>
                        <LittleVerticalLine />
                        <IframeInputSettingRightText
                            selected={!unselectable && placeObjectType === Server.GameObjectType.Effect}
                            selectable={!unselectable && effectSelectable}
                            onClick={() => effectSelectable && setPlaceObjectType(Server.GameObjectType.Effect)}
                        >
                            effect
                        </IframeInputSettingRightText>
                    </PlaceModeLayerSelect>
                </PlaceModeInputWrapper>
            </Container>
            <ToolsWrapper selected={selectedTool}>
                <PenTool onClick={() => onSelectTool(EditorTools.Pen)} />
                <EraseTool onClick={() => onSelectTool(EditorTools.Eraser)} />
                <Trashcan style={{
                    marginLeft: "auto", 
                    marginRight: "18px"
                }} onClick={onRemoveBtnClick} />
            </ToolsWrapper>
        </ExpandBarDiv>
    );
}

export default React.memo(WorldEditorInner);

const IframeSettingLeftInputWrapper = styled.div`
    width: 70px;
    height: 27px;

    display: flex;

    margin: 10px;

    border-radius: 13.5px;
    filter: drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.12));
`;

const IframeSettingLeftInputLabel = styled.span`
    width: 30px;
    height: 27px;
    line-height: 27px;

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

const IframeSettingLeftInputArea = styled.input`
    width: calc(100% - 30px);
    height: 27px;
    line-height: 27px;

    box-sizing: border-box;

    border: none;
    outline: none;

    background-color: #FFFFFB;

    border-radius: 0px 13.5px 13.5px 0px;
`;

interface IframeSettingLeftInputProps {
    label: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>
}

function IframeSettingLeftInput({label, value, onChange}: IframeSettingLeftInputProps) {
    const {game} = useContext(WorldEditorContext);

    const onFocus = useCallback(() => {
        game?.inputHandler.stopHandleEvents();
    }, [game]);

    const onBlur = useCallback(() => {
        game?.inputHandler.startHandleEvents();
    }, [game]);

    return (
        <IframeSettingLeftInputWrapper>
            <IframeSettingLeftInputLabel>
                {label} :
            </IframeSettingLeftInputLabel>
            <IframeSettingLeftInputArea onChange={onChange} onFocus={onFocus} onBlur={onBlur} value={value} />
        </IframeSettingLeftInputWrapper>
    );
}

import React, { useEffect, useRef } from "react";
import styled from "styled-components";
// import { Game } from "../../../game/engine/Game";
// import { EditorInfoObject, TileEditorBootstraper } from "./TileEditorBootstraper";

const DrawArea = styled.div`
    width: 427px;
    height: 390px;

    margin: 0px 18px 18px 18px;

    border-radius: 23px;

    box-shadow: 5px 5px 20px 0px #00000012; 
    background-color: #FFFFFF;
`

function TileEditor() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) throw new Error("divRef.current is null");
        // const game = new Game(divRef.current);
        // game.run(TileEditorBootstraper, new EditorInfoObject(divRef.current));
        // game.inputHandler.startHandleEvents();
    });

    return (
        <>
            <DrawArea ref={divRef}>
            </DrawArea>
        </>
    );
}

export default TileEditor;
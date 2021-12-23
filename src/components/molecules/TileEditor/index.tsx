import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Game } from "../../../game/engine/Game";
import { EditorInfoObject, TileEditorBootstraper } from "./TileEditorBootstraper";

const DrawArea = styled.div`
    width: 427px;
    height: 390px;

    overflow-y: scroll;
    overflow-x: scroll;

    margin: 0px 18px 18px 18px;

    border-radius: 23px;

    box-shadow: 5px 5px 20px 0px #00000012; 
    background-color: #FFFFFF;

    
    & > div {
        background-image:
          repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
          repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%);
        background-size: 71px 71px;
        
    }
`

function TileEditor() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) throw new Error("divRef.current is null");
        const game = new Game(divRef.current);
        game.run(TileEditorBootstraper, new EditorInfoObject(divRef.current));
        game.inputHandler.startHandleEvents();
    });

    return (
        <>
            <DrawArea ref={divRef}>
                <div style={{width: '1000px', height: '1000px'}}>

                </div>
            </DrawArea>
        </>
    );
}

export default TileEditor;
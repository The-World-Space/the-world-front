import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { Game, GameStateKind } from "the-world-engine";

import { ObjEditorContext } from "../../../context/contexts";
import { TileEditorBootstrapper } from "./TileEditorBootstrapper";

const DrawArea = styled.div`
    width: 427px;
    height: calc(100% - 124px);

    overflow: hidden;

    margin: 0px 0px 18px 0px;

    border-radius: 23px;

    box-shadow: 5px 5px 20px 0px #00000012; 
    background-color: #FFFFFF;
`;

interface TileEditorProps {
    opened: boolean;
}

function TileEditor({ opened }: TileEditorProps): JSX.Element {
    const divRef = useRef<HTMLDivElement>(null);
    const {game, setGame, objEditorConnector} = useContext(ObjEditorContext);
    
    useEffect(() => {
        if (!divRef.current) throw new Error("divRef.current is null");
        const game = new Game(divRef.current);
        game.run(TileEditorBootstrapper, objEditorConnector);
        divRef.current.onmouseenter = () => game.inputHandler.startHandleEvents();
        divRef.current.onmouseleave = () => game.inputHandler.stopHandleEvents();
        divRef.current.onwheel = e => e.preventDefault();
        divRef.current.onmousedown = e => e.preventDefault();
        setGame(game);

        return () => {
            game.dispose();
        };
    }, [setGame, objEditorConnector]);

    useEffect(() => {
        if (!game) return;
        if (!opened && game.currentGameState === GameStateKind.Running) {
            game.stop();
        } else if (opened && game.currentGameState === GameStateKind.Stopped) {
            game.resume();
        }
    });

    return (
        <DrawArea ref={divRef}>
        </DrawArea>
    );
}

export default TileEditor;

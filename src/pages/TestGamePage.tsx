import { useEffect, useRef } from "react";
import { Game } from "the-world-engine";

import { TileEditorBootstrapper } from "../components/molecules/TileEditor/TileEditorBootstrapper";

function TestGamePage(): JSX.Element {
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => { //on component mounted
        if (!div.current) throw new Error("div is null");
        const game = new Game(div.current);
        game.run(TileEditorBootstrapper);
        game.inputHandler.startHandleEvents();

        return () => { //on component unmount
            game.dispose();
        };
    }, []);

    return (<div style = {{height: "100%", width: "100%"}} ref={div}/>);
}

export default TestGamePage;

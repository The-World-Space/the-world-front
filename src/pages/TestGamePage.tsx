import { useCallback, useEffect, useRef } from 'react';
import { TestBootstrapper } from '../game/TestBootstrapper';
import { Game } from '../game/engine/Game';

function TestGamePage() {
    let game = useRef<Game>(null);
    let div = useRef<HTMLDivElement>(null);

    const onWindowResize = useCallback(() => {
        if (div.current) game.current?.resizeFramebuffer(div.current.offsetWidth, div.current.offsetHeight);
    }, [div, game]);

    useEffect( () => { //on mount component
        window.addEventListener("resize", onWindowResize);

        if (!div.current) throw new Error("div is null");
        game = new Game(div.current, div.current.offsetWidth, div.current.offsetHeight);
        game.run(TestBootstrapper);
        game.inputHandler.startHandleEvents();
    }, [onWindowResize]);

    useEffect( () => () => { //on unmount component
        window.removeEventListener("resize", onWindowResize);
        game?.dispose();
    }, [onWindowResize, game]);

    return (<div style = {{height: "100%", width: "100%"}} ref={div}/>);
}

export default TestGamePage;

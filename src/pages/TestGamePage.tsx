import { useEffect, useRef } from 'react';
import { TestBootstrapper } from '../game/TestBootstrapper';
import { Game } from '../game/engine/Game';

function TestGamePage() {
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => { //on mount component
        if (!div.current) throw new Error("div is null");
        const game = new Game(div.current!, div.current!.offsetWidth, div.current!.offsetHeight);
        game.run(TestBootstrapper);
        game.inputHandler.startHandleEvents();

        function onWindowResize() {
            if (div.current) game?.resizeFramebuffer(div.current.offsetWidth, div.current.offsetHeight);
        }

        window.addEventListener("resize", onWindowResize);
        return () => { //on unmount component
            window.removeEventListener("resize", onWindowResize);
            game?.dispose();
        };
    }, []);

    return (<div style = {{height: "100%", width: "100%"}} ref={div}/>);
}

export default TestGamePage;

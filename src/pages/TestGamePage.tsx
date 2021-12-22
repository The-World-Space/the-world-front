import { useEffect, useRef } from 'react';
import { TestBootstrapper } from '../game/TestBootstrapper';
import { Game } from '../game/engine/Game';

function TestGamePage() {
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => { //on component mounted
        if (!div.current) throw new Error("div is null");
        const game = new Game(div.current);
        game.run(TestBootstrapper);
        game.inputHandler.startHandleEvents();

        return () => { //on component unmount
            game.dispose();
        };
    }, []);

    return (<div style = {{height: "100%", width: "100%"}} ref={div}/>);
}

export default TestGamePage;

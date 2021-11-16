import { Character } from "../../core/Character/Character";
import { Physics } from "../../core/Physics/Physics";
import { Renderer } from "../../core/Renderer/Renderer";
import { Going } from "../../core/types/Base";


export class Controler {
    private _physics: Physics;
    private _character: Character<any>;
    private _eventTarget: HTMLElement;
    private _renderer: Renderer;

    private _blocked: boolean;

    constructor(physics: Physics, renderer: Renderer, eventDom: HTMLElement, character: Character<any>) {
        this._physics = physics;
        this._eventTarget = eventDom;
        this._character = character;
        this._renderer = renderer;
        
        this._blocked = false;

        this._bindEvent();
    }

    private _bindEvent() {
        this._eventTarget.addEventListener('keydown', this._onKeyDown.bind(this));
        this._eventTarget.addEventListener('keyup', this._onKeyUp.bind(this));
    }


    private _onKeyDown(event: KeyboardEvent) {
        if (this._blocked) return;

        const going = this._going(event);

        if (going !== null) {
            const nextPos = this._physics.nextPosition(this._character.getPosition(), going);

            this._character.setPosition(nextPos);
            this._blocked = true;
            this._renderer.updateOne(this._character);
            setTimeout(() => this._blocked = false, 500);
        }
    }

    private _onKeyUp(event: KeyboardEvent) {
        if (this._blocked) return true;
    }

    private _going(event: KeyboardEvent) {
        const key = event.key;
        let going = null;
        
        switch (key) {
            case 'a':
            case 'A':
                going = Going.left;
                break;
            case 'w':
            case 'W':
                going = Going.up;
                break;
            case 'd':
            case 'D':
                going = Going.right;
                break;
            case 's':
            case 'S':
                going = Going.down;
                break;
        }

        console.debug("going", going);  
        return going;
    }

    
}
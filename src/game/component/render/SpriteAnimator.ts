import { Component } from "../../engine/hierarchyObject/Component";
import { ComponentConstructor } from "../../engine/hierarchyObject/ComponentConstructor";
import { CssSpriteRenderer } from "./CssSpriteRenderer";

export class SpriteAnimator extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [CssSpriteRenderer];
    
    private _spriteRenderer?: CssSpriteRenderer;
    private _animations: { [key: string]: HTMLImageElement[] } = {};

    protected start(): void {

    }
    
    public update(): void {

    }
    
    public addAnimation(name: string, animationFrames: HTMLImageElement[]): void {
        this._animations[name] = animationFrames;
    }
}
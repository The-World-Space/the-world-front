import { Component } from "../../engine/hierarchyObject/Component";
import { ComponentConstructor } from "../../engine/hierarchyObject/ComponentConstructor";
import { CssSpriteAtlasRenderer } from "./CssSpriteAtlasRenderer";

export class SpriteAtlasAnimator extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [CssSpriteAtlasRenderer];
    
    private _spriteAtlasRenderer: CssSpriteAtlasRenderer|null = null;
    private _animations: { [key: string]: number[] } = {};
    private _playingAnimationName: string|null = null;
    private _playingAnimation: number[]|null = null;
    private _playingAnimationFrame: number = 0;
    private _playing: boolean = false;
    private _frameDuration: number = 2;
    private _currentFrameDuration: number = 0;
    
    protected start(): void {
        this._spriteAtlasRenderer = this.gameObject.getComponent(CssSpriteAtlasRenderer);
    }
    
    public update(): void {
        if (this._spriteAtlasRenderer === null) return;
        if (!this._playing) return;

        this._currentFrameDuration += this.gameManager.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame++;
            if (this._playingAnimationFrame >= this._playingAnimation!.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteAtlasRenderer!.imageIndex = this._playingAnimation![this._playingAnimationFrame];
        }
    }

    public playAnimation(name: string): void {
        if (this._spriteAtlasRenderer === null) return;

        if (this._playingAnimationName === name) return;

        this._playingAnimationName = name;
        this._playingAnimation = this._animations[name];
        this._playingAnimationFrame = 0;
        this._spriteAtlasRenderer!.imageIndex = this._animations[name][0];
        this._playing = true;
    }

    public stopAnimation(): void {
        if (this._spriteAtlasRenderer === null) return;
        this._playing = false;
    }
    
    public addAnimation(name: string, animationFrames: number[]): void {
        if (animationFrames.length === 0) {
            console.warn(`Animation "${name}" has no frames.`);
            return;
        }
        this._animations[name] = animationFrames;
    }

    public get frameDuration(): number {
        return this._frameDuration;
    }

    public set frameDuration(value: number) {
        this._frameDuration = value;
    }
}

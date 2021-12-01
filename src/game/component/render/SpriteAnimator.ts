import { Component } from "../../engine/hierarchyObject/Component";
import { ComponentConstructor } from "../../engine/hierarchyObject/ComponentConstructor";
import { CssSpriteRenderer } from "./CssSpriteRenderer";

export class SpriteAnimator extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [CssSpriteRenderer];
    
    private _spriteRenderer: CssSpriteRenderer|null = null;
    private _animations: { [key: string]: string[] } = {};
    private _playingAnimationName: string|null = null;
    private _playingAnimation: string[]|null = null;
    private _playingAnimationFrame: number = 0;
    private _playing: boolean = false;
    private _frameDuration: number = 2;
    private _currentFrameDuration: number = 0;
    
    protected start(): void {
        this._spriteRenderer = this.gameObject.getComponent(CssSpriteRenderer);
    }
    
    public update(): void {
        if (!this._playing) return;

        this._currentFrameDuration += this.gameManager.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame++;
            if (this._playingAnimationFrame >= this._playingAnimation!.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteRenderer!.imagePath = this._playingAnimation![this._playingAnimationFrame];
        }
    }

    public playAnimation(name: string): void {
        if (this._spriteRenderer === null) return;
        if (this._playingAnimationName === name) return;

        this._playingAnimationName = name;
        this._playingAnimation = this._animations[name];
        this._playingAnimationFrame = 0;
        this._spriteRenderer!.imagePath = this._animations[name][0];
        this._playing = true;
    }

    public stopAnimation(): void {
        if (this._spriteRenderer === null) return;
        this._playing = false;
    }
    
    public addAnimation(name: string, animationFrames: string[]): void {
        if (animationFrames.length === 0) {
            console.warn(`Animation "${name}" has no frames.`);
            return;
        }
        this._animations[name] = animationFrames;
    }

    public addAnimationFromPath(name: string, animationFrames: string[]): void {
        const animationFramesArray: HTMLImageElement[] = [];
        for (const frame of animationFrames) {
            const image = document.createElement("img");
            image.style.imageRendering = "pixelated";
            image.src = frame;
            animationFramesArray.push(image);
        }
        this.addAnimation(name, animationFrames);
    }

    public get frameDuration(): number {
        return this._frameDuration;
    }

    public set frameDuration(value: number) {
        this._frameDuration = value;
    }
}

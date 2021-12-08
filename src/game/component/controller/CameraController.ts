import { Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { Camera } from "../render/Camera";

export class CameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    private _trackTarget: GameObject|null = null;
    private _cameraDistanceOffset: number = 200;
    private _pixelPerfectUnit: number = 1;
    private _pixelPerfect: boolean = false;
    private _lerpTrack: boolean = false;
    private _lerpAlpha: number = 0.1;

    protected start(): void {
        if (this._trackTarget) {
            const targetPosition = this._trackTarget.getWorldPosition(this._tempVector);
            targetPosition.z += this._cameraDistanceOffset;
            this.gameObject.parent!.worldToLocal(targetPosition);
            this.gameObject.position.copy(targetPosition);
        }
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        const targetPosition = this._trackTarget!.getWorldPosition(this._tempVector);
        targetPosition.z += this._cameraDistanceOffset;
        this.gameObject.parent!.worldToLocal(targetPosition);
        if (this._lerpTrack) {
            this.gameObject.position.lerp(targetPosition, 0.1);
        } else {
            this.gameObject.position.copy(targetPosition);
        }

        if (this._pixelPerfect) {
            this.gameObject.position.x = Math.round(this.gameObject.position.x / this._pixelPerfectUnit) * this._pixelPerfectUnit;
            this.gameObject.position.y = Math.round(this.gameObject.position.y / this._pixelPerfectUnit) * this._pixelPerfectUnit;
        }
    }

    public setTrackTarget(target: GameObject): void {
        this._trackTarget = target;
    }

    public get cameraDistanceOffset(): number {
        return this._cameraDistanceOffset;
    }

    public set cameraDistanceOffset(value: number) {
        this._cameraDistanceOffset = value;
    }

    public get pixelPerfectUnit(): number {
        return this._pixelPerfectUnit;
    }

    public set pixelPerfectUnit(value: number) {
        this._pixelPerfectUnit = value;
    }

    public get pixelPerfect(): boolean {
        return this._pixelPerfect;
    }

    public set pixelPerfect(value: boolean) {
        this._pixelPerfect = value;
    }

    public get lerpTrack(): boolean {
        return this._lerpTrack;
    }

    public set lerpTrack(value: boolean) {
        this._lerpTrack = value;
    }

    public get lerpAlpha(): number {
        return this._lerpAlpha;
    }

    public set lerpAlpha(value: number) {
        this._lerpAlpha = value;
    }
}

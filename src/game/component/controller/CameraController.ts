import { Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";

export class CameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _camera: THREE.Camera|null = null;
    private _trackTarget: GameObject|null = null;
    private _cameraDistanceOffset: number = 200;
    private _pixelPerfectUnit: number = 1;
    private _pixelPerfect: boolean = false;
    private _lerpTrack: boolean = false;
    private _lerpAlpha: number = 0.1;

    protected start(): void {
        this._camera = this.gameManager.camera;
        if (this._trackTarget) {
            this._tempVector.copy(this._trackTarget?.position ?? new Vector3());
            this._tempVector.z += this._cameraDistanceOffset;
            this._camera!.position.copy(this._tempVector);
        }
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        this._tempVector.copy(this._trackTarget?.position ?? new Vector3());
        this._tempVector.z += this._cameraDistanceOffset;
        if (this._lerpTrack) {
            this._camera!.position.lerp(this._tempVector, 0.1);
        } else {
            this._camera!.position.copy(this._tempVector);
        }

        if (this._pixelPerfect) {
            this._camera!.position.x = Math.round(this._camera!.position.x / this._pixelPerfectUnit) * this._pixelPerfectUnit;
            this._camera!.position.y = Math.round(this._camera!.position.y / this._pixelPerfectUnit) * this._pixelPerfectUnit;
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

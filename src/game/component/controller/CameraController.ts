import { Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { GameObject } from "../../engine/hierarchy_object/GameObject";

export class CameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _camera: THREE.Camera|null = null;
    private _trackTarget: GameObject|null = null;
    private _cameraDistanceOffset: number = 50;
    private _pixelPerfectUnit: number = 1;
    private _pixelPerfect: boolean = false;
    private _lerpTrack: boolean = false;

    protected start(): void {
        this._camera = this.gameManager.camera;
    }

    public update(): void {
        if (this._lerpTrack) {
            this._camera!.position.copy(this._camera!.position.lerp(this._trackTarget?.position ?? new Vector3(), 0.1));
        } else {
            this._camera!.position.copy(this._trackTarget?.position ?? new Vector3());
        }
        this._camera!.position.z += this._cameraDistanceOffset;
        
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
}

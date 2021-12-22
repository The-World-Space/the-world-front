import * as THREE from "three";

export class CameraContainer {
    private _camera: THREE.Camera|null = null;
    private _currentCameraPriority: number = Number.MIN_SAFE_INTEGER;
    private _cameraList: {priority: number, camera: THREE.Camera}[] = [];

    public get camera(): THREE.Camera|null {
        return this._camera;
    }

    public get currentCameraPriority(): number {
        return this._currentCameraPriority;
    }

    public addCamera(camera: THREE.Camera, priority: number): void {
        this._cameraList.push({priority, camera});
        this._cameraList.sort((a, b) => a.priority - b.priority);
        this.setCamera();
    }

    public removeCamera(camera: THREE.Camera): void {
        this._cameraList = this._cameraList.filter(c => c.camera !== camera);
        this.setCamera();
    }

    public changeCameraPriority(camera: THREE.Camera, priority: number): void {
        const index = this._cameraList.findIndex(c => c.camera === camera);
        if (index !== -1) {
            this._cameraList[index].priority = priority;
            this._cameraList.sort((a, b) => a.priority - b.priority);
            this.setCamera();
        }
    }

    private setCamera(): void {
        if (this._cameraList.length === 0) {
            this._camera = null;
            return;
        }

        const camera = this._cameraList[0].camera;
        this._camera = camera;
        this._currentCameraPriority = this._cameraList[0].priority;
    }
}

import { Quaternion, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";

export class SpriteAtlasInstance {
    private _atlasIndex: number;
    private _position: Vector3;
    private _rotation?: Quaternion;
    private _scale?: Vector3;

    public constructor(
        atlasIndex: number,
        position: Vector3, 
        rotation?: Quaternion,
        scale?: Vector3
    ) {
        this._atlasIndex = atlasIndex;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
    }
    
    public get atlasIndex(): number {
        return this._atlasIndex;
    }

    public get position(): Vector3 {
        return this._position.clone();
    }

    public get rotation(): Quaternion|undefined {
        return this._rotation?.clone();
    }

    public get scale(): Vector3|undefined {
        return this._scale?.clone();
    }
}

export class SpriteStaticInstancer extends Component {
    private _imageSource: string = `${process.env.PUBLIC_URL}/assets/tilemap/default.png`;
    private _useZaxisSorter: boolean = false;
    private _rowCount: number = 1;
    private _columnCount: number = 1;
    private _imageWidth: number = 0;
    private _imageHeight: number = 0;

    private _initializeFunction: (() => void)|null = null;

    protected start(): void {
        this._initializeFunction?.call(this);
    }

    public setInstances(instances: SpriteAtlasInstance[]) {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => this.setInstances(instances);
            return;
        }

        const instantlater = this.gameManager.instantlater;
        for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];

            const spriteBuilder = instantlater.buildGameObject(
                `${this.gameObject.name}_instance_${i}`,
                instance.position,
                instance.rotation,
                instance.scale)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.setImage(this._imageSource, this._rowCount, this._columnCount);
                    // c.imageWidth = instance.;
                    // c.imageHeight = instance.height;
                });
            
            if (this._useZaxisSorter) {
                spriteBuilder.withComponent(ZaxisSorter);
            } else {
                spriteBuilder.withComponent(ZaxisInitializer);
            }

            this.gameObject.addChildFromBuilder(spriteBuilder);
        }
        this.gameObject.removeComponent(this);
    }

    public get imageSource(): string {
        return this._imageSource;
    }

    public set imageSource(value: string) {
        this._imageSource = value;
    }

    public get useZindexSorter(): boolean {
        return this._useZaxisSorter;
    }

    public set useZindexSorter(value: boolean) {
        this._useZaxisSorter = value;
    }
}

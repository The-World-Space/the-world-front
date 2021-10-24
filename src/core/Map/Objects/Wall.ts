import { GameObject } from "../../types/GameObject";
import { DomShape } from "../../types/Shape/DomShape";
import { ImageShape } from "../../types/Shape/ImageShape";

export class Wall extends GameObject {

}

export class ImageWall extends Wall {
    _shape!: ImageShape;
}

export class IframeWall extends Wall {
    _shape!: DomShape;
}
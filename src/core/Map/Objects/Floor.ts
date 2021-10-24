import { GameObject } from "../../types/GameObject";
import { DomShape } from "../../types/Shape/DomShape";
import { ImageShape } from "../../types/Shape/ImageShape";

export class Floor extends GameObject {

}

export class ImageFloor extends Floor {
    _shape!: ImageShape;
}

export class IframeFloor extends Floor {
    _shape!: DomShape;
}
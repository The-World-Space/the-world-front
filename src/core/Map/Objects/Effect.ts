import { GameObject } from "../../types/GameObject";
import { DomShape } from "../../types/Shape/DomShape";
import { ImageShape } from "../../types/Shape/ImageShape";

export class Effect extends GameObject {

}

export class ImageEffect extends Effect {
    _shape!: ImageShape;
}

export class IframeEffect extends Effect {
    _shape!: DomShape;
}
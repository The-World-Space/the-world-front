import { Size } from "../Base";
import { Shape } from "./Shape";

export class ImageShape extends Shape {
    _imageUrl!: string;

    constructor(size: Size, startImageUrl: string) {
        super(size);
        this.setImageUrl(startImageUrl);
    }

    getImageUrl() {
        return this._imageUrl;
    }

    setImageUrl(imageUrl: string) {
        this._imageUrl = imageUrl;
    }
}
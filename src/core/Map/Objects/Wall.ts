import { Point } from "../../types/Base";
import { GameObject } from "../../types/GameObject";
import { DomShape } from "../../types/Shape/DomShape";
import { ImageShape } from "../../types/Shape/ImageShape";

export class Wall extends GameObject {
    
    setPosition(pos: Point) {
        pos.y -= this.getShape().getSize().height - 1
        super.setPosition(pos);
    }
}

import { Component } from "../../engine/hierarchy_object/Component";
import { ComponentConstructor } from "../../engine/hierarchy_object/ComponentConstructor";
import { SpriteAtlasAnimator } from "../render/SpriteAtlasAnimator";
import { Direction, Directionable } from "./Directionable";

export class MovementAnimationController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Directionable, SpriteAtlasAnimator];

    private directionable: Directionable|null = null;
    private spriteAtlasAnimator: SpriteAtlasAnimator|null = null;
    private lastDirection: Direction = Direction.None;

    protected start(): void {
        this.directionable = this.gameObject.getComponent(Directionable);
        this.spriteAtlasAnimator = this.gameObject.getComponent(SpriteAtlasAnimator);
    }

    public update(): void {
        const direction = this.directionable!.direction;
        if (direction === Direction.Up) {
            this.spriteAtlasAnimator!.playAnimation("up_walk");
            this.lastDirection = Direction.Up;
        } else if (direction === Direction.Down) {
            this.spriteAtlasAnimator!.playAnimation("down_walk");
            this.lastDirection = Direction.Down;
        } else if (direction === Direction.Left) {
            this.spriteAtlasAnimator!.playAnimation("left_walk");
            this.lastDirection = Direction.Left;
        } else if (direction === Direction.Right) {
            this.spriteAtlasAnimator!.playAnimation("right_walk");
            this.lastDirection = Direction.Right;
        } else if (direction === Direction.None) {
            if (this.lastDirection === Direction.Up) {
                this.spriteAtlasAnimator!.playAnimation("up_idle");
            } else if (this.lastDirection === Direction.Down) {
                this.spriteAtlasAnimator!.playAnimation("down_idle");
            } else if (this.lastDirection === Direction.Left) {
                this.spriteAtlasAnimator!.playAnimation("left_idle");
            } else if (this.lastDirection === Direction.Right) {
                this.spriteAtlasAnimator!.playAnimation("right_idle");
            }
        }
    }
}

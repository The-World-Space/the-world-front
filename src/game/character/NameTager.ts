import { Effect } from "../../core/Map/Objects/Effect";
import { MOVING_MS, PIXELSIZE, Renderer } from "../../core/Renderer/Renderer";
import { Point } from "../../core/types/Base";
import { DomShape } from "../../core/types/Shape/DomShape";
import { Human } from "./Human";


export class NameTagger {
    private _renderer: Renderer;
    private _humanNametagMap: Map<Human, Effect> = new Map();

    constructor(renderer: Renderer) {
        this._renderer = renderer;
        this._humanNametagMap = new Map();
    }

    static optimizedPos(pos: Point, width: number) {
        return {
            x: pos.x - width / 2 + 0.5,
            y: pos.y - 1.7
        };
    }

    static makeNameTag(nickname: string): [number, number, HTMLSpanElement] {
        const nameTag = document.createElement("span");
        nameTag.innerText = nickname;
        nameTag.style.visibility = 'hidden';
        nameTag.style.position = 'absolute';
        document.body.appendChild(nameTag);
        const width = nameTag.clientWidth / PIXELSIZE;
        const height = nameTag.clientHeight / PIXELSIZE;
        document.body.removeChild(nameTag);
        nameTag.style.visibility = 'visible';
        nameTag.style.transition = `all ${MOVING_MS}ms`;
        nameTag.style.transitionTimingFunction = "linear";

        return [width, height, nameTag];
    }

    addNameTag(human: Human, nickname: string) {
        const [width, height, nameTag] = NameTagger.makeNameTag(nickname);

        const pos = NameTagger.optimizedPos(human.getPosition(), width);
        
        const nameTagShape = new DomShape({width, height}, nameTag);
        const nameTagEffect = new Effect(nameTagShape);
        
        nameTagEffect.setPosition(human.getPosition());
        
        this._humanNametagMap.set(human, nameTagEffect);
        this._renderer.drawEffect(nameTagEffect);
    }


    changeName(human: Human, nickname: string) {
        const nameTagEffect = this._humanNametagMap.get(human);
        if (!nameTagEffect) throw new Error("human not found or wrong shape");
        const nameTagShape = nameTagEffect.getShape();
        if (!(nameTagShape instanceof DomShape)) throw new Error("wrong shape");

        const [width, height, nameTag] = NameTagger.makeNameTag(nickname);

        this._renderer.removeOne(nameTagEffect);
        nameTagShape.setDom(nameTag);
        nameTagShape.setSize({width, height});
        this._renderer.drawEffect(nameTagEffect);
    }


    moveNameTag(human: Human, pos?: Point) {
        const nameTagEffect = this._humanNametagMap.get(human);
        
        if (nameTagEffect) {
            const newPos = NameTagger.optimizedPos(pos || human.getPosition(), nameTagEffect.getShape().getSize().width);

            nameTagEffect.setPosition(newPos);
            this._renderer.updateOne(nameTagEffect);
        }

    }

    removeNameTag(human: Human) {
        const nameTagEffect = this._humanNametagMap.get(human);
        if (nameTagEffect) {
            this._renderer.removeOne(nameTagEffect);
            this._humanNametagMap.delete(human);
        }
    }
}
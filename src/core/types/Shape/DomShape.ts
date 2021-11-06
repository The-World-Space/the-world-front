import { Size } from "../Base";
import { Shape } from "./Shape";


export class DomShape extends Shape {
    private _dom: HTMLElement;
    
    constructor(size: Size, dom: HTMLElement) {
        super(size);
        this._dom = dom;
    }

    getDom() {
        return this._dom;
    }

    setDom(dom: HTMLElement) {
        this._dom = dom;
    }
}
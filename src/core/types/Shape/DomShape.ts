import { Size } from "../Base";
import { Shape } from "./Shape";


export class DomShape<T extends HTMLElement> extends Shape {
    private _dom: T;
    
    constructor(size: Size, dom: T) {
        super(size);
        this._dom = dom;
    }

    getDom() {
        return this._dom;
    }

    setDom(dom: T) {
        this._dom = dom;
    }
}
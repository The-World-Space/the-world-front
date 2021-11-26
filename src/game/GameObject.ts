import { Object3D } from "three";
import { Component } from "./Component";

export class GameObject extends Object3D {
    private _components: Component[] = [];

    constructor() {
        super();
    }

    public addComponent(component: Component) {
        this._components.push(component);
    }

    public getComponents(): Component[] {
        return this._components.slice();
    }

    public getComponent<T extends Component>(type: { new (): T }): T | null {
        for (const c of this._components) {
            if (c instanceof type) return c;
        }
        return null;
    }
    
    public update() {
        let componentLength = this._components.length;
        for (let i = 0; i < componentLength; i++) {
            this._components[i].update();
            
            if (componentLength !== this._components.length) {
                i--;
                componentLength = this._components.length;
            }
        }
    }

    public destroy() {
        for (const component of this._components) {
            component.destroy();
        }
        this.parent = null;
    }
}

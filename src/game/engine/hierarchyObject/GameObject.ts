import { Object3D, Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { GameManager } from "../GameManager";

export class GameObject extends Object3D {
    private _gameManager: GameManager;
    private _components: (Component|null)[];

    public constructor(gameManager: GameManager, name: string) {
        super();
        this._gameManager = gameManager;
        this._components = [];
        this.name = name;
    }

    public addComponent(componentCtor: ComponentConstructor): void {
        const component = new componentCtor(this);
        if (component.disallowMultipleComponent) {
            const existingComponent = this.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this.name}`);
                return;
            }
        }
        for (const requiredComponentCtor of component.requiredComponents) {
            const requiredComponent = this.getComponent(requiredComponentCtor);
            if (!requiredComponent) {
                console.warn(`Component ${requiredComponentCtor.name} is required by Component ${componentCtor.name} on GameObject ${this.name}`);
                return;
            }
        }
        let pushedAtIteration = false;
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === null) {
                this._components[i] = component;
                pushedAtIteration = true;
                break;
            }
        }
        if (!pushedAtIteration) this._components.push(component);

        component.enabled = true; //start component
    }

    public getComponents(): Component[] {
        return this._components.filter(c => c !== null) as Component[];
    }

    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        for (const component of this._components) {
            if (component instanceof componentCtor) return component;
        }
        return null;
    }

    public foreachComponent(callback: (component: Component) => void): void {
        for (const component of this._components) {
            if (component) callback(component);
        }
    }

    public removeComponent(component: Component): void {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === component) {
                component.onDestroy();
                this._components[i] = null;
                break;
            }
        }
    }
    
    public update(): void {
        let componentLength = this._components.length;
        for (let i = 0; i < componentLength; i++) {
            this._components[i]?.update();
        }
    }

    public destroy(): void {
        for (const component of this._components) {
            component?.onDestroy();
        }
        this.children.forEach(child => {
            if (child instanceof GameObject) child.destroy();
        });
        this.parent = null;
    }

    public get gameManager(): GameManager {
        return this._gameManager;
    }

    private checkComponentRequirements(): void {
        let componentRemoved = false;
        for (const component of this._components) {
            if (component) {
                for (const requiredComponentCtor of component.requiredComponents) {
                    const requiredComponent = this.getComponent(requiredComponentCtor);
                    if (!requiredComponent) {
                        console.warn(`Component ${requiredComponentCtor.name} is required by Component ${component.constructor.name} on GameObject ${this.name}`);
                        this.removeComponent(component);
                        componentRemoved = true;
                        return;
                    }
                }
            }
        }
        if (componentRemoved) this.checkComponentRequirements();
    }

    public static readonly Builder = class Builder{
        private readonly _gameObject: GameObject;
        private readonly _children: Builder[];
        private readonly _componentInitializeFuncList: (() => void)[];

        public constructor(gameManager: GameManager, name: string);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
            this._gameObject = new GameObject(gameManager, name);
            if (localPosition) this._gameObject.position.copy(localPosition);
            if (localRotation) this._gameObject.quaternion.copy(localRotation);
            if (localScale) this._gameObject.scale.copy(localScale);
            this._children = [];
            this._componentInitializeFuncList = [];
        }

        public withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): Builder;

        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): Builder;
    
        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): Builder {
            const component = new componentCtor(this._gameObject);
            if (component.disallowMultipleComponent) {
                const existingComponent = this._gameObject.getComponent(componentCtor);
                if (existingComponent) {
                    console.warn(`Component ${componentCtor.name} already exists on GameObject ${this._gameObject.name}`);
                    return this;
                }
            }
            this._gameObject._components.push(component);
            if (componentInitializeFunc) {
                this._componentInitializeFuncList.push(() => componentInitializeFunc(component));
            }
            return this;
        }

        public withChild(child: Builder): Builder {
            this._children.push(child);
            return this;
        }

        public build(): GameObject {
            this._gameObject.checkComponentRequirements();
            for (const child of this._children) this._gameObject.add(child.build());
            return this._gameObject;
        }

        public initialize(): void {
            for (const componentInitializeFunc of this._componentInitializeFuncList) {
                componentInitializeFunc();
            }
            for (const child of this._children) child.initialize();
        }
    }
}

export type GameObjectBuilder = InstanceType<typeof GameObject.Builder>;

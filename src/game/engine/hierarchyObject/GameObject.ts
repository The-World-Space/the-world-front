import { Object3D, Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { GameManager } from "../GameManager";

//'visible' property has same value as 'activeInHierarchy'
//you must not change it directly use 'activeInHierarchy' instead
export class GameObject extends Object3D {
    private _activeInHierarchy: boolean;
    private _activeSelf: boolean;
    private _components: (Component|null)[];
    private _gameManager: GameManager;

    public constructor(gameManager: GameManager, name: string) {
        super();
        this._activeInHierarchy = true;
        this.visible = true;
        this._activeSelf = true;
        this._components = [];
        this._gameManager = gameManager;
        this.name = name;
    }

    public add(...object: Object3D[]): this {
        super.add(...object);
        for (const child of object) {
            if (child instanceof GameObject) {
                if (child._activeSelf) child.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy

                if (child._activeInHierarchy) child.initComponents();
            }
        }
        return this;
    }

    private addWithNoinit(gameObject: GameObject): void {
        super.add(gameObject);
        if (gameObject._activeSelf) gameObject.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy        
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

        if (this._activeInHierarchy) {
            component.onEnable();
            component.start();
        }
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
                component.enabled = false;
                component.onDestroy();
                this._components[i] = null;
                break;
            }
        }
    }
    
    public update(): void {
        if (!this._activeInHierarchy) return;

        let componentLength = this._components.length;
        for (let i = 0; i < componentLength; i++) {
            if (this._components[i] === null) continue;
            const component = this._components[i]!;
            if (component.enabled) component.update();
        }
    }

    public destroy(): void {
        for (const component of this._components) {
            if (component) {
                component.enabled = false;
                component.onDestroy();
            }
        }
        this.children.forEach(child => {
            if (child instanceof GameObject) child.destroy();
        });
        this.parent = null;
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
                    }
                }
            }
        }
        if (componentRemoved) this.checkComponentRequirements();
    }

    private initComponents(): void {
        for (const component of this._components) {
            if (!component) continue;
            if (component.enabled) {
                component.onEnable();
                component.start();
            }
        }
    }

    public get gameManager(): GameManager {
        return this._gameManager;
    }

    public get activeInHierarchy(): boolean {
        return this._activeInHierarchy;
    }

    private set activeInHierarchy(value: boolean) {
        if (this._activeInHierarchy === value) return;

        this._activeInHierarchy = value;
        this.visible = this._activeInHierarchy;

        this.children.forEach(child => {
            if (child instanceof GameObject) {
                if (this._activeInHierarchy) {
                    child.activeInHierarchy = child._activeSelf;
                } else {
                    child.activeInHierarchy = false;
                }
            }
        });
    }

    public get activeSelf(): boolean {
        return this._activeSelf;
    }

    public set activeSelf(value: boolean) {
        if (this._activeSelf === value) return;

        this._activeSelf = value;
        if (this.parent instanceof GameObject) { // if parent is a gameobject
            if (this.parent._activeInHierarchy) {
                this.activeInHierarchy = this._activeSelf;
            } else {
                this.activeInHierarchy = false;
            }
        } else { // parent is root it means parent always active in hierarchy
            this.activeInHierarchy = this._activeSelf;
        }
    }

    public static readonly Builder = class Builder{
        private readonly _gameObject: GameObject;
        private readonly _children: Builder[];
        private readonly _componentInitializeFuncList: (() => void)[];

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
            for (const child of this._children) this._gameObject.addWithNoinit(child.build());
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

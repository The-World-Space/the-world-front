import { Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { PrefabRef } from "./PrefabRef";
import { Transform } from "./Transform";
import { ITransform } from "./ITransform";
import { IEngine } from "../IEngine";

export class GameObject {
    private _transform: Transform;
    private _activeInHierarchy: boolean;
    private _activeSelf: boolean;
    private _components: Component[];
    private _engineGlobalObject: EngineGlobalObject;

    public constructor(engineGlobalObject: EngineGlobalObject, name: string) {
        this._activeInHierarchy = true;
        this._transform = new Transform(this);
        this._transform.visible = true;
        this._transform.name = name;
        this._activeSelf = true;
        this._components = [];
        this._engineGlobalObject = engineGlobalObject;
    }

    private registerTransform(transform: Transform): void {
        this._transform.add(transform);
        const gameObject = transform.gameObject;

        if (gameObject._activeSelf) {
            gameObject.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy
        }
    }

    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        this.registerTransform(gameObject._transform);
        gameObject.foreachComponentInChildren(component => {
            component.tryCallAwake();
        });
        if (gameObject._activeInHierarchy) {
            gameObject.foreachComponentInChildren(component => {
                if (component.enabled) {
                    component.onEnable();
                    component.tryEnqueueStart();
                    component.tryEnqueueUpdate();
                }
            });
        }
    }

    public changeParent(newParent: GameObject): void {
        const prevActiveInHierarchy = this._activeInHierarchy;
        this._transform.removeFromParent();
        this.registerTransform(newParent._transform);
        if (!prevActiveInHierarchy) {
            if (this.activeInHierarchy) {
                this.foreachComponentInChildren(component => {
                    component.enabled = true;
                });
            }
        } else {
            if (!this.activeInHierarchy) {
                this.foreachComponentInChildren(component => {
                    component.onDisable();
                    component.tryDequeueUpdate();
                });
            }
        }
    }

    public addComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T|null {
        const component = new componentCtor(this);
        if (component.disallowMultipleComponent) {
            const existingComponent = this.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this.name}`);
                return null;
            }
        }
        for (const requiredComponentCtor of component.requiredComponents) {
            const requiredComponent = this.getComponent(requiredComponentCtor);
            if (!requiredComponent) {
                console.warn(`Component ${requiredComponentCtor.name} is required by Component ${componentCtor.name} on GameObject ${this.name}`);
                return null;
            }
        }
        this._components.push(component);

        component.tryCallAwake();
        if (this._activeInHierarchy) {
            if (component.enabled) {
                component.onEnable();
                component.tryEnqueueStart();
                component.tryEnqueueUpdate();
            }
        }
        return component;
    }

    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        for (const component of this._components) {
            if (component instanceof componentCtor) return component;
        }
        return null;
    }

    public getComponents(): Component[];

    public getComponents<T extends Component>(componentCtor: ComponentConstructor<T>): T[];

    public getComponents<T extends Component>(componentCtor?: ComponentConstructor<T>): T[] {
        if (!componentCtor) return this._components.slice() as T[];
        const components: T[] = [];
        for (const component of this._components) {
            if (component instanceof componentCtor) {
                components.push(component);
            }
        }
        return components;
    }

    //Returns the component of Type type in the GameObject or any of its children using depth first search.
    public getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        const components = this.getComponent(componentCtor);
        if (components) return components;
        this._transform.foreachChild(child => {
            if (child instanceof Transform) {
                const component = child.gameObject.getComponentInChildren(componentCtor);
                if (component) return component;
            }
        });
        return null;
    }

    public getComponentsInChildren(): Component[];

    public getComponentsInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T[];

    //Returns all components of Type type in the GameObject or any of its children. Works recursively.
    public getComponentsInChildren<T extends Component>(componentCtor?: ComponentConstructor<T>): T[] {
        if (!componentCtor) {
            const components = this.getComponents();
            this._transform.foreachChild(child => {
                components.push(...child.gameObject.getComponentsInChildren());
            });
            return components as T[];
        }
        else {
            const components: T[] = this.getComponents(componentCtor);
            this._transform.foreachChild(child => {
                const childComponents = child.gameObject.getComponentsInChildren(componentCtor);
                components.push(...childComponents);
            });
            return components;
        }
    }

    public foreachComponent(callback: (component: Component) => void): void;

    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        if (!componentCtor) {
            for (const component of this._components) {
                callback(component as T);
            }
        } else {
            for (const component of this._components) {
                if (component instanceof componentCtor) {
                    callback(component);
                }
            }
        }
    }

    public foreachComponentInChildren(callback: (component: Component) => void): void;

    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        if (!componentCtor) {
            this.foreachComponent(callback as (component: Component) => void);
            this._transform.foreachChild(child => {
                child.gameObject.foreachComponentInChildren(callback as (component: Component) => void);
            });
        } else {
            this.foreachComponent(callback, componentCtor);
            this._transform.foreachChild(child => {
                child.gameObject.foreachComponentInChildren(callback, componentCtor);
            });
        }
    }

    public removeComponent(component: Component): void {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === component) {
                component.enabled = false;
                component.onDestroy();
                this._components.splice(i, 1);
                break;
            }
        }
    }

    public destroy(): void {
        for (const component of this._components) {
            component.enabled = false;
            component.onDestroy();
        }
        this._transform.childrenTransform.forEach(child => { // modified values in foreach but array is not modified
            if (child instanceof Transform) child.gameObject.destroy();
        });
        this._transform.removeFromParent();
        this._transform.parent = null;
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

    public get engine(): IEngine {
        return this._engineGlobalObject;
    }

    public get activeInHierarchy(): boolean {
        return this._activeInHierarchy;
    }

    private set activeInHierarchy(value: boolean) {
        if (this._activeInHierarchy === value) return;

        this._activeInHierarchy = value;
        this._transform.visible = this._activeInHierarchy;

        if (this._activeInHierarchy) {
            //enable components
            for (const component of this._components) {
                if (component.enabled) {
                    component.onEnable();
                    component.tryEnqueueStart();
                    component.tryEnqueueUpdate();
                }
            }
        } else {
            for (const component of this._components) {
                if (component.enabled) {
                    //disable components
                    component.onDisable();
                    //dequeue update
                    component.tryDequeueUpdate();
                }
            }
        }

        this._transform.foreachChild(child => {
            if (child instanceof Transform) {
                const gameObject = child.gameObject;
                if (this._activeInHierarchy) {
                    gameObject.activeInHierarchy = gameObject._activeSelf;
                } else {
                    gameObject.activeInHierarchy = false;
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
        if (this._transform.parent instanceof Transform) { // if parent is a gameobject
            if (this._transform.parent.gameObject._activeInHierarchy) {
                this.activeInHierarchy = this._activeSelf;
            } else {
                this.activeInHierarchy = false;
            }
        } else { // parent is root it means parent always active in hierarchy
            this.activeInHierarchy = this._activeSelf;
        }
    }

    //DO NOT cast this to Transform, instead use unsafeGetTransform
    public get transform(): ITransform {
        return this._transform;
    }

    public get name(): string {
        return this._transform.name;
    }

    public set name(value: string) {
        this._transform.name = value;
    }

    public get uuid(): string {
        return this._transform.uuid;
    }

    public get id(): number {
        return this._transform.id;
    }

    //'visible' property has same value as 'activeInHierarchy'
    //you must not change it directly, use 'activeInHierarchy' instead
    //'add' method is not available for GameObject it for other Object3D classes
    public unsafeGetTransform(): Transform {
        return this._transform;
    }

    public static readonly GameObjectBuilder = class GameObjectBuilder{
        private readonly _gameObject: GameObject;
        private readonly _children: GameObjectBuilder[];
        private readonly _componentInitializeFuncList: (() => void)[];

        public constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
            this._gameObject = new GameObject(engineGlobalObject, name);
            const transform = this._gameObject.transform;
            if (localPosition) transform.position.copy(localPosition);
            if (localRotation) transform.quaternion.copy(localRotation);
            if (localScale) transform.scale.copy(localScale);
            this._children = [];
            this._componentInitializeFuncList = [];
        }

        public active(active: boolean): GameObjectBuilder {
            this._gameObject.activeSelf = active;
            return this;
        }

        public getGameObject(gameObjectRef: PrefabRef<GameObject>): GameObjectBuilder {
            gameObjectRef.ref = this._gameObject;
            return this;
        }

        public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder {
            componentRef.ref = this._gameObject.getComponent(componentCtor);
            return this;
        }

        public getComponents(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;

        public getComponents<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder;

        public getComponents<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder {
            if (componentCtor) {
                componentsRef.ref = this._gameObject.getComponents(componentCtor);
            }
            else {
                componentsRef.ref = this._gameObject.getComponents() as T[];
            }
            return this;
        }

        public getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder {
            componentRef.ref = this._gameObject.getComponentInChildren(componentCtor);
            return this;
        }

        public getComponentsInChildren(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;

        public getComponentsInChildren<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder;

        public getComponentsInChildren<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder {
            if (componentCtor) {
                componentsRef.ref = this._gameObject.getComponentsInChildren(componentCtor);
            }
            else {
                componentsRef.ref = this._gameObject.getComponentsInChildren() as T[];
            }
            return this;
        }

        public withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): GameObjectBuilder;

        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): GameObjectBuilder;
    
        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): GameObjectBuilder {
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

        public withChild(child: GameObjectBuilder): GameObjectBuilder {
            this._children.push(child);
            return this;
        }

        public build(): GameObject {
            this._gameObject.checkComponentRequirements();
            for (const child of this._children) this._gameObject.registerTransform(child.build()._transform);
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

export type GameObjectBuilder = InstanceType<typeof GameObject.GameObjectBuilder>;

import { Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { GameManager } from "../GameManager";
import { PrefabRef } from "./PrefabRef";
import { Transform } from "./Transform";
import { ITransform } from "./ITransform";

export class GameObject {
    private _transform: Transform;
    private _activeInHierarchy: boolean;
    private _activeSelf: boolean;
    private _components: (Component|null)[];
    private _componentCount: number;
    private _gameManager: GameManager;

    private static readonly componentsNeedCompactCount = 16;

    public constructor(gameManager: GameManager, name: string) {
        this._activeInHierarchy = true;
        this._transform = new Transform(this);
        this._transform.visible = true;
        this._transform.name = name;
        this._activeSelf = true;
        this._components = [];
        this._componentCount = 0;
        this._gameManager = gameManager;
    }

    private registerTransform(transform: Transform): void {
        this._transform.add(transform);
        const gameObject = transform.attachedGameObject;

        if (gameObject._activeSelf) {
            gameObject.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy
        }

        if (gameObject._activeInHierarchy) {
            transform.traverseVisible(item => {
                if (item instanceof Transform) item.attachedGameObject.tryEnableComponents();
            });

            transform.traverseVisible(item => {
                if (item instanceof Transform) item.attachedGameObject.tryStartComponents();
            });
        }
    }

    private registerTransformWithNoinit(gameObject: GameObject): void {
        this._transform.add(gameObject._transform);
        if (gameObject._activeSelf) gameObject.activeInHierarchyWithoutCallEvent = this._activeInHierarchy; // update child activeInHierarchy        
    }
    
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        this.registerTransform(gameObject._transform);
    }

    public changeParent(newParent: GameObject): void {
        const prevActiveInHierarchy = this._activeInHierarchy;
        this._transform.removeFromParent();
        this.registerTransformWithNoinit(newParent);
        if (!prevActiveInHierarchy) {
            if (this.activeInHierarchy) {
                this._transform.traverseVisible(item => {
                    if (item instanceof Transform) item.attachedGameObject.tryEnableComponents();
                });
                this._transform.traverseVisible(item => {
                    if (item instanceof Transform) item.attachedGameObject.tryStartComponents();
                });
            }
        } else {
            if (!this.activeInHierarchy) {
                //traverseVisible is also iterate root so it's not necessary
                //but there might be a bug, so I leave the code for a memo
                //this.disableComponents();
                this._transform.traverseVisible(item => {
                    if (item instanceof Transform) item.attachedGameObject.disableComponents();
                });
            }
        }
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
        this._components.push(component);
        this._componentCount += 1;

        if (this._activeInHierarchy) {
            component.onEnable();
            component.tryCallStart();
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
                this._componentCount -= 1;
                break;
            }
        }
    }

    private tryComponentsCompact(): void {
        if (GameObject.componentsNeedCompactCount <= this._components.length - this._componentCount) {
            const newComponents: Component[] = [];
            for (const component of this._components) {
                if (component) newComponents.push(component);
            }
            this._components = newComponents;
        }
    }
    
    public update(): void {
        if (!this._activeInHierarchy) return; // intended useless check

        this.tryComponentsCompact();
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
        this._transform.children.forEach(child => {
            if (child instanceof Transform) child.attachedGameObject.destroy();
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

    private tryEnableComponents(): void {
        for (const component of this._components) {
            if (!component) continue;
            if (component.enabled) {
                component.onEnable();
            }
        }
    }

    private tryStartComponents(): void {
        for (const component of this._components) {
            if (!component) continue;
            if (component.enabled) {
                component.tryCallStart();
            }
        }
    }

    private disableComponents(): void {
        for (const component of this._components) {
            if (!component) continue;
            if (component.enabled) {
                component.onDisable();
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
        this._transform.visible = this._activeInHierarchy;

        if (this._activeInHierarchy) {
            this.tryEnableComponents();
            this.tryStartComponents();
        } else {
            this.disableComponents();
        }

        this._transform.children.forEach(child => {
            if (child instanceof Transform) {
                const gameObject = child.attachedGameObject;
                if (this._activeInHierarchy) {
                    gameObject.activeInHierarchy = gameObject._activeSelf;
                } else {
                    gameObject.activeInHierarchy = false;
                }
            }
        });
    }

    private set activeInHierarchyWithoutCallEvent(value: boolean) {
        if (this._activeInHierarchy === value) return;

        this._activeInHierarchy = value;
        this._transform.visible = this._activeInHierarchy;

        this._transform.children.forEach(child => {
            if (child instanceof Transform) {
                const gameObject = child.attachedGameObject;
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
            if (this._transform.parent.attachedGameObject._activeInHierarchy) {
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

    public static readonly Builder = class Builder{
        private readonly _gameObject: GameObject;
        private readonly _children: Builder[];
        private readonly _componentInitializeFuncList: (() => void)[];

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
            this._gameObject = new GameObject(gameManager, name);
            const transform = this._gameObject.transform;
            if (localPosition) transform.position.copy(localPosition);
            if (localRotation) transform.quaternion.copy(localRotation);
            if (localScale) transform.scale.copy(localScale);
            this._children = [];
            this._componentInitializeFuncList = [];
        }

        public active(active: boolean): Builder {
            this._gameObject.activeSelf = active;
            return this;
        }

        public getGameObject(gameObjectRef: PrefabRef<GameObject>): Builder {
            gameObjectRef.ref = this._gameObject;
            return this;
        }

        public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): Builder {
            componentRef.ref = this._gameObject.getComponent(componentCtor);
            return this;
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
            for (const child of this._children) this._gameObject.registerTransformWithNoinit(child.build());
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

import { Object3D, Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { GameManager } from "./GameManager";

export class GameObject extends Object3D {
    private _gameManager: GameManager;
    private _components: (Component|null)[];

    public constructor(gameManager: GameManager, name: string) {
        super();
        this._gameManager = gameManager;
        this._components = [];
        this.name = name;
    }

    public addComponent(componentCtor: ComponentConstructor) {
        const component = new componentCtor(this);
        let pushedAtIteration = false;
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === null) {
                this._components[i] = component;
                pushedAtIteration = true;
                break;
            }
        }
        if (!pushedAtIteration) this._components.push(component);
    }

    public getComponents(): Component[] {
        return this._components.filter(c => c !== null) as Component[];
    }

    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        for (const c of this._components) {
            if (c instanceof componentCtor) return c;
        }
        return null;
    }
    
    public update() {
        let componentLength = this._components.length;
        for (let i = 0; i < componentLength; i++) {
            this._components[i]?.update();
        }
    }

    public destroy() {
        for (const component of this._components) {
            component?.destroy();
        }
        this.parent = null;
    }

    get gameManager(): GameManager {
        return this._gameManager;
    }

    public static readonly Builder = class Builder{
        private readonly gameObject: GameObject;
        private readonly children: Builder[];
        private readonly componentInitializeFuncList: (() => void)[];

        public constructor(gameManager: GameManager, name: string);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3);

        public constructor(gameManager: GameManager, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
            this.gameObject = new GameObject(gameManager, name);
            if (localPosition) this.gameObject.position.copy(localPosition);
            if (localRotation) this.gameObject.quaternion.copy(localRotation);
            if (localScale) this.gameObject.scale.copy(localScale);
            this.children = [];
            this.componentInitializeFuncList = [];
        }

        public withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): Builder;
    
        public withComponent<T extends Component>(
            componentCtor: ComponentConstructor<T>,
            componentInitializeFunc?: (component: T) => void
        ): Builder {
            const component = new componentCtor(this.gameObject);
            this.gameObject._components.push(component);
            if (componentInitializeFunc) {
                this.componentInitializeFuncList.push(() => componentInitializeFunc(component));
            }
            return this;
        }

        public withChild(child: Builder): Builder {
            this.children.push(child);
            return this;
        }

        public build(): GameObject {
            for (const child of this.children) this.gameObject.add(child.build());
            return this.gameObject;
        }

        public initialize(): void {
            for (const componentInitializeFunc of this.componentInitializeFuncList) {
                componentInitializeFunc();
            }
            for (const child of this.children) child.initialize();
        }
    }
}

export type GameObjectBuilder = InstanceType<typeof GameObject.Builder>;
